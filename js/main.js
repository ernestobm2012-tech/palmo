(function () {
  var WHATSAPP = '34674125761';
  var EMAIL = 'info@palmo.es';

  // Menú móvil
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });

  // Sombra de la cabecera al hacer scroll
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Enlace activo del menú según la sección visible
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) spy.observe(s);
    });

    // Animación de entrada
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Pestañas de impresión
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (next === null) return;
      var t = tabs[(next + tabs.length) % tabs.length];
      selectTab(t);
      t.focus();
    });
  });

  // Los enlaces con data-topic preseleccionan el tema en el formulario
  var tema = document.getElementById('tema');
  document.querySelectorAll('[data-topic]').forEach(function (el) {
    el.addEventListener('click', function () {
      var topic = el.getAttribute('data-topic');
      Array.prototype.forEach.call(tema.options, function (o) {
        if (o.text === topic) tema.value = o.value;
      });
    });
  });

  // Formulario: sin servidor, abre email o WhatsApp con el mensaje ya redactado
  var form = document.getElementById('contact-form');
  var msg = form.querySelector('.form__msg');
  var via = 'email';
  form.querySelectorAll('button[type="submit"]').forEach(function (b) {
    b.addEventListener('click', function () { via = b.getAttribute('data-via'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var invalid = [];
    form.querySelectorAll('[required]').forEach(function (field) {
      var ok = field.type === 'checkbox' ? field.checked : field.value.trim() !== '' && field.checkValidity();
      field.classList.toggle('is-invalid', !ok);
      if (!ok) invalid.push(field);
    });
    if (invalid.length) {
      msg.className = 'form__msg is-error';
      msg.textContent = 'Revisa los campos marcados y acepta la política de privacidad.';
      invalid[0].focus();
      return;
    }

    var d = new FormData(form);
    var subject = 'Consulta web: ' + d.get('tema');
    var body = [
      'Nombre: ' + d.get('nombre'),
      d.get('empresa') ? 'Empresa: ' + d.get('empresa') : '',
      'Email: ' + d.get('email'),
      d.get('telefono') ? 'Teléfono: ' + d.get('telefono') : '',
      'Tema: ' + d.get('tema'),
      '',
      d.get('mensaje')
    ].filter(function (l, i) { return l !== '' || i === 5; }).join('\n');

    if (via === 'whatsapp') {
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(subject + '\n\n' + body), '_blank', 'noopener');
    } else {
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }
    msg.className = 'form__msg is-ok';
    msg.textContent = 'Hemos preparado tu mensaje. Solo tienes que enviarlo desde tu ' + (via === 'whatsapp' ? 'WhatsApp.' : 'correo.');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
