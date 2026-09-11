# Portfolio de Francisco Larrosa

Rediseño del portfolio existente, conservando Angular 19, TypeScript, SCSS,
Tailwind, los proyectos, el CV, el selector ES/EN, los temas claro/oscuro y EmailJS.

## Ejecutar

Usar Node.js 22 LTS y npm.

```bash
npm ci
npm start
```

Abrir la dirección que indique Angular CLI (normalmente http://localhost:4200).

## Compilar

```bash
npm run prod
```

El sitio compilado queda en `dist/portfolio/browser/`.
`CNAME`, `robots.txt` y `sitemap.xml` se copian automáticamente desde la raíz
mediante `angular.json`. Ya no hace falta el comando `copy` específico de Windows.
El comando de deploy original continúa disponible; ejecutarlo publica el sitio.

## Ajustes de esta versión

- Tecnologías: grilla de nueve elementos, con Angular, TypeScript y Tailwind
  destacados. Nuevo título: «Mi stack. Listo para crear.» (también en inglés).
- Hero: entrada escalonada del título, retrato, botones y tarjeta de experiencia;
  destello suave y movimiento inicial del símbolo de código. El retrato reacciona
  sutilmente al mouse en dispositivos con puntero preciso.
- Scroll: entradas independientes para proyectos, textos, foto, tecnologías,
  formulario y footer. Se pueden repetir al regresar desde arriba.
- Las tres tarjetas secundarias comparten altura de imagen y encuadre. Las
  capturas se recortan desde arriba dentro del marco, sin deformarse.
- La tarjeta de experiencia ocupa su propio espacio debajo del retrato para
  evitar el cruce con el nombre y la ubicación en ambos temas.
- Se respeta la preferencia de movimiento reducido, incluso si cambia durante
  la visita. No se agregaron librerías ni animaciones automáticas infinitas.

## Qué cambió

- Portada orientada a clientes, retrato y accesos a proyectos y contacto.
- Galería con las capturas originales: 7Ideas destacado, Clínica de Ojos,
  Reparaciones Iván y BioMind. Enlaces al sitio y al código cuando corresponde.
- Presentación personal, detalles técnicos desplegables y tecnologías compactas.
- Contacto sobre fondo violeta, formulario con etiquetas y errores por campo,
  foco en el primer error, protección frente a envíos duplicados y confirmación.
- Footer, menú móvil, navegación por teclado, preferencia de movimiento reducido
  y diseño adaptable en ambos temas.
- Los íconos de interfaz son SVG locales; se quitó la dependencia del kit remoto
  de Font Awesome. Las fuentes mantienen su carga desde Google Fonts y tienen
  alternativas del sistema si el proveedor no responde.
- Metadatos de experiencia alineados con los 4+ años indicados en el contenido
  original. Imagen social y dominio conservados.

## Archivos principales

- `src/app/app.component.html`: estructura y textos ES/EN.
- `src/app/app.component.scss`: composición, secciones y adaptación responsive.
- `src/app/app.component.ts`: proyectos, preferencias, navegación y formulario.
- `src/styles.scss`: paleta, temas y estilos base.
- `src/assets/styles/portfolio-layout.scss`: cabecera, footer, botones y campos.
- `src/assets/styles/portfolio-stack.scss`: grilla de tecnologías.
- `src/assets/styles/portfolio-motion.scss`: animaciones y movimiento reducido.
- `angular.json`: recursos de publicación y hojas de estilos.

Los proyectos se editan en `projects` dentro del componente. Las imágenes están
en `src/assets/img`. No se añadieron dependencias ni se actualizó Angular.

## Validación de esta entrega

- Compilación Angular de producción y comprobación de recursos locales.
- Pruebas de lógica del formulario con EmailJS simulado: campos requeridos,
  espacios vacíos, email inválido, foco en errores, envío duplicado,
  limpieza al tener éxito y conservación del texto ante un error.
- Comprobaciones de preferencias de idioma y tema, y cierre del menú con Escape.
- Pruebas de lógica del movimiento: entrada, repetición, contenido visible en
  enlaces directos, preferencia de movimiento reducido, límites del efecto del
  puntero y limpieza de observadores/eventos.
- No se realizó una revisión visual en navegador ni una entrega real por EmailJS.
  La configuración de EmailJS es la original; conviene comprobar el envío desde
  el dominio final y revisar la presentación en tus dispositivos antes de publicar.

El ZIP contiene el código fuente y los recursos. No incluye node_modules,
dist, cachés, credenciales nuevas ni archivos de pruebas temporales.
