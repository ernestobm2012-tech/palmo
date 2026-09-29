# Palmo · Nueva web corporativa

Rediseño de [palmo.es](https://palmo.es) (Palmo Suministro Integral) como web corporativa moderna, rápida y adaptada a móvil.

Web estática (HTML + CSS + JS, sin dependencias ni proceso de build), publicable en GitHub Pages o en cualquier hosting.

## Estructura

```
index.html          Página principal (una sola página con secciones)
css/styles.css      Estilos (colores de marca en :root)
js/main.js          Menú móvil, pestañas, animaciones y formulario
assets/img/         Logos e imágenes
```

## Ver en local

Abre `index.html` en el navegador, o levanta un servidor:

```bash
npx serve .
```

## Formulario de contacto

Al no haber servidor, el formulario prepara el mensaje y lo abre en el correo (`info@palmo.es`) o en WhatsApp. Si más adelante se quiere recibir directamente, se puede conectar a un servicio como Formspree o al backend del hosting definitivo.

## Enlaces a la web actual

El acceso de distribuidores, la tienda, el blog y las páginas legales siguen apuntando a palmo.es.

## Flujo de trabajo

- Los cambios se hacen en la rama `desarrollo` y se proponen a `main` mediante un Pull Request.
- `main` es lo que está publicado en GitHub Pages: al fusionar (merge) el PR, la web se actualiza en 1-2 minutos.
- Al cambiar `css/styles.css` o `js/main.js`, sube el número `?v=` con el que se enlazan en `index.html` para que los navegadores no usen la versión antigua de su caché.
