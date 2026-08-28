# PROMPT MAESTRO — CAR HAUS LLC | LANDING 3D INMERSIVA

Construye una landing page de pantalla completa para **Car Haus LLC**, dealer automotriz ubicado en Pharr, Texas y especializado principalmente en Toyota Tacoma. La experiencia debe sentirse cinematográfica, premium, robusta y tecnológica: fondo negro, iluminación roja, reflejos sobre piso oscuro, profundidad por capas y un carrusel inmersivo de cinco vehículos controlado con la rueda del mouse, gestos táctiles y navegación visible.

El objetivo no es crear un configurador de autos ficticios. Es convertir visitantes del Rio Grande Valley en prospectos mediante WhatsApp, llamada o solicitud de información sobre una unidad real. El sitio debe comunicar confianza, transparencia y especialización en Toyota Tacoma.

## 1. INFORMACIÓN COMERCIAL VERIFICADA

- Marca: **Car Haus LLC**
- Especialidad principal: **Toyota Tacoma**
- Versiones comunes: **4x4, 2WD, TRD Off Road, TRD Sport y SR5**
- Ubicación: **913 W U.S. Hwy 83, Suite C, Pharr, TX 78577**
- Teléfono principal y WhatsApp: **956-867-2015**
- Financiamiento: mediante compañías financieras y sujeto a aprobación de crédito
- Aclaración obligatoria: **Car Haus LLC no es Buy Here Pay Here y no ofrece financiamiento en casa**
- Requisitos que pueden mostrarse: ID o licencia, Seguro Social, comprobante de ingresos y comprobante de domicilio
- Confianza: vehículos inspeccionados y listos para manejar
- Garantía comunicada por la marca: **3 meses en motor, transmisión y aire acondicionado**, cuando aplique a la unidad
- Títulos: existen unidades rebuilt profesionalmente reparadas; comunicarlo con transparencia y sin ocultar el tipo de título
- Promoción activa configurable: **4 tanques de gasolina gratis durante el primer mes**, sujeta a vigencia, vehículo seleccionado y términos
- Mercado: Pharr, McAllen, Mission, Edinburg, Harlingen y todo el Rio Grande Valley

No afirmar que todas las unidades tienen las mismas condiciones. Precio, down payment, garantía, promoción, millaje, año, título y disponibilidad deben vivir en el modelo de datos y mostrarse únicamente cuando el campo correspondiente esté activo.

## 2. OBJETIVO VISUAL

Crear una atmósfera inspirada en una presentación automotriz de alto nivel, pero con identidad propia de Car Haus:

- Fondo negro profundo `#050505`.
- Rojo principal `#E10600` y rojo brillante `#FF2A1A`.
- Blanco `#FFFFFF` para información principal.
- Gris acero `#A7ADB4` para información secundaria.
- Pequeños acentos verde WhatsApp únicamente en el CTA correspondiente.
- Halo rojo detrás de cada Tacoma, luz lateral suave, partículas mínimas y reflejo controlado bajo el vehículo.
- Nada de aspecto futurista genérico de auto eléctrico, neón excesivo, cyberpunk azul o interfaz de videojuego.
- La camioneta debe dominar la composición, conservar su arquitectura real y verse fotográfica.
- Usar fotografías reales de cada unidad, recortadas en PNG/WebP transparente. No sustituirlas por stock ni generar una Tacoma diferente.

## 3. ALCANCE Y TECNOLOGÍA

Entregar tres archivos estáticos:

- `index.html`
- `style.css`
- `script.js`

Restricciones:

- React 16 por CDN.
- ReactDOM 16 por CDN.
- React Transition Group v2 por CDN.
- PropTypes y bezier-easing por CDN.
- Sin JSX, npm, bundler, build step ni dependencias locales.
- Todo el árbol se crea con `React.createElement`.
- La experiencia principal ocupa `100svh` y no tiene scroll vertical en desktop.
- En pantallas de poca altura se permite scroll accesible para no cortar información.
- En móvil, usar swipe horizontal y botones anterior/siguiente; no depender de wheel.
- Respetar `prefers-reduced-motion` y ofrecer transiciones simplificadas.

## 4. ASSETS REQUERIDOS

Usar rutas locales fáciles de reemplazar:

```text
assets/logo-carhaus.svg
assets/menu.svg
assets/mouse-scroll.svg
assets/whatsapp.svg
assets/tacoma-01-car.webp
assets/tacoma-01-floor.webp
assets/tacoma-02-car.webp
assets/tacoma-02-floor.webp
assets/tacoma-03-car.webp
assets/tacoma-03-floor.webp
assets/tacoma-04-car.webp
assets/tacoma-04-floor.webp
assets/tacoma-05-car.webp
assets/tacoma-05-floor.webp
```

Si un asset falta, mostrar un bloque elegante con el texto “Foto de unidad pendiente”; nunca cargar imágenes aleatorias externas.

## 5. MODELO DE DATOS

Declarar `const vehicles = [...]` a nivel de módulo. Crear cinco objetos editables con esta estructura:

```js
{
  id: 1,
  year: "2021",
  make: "Toyota",
  model: "Tacoma",
  trim: "TRD Sport",
  drivetrain: "4x4",
  titleType: "Rebuilt",
  titleDisclosure: "Título rebuilt — reparación profesional e inspección disponible",
  mileage: "Actualizar",
  price: "Actualizar",
  downPayment: "Desde $2,000 con crédito aprobado",
  warranty: "3 meses: motor, transmisión y A/C",
  promotion: "4 tanques de gasolina gratis",
  promotionActive: true,
  available: true,
  accent: "#E10600",
  carImage: "assets/tacoma-01-car.webp",
  floorImage: "assets/tacoma-01-floor.webp"
}
```

Los cinco registros deben quedar claramente marcados como contenido editable. No inventar precios, millaje, VIN o año. Solo el primer objeto puede conservar `2021 Toyota Tacoma TRD Sport` como ejemplo encontrado en la comunicación pública; todo dato no confirmado debe decir `Actualizar` en el código y ocultarse en producción hasta ser reemplazado.

La navegación lateral muestra el nombre corto de cada unidad, por ejemplo: `TRD SPORT`, `TRD OFF ROAD`, `SR5`, `4X4` y `2WD`. Si una unidad está vendida, añadir estado `VENDIDA` y deshabilitar el CTA sin eliminarla automáticamente.

## 6. ESTRUCTURA VISUAL

```text
div.carhaus-app
├── header.carhaus-header
│   ├── logo real de Car Haus
│   ├── badge “Especialistas en Toyota Tacoma”
│   └── botón menú accesible
├── main.inventory-stage
│   ├── nav.vehicle-navigation
│   ├── article.vehicle-slide
│   │   ├── section.vehicle-copy
│   │   │   ├── eyebrow “Disponible en Pharr, TX”
│   │   │   ├── h1 año + Toyota Tacoma
│   │   │   ├── h2 versión + tracción
│   │   │   ├── disclosure del título
│   │   │   └── CTAs
│   │   ├── section.vehicle-visual
│   │   │   ├── halo de color
│   │   │   ├── sombra/reflejo
│   │   │   └── foto real de la unidad
│   │   └── ul.vehicle-facts
│   └── indicador de scroll/swipe
└── aside.trust-strip
    ├── “Vehículos inspeccionados”
    ├── “Garantía disponible”
    └── “Financiamiento con crédito aprobado”
```

En desktop, el texto ocupa aproximadamente 32% y la camioneta 60–65%. La navegación queda en el extremo derecho. En móvil, la camioneta aparece primero visualmente, seguida por título, datos y CTA fijo inferior.

## 7. COPY PRINCIPAL

Usar español natural para el Valle de Texas. No traducir literalmente desde inglés.

Eyebrow:

> TACOMAS DISPONIBLES EN PHARR, TEXAS

Titular por unidad:

> TU PRÓXIMA TACOMA

Subtítulo dinámico:

> {year} Toyota Tacoma {trim} · {drivetrain}

Descripción:

> Lista para el trabajo, la aventura o el uso diario. Conoce su historial, condiciones y opciones de financiamiento antes de decidir.

CTA principal:

> COTIZAR POR WHATSAPP

CTA secundario:

> LLAMAR AL 956-867-2015

Microcopy bajo los botones:

> Financiamiento mediante financieras, sujeto a aprobación de crédito. No somos Buy Here Pay Here.

Mensaje de WhatsApp prellenado, codificado correctamente en URL:

> Hola, vi la {year} Toyota Tacoma {trim} {drivetrain} en la página de Car Haus. ¿Sigue disponible? Quiero conocer precio, down payment y requisitos.

## 8. DATOS ANIMADOS

Reemplazar las métricas eléctricas del prompt original por tres datos comerciales útiles:

1. **Precio** — mostrar solo si está confirmado.
2. **Versión / tracción** — por ejemplo `TRD SPORT · 4X4`.
3. **Garantía** — `3 MESES`, con etiqueta `Motor · transmisión · A/C` cuando aplique.

No animar texto carácter por carácter. Para valores numéricos confirmados, usar contador con `requestAnimationFrame` y easing `BezierEasing(0.4, -0.7, 0.1, 1.5)`. Para texto, usar fade y desplazamiento vertical corto.

## 9. INTERACCIONES

- La rueda del mouse cambia una sola unidad por gesto con debounce de 80 ms.
- No secuestrar el scroll cuando la ventana sea demasiado baja para contener la interfaz.
- Desactivar auto-rotación mientras el usuario interactúa.
- Auto-rotación opcional cada 6 segundos, no cada 2; pausarla al hacer hover, focus, swipe, abrir menú o activar `prefers-reduced-motion`.
- Flechas izquierda/derecha cambian unidad.
- Teclas `ArrowUp`, `ArrowDown`, `ArrowLeft` y `ArrowRight` funcionan.
- Swipe horizontal en móvil con umbral mínimo para evitar cambios accidentales.
- Los indicadores y nombres permiten saltar directamente a una unidad.
- Mantener dirección de animación coherente al avanzar o retroceder.
- El CTA de WhatsApp se actualiza con la unidad activa.
- El botón de llamada usa `tel:+19568672015`.

## 10. TRANSICIONES 3D

Usar React Transition Group v2 y `CSSTransition`. Animar por separado:

- nombre/año;
- descripción;
- badges;
- halo;
- foto del vehículo;
- datos comerciales.

La Tacoma entrante debe aparecer con `translate3d`, ligera rotación Y de 4–6 grados, escala 0.96→1 y opacidad 0→1. La saliente invierte el movimiento. No deformar la camioneta ni exagerar el paralaje. El piso/reflejo entra 80–120 ms antes que la foto para crear sensación de aterrizaje.

Aplicar paralaje sutil por puntero solamente en desktop:

- fondo: máximo 6 px;
- halo: máximo 12 px;
- vehículo: máximo 18 px;
- texto: máximo 4 px.

Usar `requestAnimationFrame`, no actualizar React state en cada movimiento del mouse.

## 11. CONFIANZA Y TRANSPARENCIA

Cada slide puede mostrar badges condicionales:

- `INSPECCIONADA`
- `GARANTÍA 3 MESES`
- `FINANCIAMIENTO DISPONIBLE`
- `TÍTULO REBUILT`
- `PROMO: 4 TANQUES GRATIS`

El badge rebuilt abre un pequeño panel accesible:

> Un título rebuilt indica que el vehículo fue reparado después de haber sido declarado pérdida total. En Car Haus te explicamos el historial y las reparaciones para que sepas exactamente qué estás comprando.

No usar frases como “sin crédito”, “aprobación garantizada”, “cualquier persona califica” o “financiamiento propio”.

## 12. MENÚ

El menú no lleva a páginas ficticias. Debe abrir un panel compacto con:

- Inventario
- Cómo comprar
- Requisitos
- Garantía
- Ubicación
- Facebook
- WhatsApp

`Ubicación` abre Google Maps con la dirección exacta. `Facebook` enlaza a `https://www.facebook.com/Carhaus2021`.

## 13. RESPONSIVE Y ACCESIBILIDAD

- Diseñar primero para 1440×900, luego 390×844.
- Usar `100svh`, áreas seguras iOS y CTA sticky móvil.
- Tamaño táctil mínimo 44×44 px.
- Contraste AA.
- `aria-live="polite"` para el nombre de la unidad activa.
- Alt descriptivo en fotografías: año, modelo, versión y color cuando estén disponibles.
- Focus visible en navegación, botones y paneles.
- El menú se cierra con Escape y devuelve el foco al botón.
- En `prefers-reduced-motion`, desactivar auto-rotación, paralaje, overshoot y grandes desplazamientos.

## 14. SEO Y CONVERSIÓN

Configurar:

```html
<html lang="es-US">
<title>Toyota Tacoma en Pharr, TX | Car Haus LLC</title>
<meta name="description" content="Encuentra Toyota Tacoma 4x4, TRD Off Road, TRD Sport y SR5 en Car Haus LLC, Pharr, Texas. Financiamiento con crédito aprobado.">
```

Agregar Open Graph, canonical editable y JSON-LD tipo `AutoDealer` con nombre, teléfono, dirección y URL de Facebook. No agregar calificación, cantidad de reseñas ni horario sin datos confirmados.

Registrar eventos en `dataLayer` si existe:

- `vehicle_view`
- `vehicle_navigation`
- `whatsapp_click`
- `phone_click`
- `rebuilt_info_open`
- `location_click`

Incluir parámetros de la unidad activa, pero nunca datos personales.

## 15. RENDIMIENTO

- Precargar solo la unidad inicial.
- Lazy-load de las demás imágenes.
- WebP/AVIF con PNG fallback cuando sea necesario para transparencia.
- Reservar dimensiones para evitar layout shift.
- No usar videos pesados en el hero.
- Objetivo Lighthouse móvil: Performance ≥85, Accessibility ≥95, Best Practices ≥95 y SEO ≥95.

## 16. ESTADO INICIAL

Abrir en la unidad que tenga `featured: true`. Si ninguna la tiene, abrir en índice 0. No fijar por código una unidad posiblemente vendida. El título, badges, CTAs, color, foto y mensaje de WhatsApp deben derivarse siempre del objeto activo.

## 17. VERIFICACIÓN FINAL

Antes de entregar, comprobar:

1. Un gesto de rueda cambia exactamente una unidad.
2. El swipe móvil funciona sin bloquear el desplazamiento natural accidentalmente.
3. Nunca aparecen dos nombres o dos camionetas superpuestos al terminar la transición.
4. No se muestra `Actualizar` al visitante: los campos pendientes se ocultan.
5. El mensaje de WhatsApp corresponde a la unidad visible.
6. Teléfono, Facebook y dirección son correctos.
7. La aclaración de financiamiento aparece cerca del CTA.
8. La divulgación rebuilt aparece cuando corresponde.
9. La página sigue siendo usable con teclado y movimiento reducido.
10. No existe contenido ficticio, lorem ipsum, autos eléctricos, millas de autonomía ni métricas 0–60 irrelevantes.

## 18. ENTREGA

Entregar el contenido completo de `index.html`, `style.css` y `script.js`, sin omitir bloques ni usar frases como “resto del código”. Incluir comentarios breves donde el cliente deba reemplazar inventario, precios, fotos, promociones o garantía. El resultado debe abrir directamente al hacer doble clic en `index.html`.

