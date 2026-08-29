/* ==========================================================================
   CAR HAUS LLC — Landing inmersiva | Toyota Tacoma · Pharr, Texas
   JavaScript puro. Sin librerías, sin build, sin CDN.

   POR QUÉ SIN FRAMEWORK
   Los efectos de esta página son transforms atados a la posición del scroll.
   Eso se resuelve escribiendo transform en un solo rAF: un framework mete
   un ciclo de render en medio y aparecen los tirones. La estructura de datos
   sigue siendo la misma de vehicles.json.

   ORDEN DEL ARCHIVO
   01 Configuración         05 Ticker y cifras
   02 Datos                 06 Giro 360
   03 Utilidades y DOM      07 Capacidades
   04 Nav + Hero            08 Inventario, rebuilt, pasos, lugar, footer
                            09 Motor de scroll
   ========================================================================== */
(function () {
  "use strict";

  /* ========================== 01 · CONFIGURACIÓN ==========================
     EDITABLE. Todo lo que cambia sin tocar el resto del archivo.
     ====================================================================== */

  var CONFIG = {
    brand: "Car Haus LLC",
    phoneDisplay: "956-867-2015",
    phoneHref: "tel:+19568672015",
    whatsappNumber: "19568672015",
    address: "913 W U.S. Hwy 83, Suite C, Pharr, TX 78577",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=" +
             encodeURIComponent("913 W U.S. Hwy 83 Suite C, Pharr, TX 78577"),
    facebookUrl: "https://www.facebook.com/Carhaus2021",
    email: "jorgealfonsolopez94@gmail.com",
    /* El PNG original pesa 1.78 MB a 1254px y aqui se usa como icono de
       40px en la barra, en el cargador y como marca de agua del pie. Era el
       archivo mas pesado de toda la pagina, mas que el hero entero. El WebP
       a 512px pesa 69 KB y se ve igual. El PNG queda como fuente. */
    logo: "assets/logo/carhaus-logo.webp",

    /* Catálogo de WhatsApp Business. Formato oficial: wa.me/c/<número>.
       Los botones generales de la página apuntan aquí. */
    catalogUrl: "https://wa.me/c/19568672015",

    /* GIRO 360 — tres fuentes, en orden de preferencia.
       La página prueba video, luego secuencia de fotos, y si no hay ninguna
       usa las fotos del inventario para que el mecanismo se vea funcionando.

       video   → un solo archivo, la reproducción la controla el scroll.
       frames  → assets/360/frame-01.webp … frame-36.webp
       El día que subas cualquiera de los dos, se activa solo. */
    spin: {
      /* Dos codificaciones del mismo recorrido. El teléfono recibe la de
         900 px: pesa 1.2 MB contra 3.3 MB, y en datos celulares la
         diferencia se nota. El efecto es idéntico en las dos. */


      /* Secuencia del recorrido para telefono: 48 WebP, 5.3 MB en total.
         Los telefonos no pintan cuadros de un video movido por scroll, asi
         que ahi se usan imagenes.

         Van a 1280 px y calidad alta a proposito. En vertical la toma se
         muestra SIN estirar (letterbox): a 1280 px de ancho supera los
         pixeles reales de cualquier telefono, y por eso se ve nitida. */
      /* Secuencias del recorrido. NO se usa video en ninguna pantalla.

         Motivo: al arrastrar un video con el scroll, el navegador pinta
         fotogramas decodificados a medias — se ve peor que el archivo real,
         y en escritorio eso se leia como pixelado. Una imagen no tiene ese
         problema: la que se muestra es la que es.

         Escritorio 1920px (7.8 MB), telefono 1600px (3.6 MB). Solo los
         primeros ocho retienen la pagina; el resto llega por detras. */
      filmDir: "assets/360/film/",
      filmDirHd: "assets/360/film-hd/",
      filmCount: 40,

      /* La seccion de giro se sustituyo por la ficha de una sola imagen:
         12 cuadros no alcanzan para que una rotacion se lea como rotacion.
         Los archivos siguen en assets/360/ por si algun dia hay una
         secuencia completa de 24 o 36 cuadros. */
    },

    /* HERO — el destape.
       Las dos imágenes salen del MISMO archivo (frame-01), por eso la lona
       calza exacto sobre la camioneta: la silueta es la suya, no una
       aproximación. Ni una foto real garantizaría esa alineación sin dejar
       el trípode clavado.

       heroImage va a 1024 px; las fotos de assets/vehicles/ son de 500 y a
       pantalla completa se ven blandas.

       Si algún día hay foto real de la lona, se sustituye aquí y ya. */
    heroCover: "assets/hero/hero-cover.webp"
  };

  /* ============================= 02 · DATOS ==============================
     Espejo de vehicles.json. La página abre con doble clic sin servidor, y
     en ese modo el navegador bloquea fetch de archivos locales: por eso los
     datos viven aquí además del JSON.

     Campos en "Actualizar" no se le muestran al visitante.
     frame → medido del recorte del PNG. contact = fracción vertical donde
     tocan las llantas; scale = normaliza el tamaño aparente entre fotos.
     ====================================================================== */

  var vehicles = [
    {
      id: "tacoma-2025-sr-red", featured: true,
      year: 2025, make: "Toyota", model: "Tacoma", trim: "SR", color: "Rojo",
      mileage: 9299, engine: "2.4L Turbo", transmission: "Automática",
      drivetrain: "", cab: "Crew Cab",
      titleType: "Rebuilt", titleDisclosure: "Título rebuilt — bien reparada",
      highlights: ["Lista para uso diario o para el trabajo"],
      price: "Actualizar", downPayment: "Actualizar", warranty: "Actualizar",
      promotion: "Actualizar", promotionActive: false, available: true,
      image: "assets/vehicles/tacoma-2025-sr-red.webp",
      photo: "assets/gallery/galeria-02.webp",
      frame: { contact: 0.732, scale: 1.15, top: 0.294 }
    },
    {
      id: "tacoma-2021-trd-sport-white",
      year: 2021, make: "Toyota", model: "Tacoma", trim: "TRD Sport", color: "Blanco",
      mileage: 49524, engine: "V6 3.5L", transmission: "Automática",
      drivetrain: "2WD", cab: "Double Cab",
      titleType: "Rebuilt", titleDisclosure: "Título rebuilt — bien reparada",
      highlights: ["Asientos eléctricos", "Cámara de reversa", "Pantalla táctil",
                   "Estribos laterales", "Tapa rígida para caja"],
      price: "Actualizar", downPayment: "Actualizar", warranty: "Actualizar",
      promotion: "Actualizar", promotionActive: false, available: true,
      image: "assets/vehicles/tacoma-2021-trd-sport-white.webp",
      photo: "assets/gallery/galeria-04.webp",
      /* La foto original de esta unidad era de 590 px y se veia estirada.
         Se usa una de referencia con licencia comercial, y la ficha lo dice. */
      fotoReferencia: true,
      frame: { contact: 0.698, scale: 0.93, top: 0.212 }
    },
    {
      id: "tacoma-2017-trd-off-road-beige",
      year: 2017, make: "Toyota", model: "Tacoma", trim: "TRD Off Road", color: "Beige",
      mileage: 57429, engine: "V6 3.5L", transmission: "Automática",
      drivetrain: "4x4", cab: "Access Cab",
      titleType: "Rebuilt", titleDisclosure: "Título rebuilt — bien reparada profesionalmente",
      highlights: [],
      price: "Actualizar", downPayment: "Actualizar", warranty: "Actualizar",
      promotion: "Actualizar", promotionActive: false, available: true,
      image: "assets/vehicles/tacoma-2017-trd-off-road-beige.webp",
      photo: "assets/gallery/galeria-03.webp",
      /* La foto original de esta unidad era de 590 px y se veia estirada.
         Se usa una de referencia con licencia comercial, y la ficha lo dice. */
      fotoReferencia: true,
      frame: { contact: 0.72, scale: 1.0, top: 0.25 }
    },
    {
      id: "tacoma-2021-trd-off-road-gray",
      year: 2021, make: "Toyota", model: "Tacoma", trim: "TRD Off Road", color: "Gris",
      mileage: 95626, engine: "V6 3.5L", transmission: "Automática",
      drivetrain: "4x4", cab: "Double Cab",
      titleType: "Rebuilt", titleDisclosure: "Título rebuilt — muy bien reparada",
      highlights: ["Cámara de reversa", "Pantalla táctil", "Estribos laterales",
                   "Lista para el trabajo, la aventura o el uso diario"],
      price: "Actualizar", downPayment: "Actualizar", warranty: "Actualizar",
      promotion: "Actualizar", promotionActive: false, available: true,
      image: "assets/vehicles/tacoma-2021-trd-off-road-gray.webp",
      photo: "assets/gallery/galeria-05.webp",
      frame: { contact: 0.72, scale: 1.0, top: 0.25 }
    },
    {
      id: "tacoma-2019-trd-pro-blue",
      year: 2019, make: "Toyota", model: "Tacoma", trim: "TRD Pro", color: "Azul",
      mileage: 46101, engine: "V6 3.5L", transmission: "Automática",
      drivetrain: "4x4", cab: "",
      titleType: "Rebuilt", titleDisclosure: "Título rebuilt — bien reparada",
      highlights: ["Quemacocos", "Navegación", "Asientos de piel con calefacción",
                   "Sonido Premium JBL", "Monitor de punto ciego", "Radar Cruise Control",
                   "Crawl Control", "Multi-Terrain Select", "Snorkel", "Bolsas de aire intactas"],
      price: "Actualizar", downPayment: "Actualizar", warranty: "Actualizar",
      promotion: "Actualizar", promotionActive: false, available: true,
      image: "assets/vehicles/tacoma-2019-trd-pro-blue.webp",
      photo: "assets/gallery/galeria-01.webp",
      frame: { contact: 0.766, scale: 0.93, top: 0.242 }
    }
  ];

  /* La unidad protagonista del hero y del giro. */
  var HERO = vehicles[4];

  var marquee = ["Toyota", "Tacoma", "TRD Pro", "TRD Off Road", "TRD Sport",
                 "SR", "4x4", "2WD", "Double Cab", "Access Cab", "Crew Cab"];

  /* Cuando la sección corre con el video de dron, los textos acompañan lo
     que se ve en pantalla: la carretera, el lote, el letrero. Hablar del
     motor sobre una toma aérea desconecta al que la está viendo. */
  var FILM_NOTES = [
    { t: "Sobre la 83",     d: "En la U.S. Highway 83, la que cruza todo el Valle. Fácil de encontrar, fácil de estacionarse." },
    { t: "El lote",         d: "Lo que ves en la página es lo que está aquí parado. Sin fotos de catálogo." },
    { t: "Puerta abierta",  d: "Pasa a verlas sin cita. Te enseñamos la unidad completa, arriba y abajo." },
    { t: "913 W Hwy 83",    d: "Suite C, Pharr, Texas. Servimos McAllen, Mission, Edinburg y todo el Valle." }
  ];

  /* Los cuatro textos del giro, uno por cuarto de vuelta. */
  var SPIN_NOTES = [
    { t: "4x4 real",       d: "Tracción en las cuatro llantas para caminos de terracería, brecha y lluvia." },
    { t: "V6 3.5L",        d: "El motor que le dio fama a la Tacoma. Probado, servible en cualquier taller." },
    { t: "Crawl Control",  d: "Controla la velocidad sola en pendiente y arena. Tú solo dirección." },
    { t: "Snorkel",        d: "Toma de aire alta: cruza agua y polvo sin comprometer el motor." }
  ];

  /* Recorrido de la sección clara. Cada panel trae su propia unidad, así el
     visitante ve variedad de inventario sin salir del efecto. */
  /* Cada capacidad con una fotografia que la demuestre, no con un recorte
     sobre fondo liso. Una Tacoma embarrada dice "aguanta" mejor que
     cualquier frase. */
  var CAPS = [
    { n: "01", t: "Aguanta el barro",  d: "Tracción 4x4 real. En el Valle eso es la diferencia entre llegar y quedarte tirado.",
      img: "assets/aguantar/barro" },
    { n: "02", t: "Aguanta el frío",   d: "Motor V6 3.5L probado durante décadas. Arranca, jala y se repara en cualquier taller.",
      img: "assets/aguantar/nieve" },
    { n: "03", t: "Aguanta la sierra", d: "Suspensión y despeje pensados para camino de terracería, no para folleto.",
      img: "assets/aguantar/montana" },
    { n: "04", t: "Aguanta el viaje",  d: "Double Cab y Crew Cab: caben cinco y la caja queda libre para la herramienta.",
      img: "assets/aguantar/desierto" }
  ];

  var STEPS = [
    { n: "01", t: "Escoge", d: "Mira el inventario aquí o en el catálogo de WhatsApp. Pregunta lo que sea: te contestamos nosotros, no un robot." },
    { n: "02", t: "Aplica", d: "Identificación, comprobante de ingresos y enganche. Trabajamos con crédito aprobado." },
    { n: "03", t: "Maneja", d: "Firmas, te entregamos placas y papeles en regla, y te la llevas." }
  ];

  var REBUILT_QA = [
    { q: "¿Qué es un título rebuilt?", a: "Es una unidad que tuvo un daño, se reparó y pasó la inspección estatal que la regresa a circulación legal. El título lo dice y nosotros también." },
    { q: "¿Por qué cuesta menos?", a: "Porque el historial pesa en el valor de reventa, no en cómo camina. Es la razón de que una Tacoma equipada esté a tu alcance." },
    { q: "¿La puedo asegurar y financiar?", a: "Sí. La cobertura de responsabilidad civil no tiene problema y trabajamos con financiamiento. La cobertura amplia depende de la aseguradora." },
    { q: "¿Qué revisan ustedes?", a: "Motor, transmisión, frenos, suspensión, dirección y aire acondicionado antes de ponerla en el lote. Te enseñamos la unidad completa, arriba y abajo." }
  ];

  /* ====================== 03 · UTILIDADES Y DOM ========================== */

  var clamp  = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp   = function (a, b, t) { return a + (b - a) * t; };
  /* Reasigna un valor de un rango a 0..1 y lo recorta. Es la operación que
     usa toda la página para convertir scroll en animación. */
  var range  = function (v, a, b) { return clamp((v - a) / (b - a), 0, 1); };
  var ease   = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var easeOut= function (t) { return 1 - Math.pow(1 - t, 3); };

  /* Respeta la preferencia del sistema. El parámetro ?motion=on la ignora a
     propósito: sirve para revisar los efectos desde una máquina que tiene
     "reducir movimiento" encendido, sin cambiar la configuración del equipo. */
  var forceMotion = /[?&]motion=on\b/.test(location.search);
  var reduceMotion = !forceMotion &&
    !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* Una CLASE, no una media query cruzada con un atributo. El CSS entero
     cuelga de html.no-motion: esta o no esta, sin ambiguedad de cascada. */
  if (reduceMotion) document.documentElement.classList.add("no-motion");

  /* Con "reducir movimiento" puesto, mv() anula los desplazamientos y sc()
     anula las escalas. Las opacidades y el avance del giro se quedan: los
     dirige el scroll del usuario, no la página sola. */
  function mv(v) { return reduceMotion ? 0 : v; }
  function sc(v) { return reduceMotion ? 1 : v; }

  /* Una imagen se puede pintar cuando el navegador ya la decodifico. */
  function pintable(im) { return !!im && im.complete && im.naturalWidth > 0; }

  function thousands(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  /* Un campo pendiente nunca llega al visitante. */
  function ready(value) {
    if (value === null || value === undefined) return false;
    var s = String(value).trim();
    return s !== "" && s.toLowerCase() !== "actualizar";
  }

  /* ======================= VERSION DE MATERIAL ==========================
     vercel.json sirve /assets/ con "immutable" y un ano de cache. Eso es
     correcto SIEMPRE QUE la URL cambie cuando cambia el contenido; si no,
     un archivo reemplazado con el mismo nombre se queda congelado en el
     navegador del visitante durante un ano.

     Es exactamente lo que pasaba: se publicaba material nuevo y quien ya
     habia entrado seguia viendo el viejo.

     SUBIR ESTE NUMERO cada vez que se reemplace una imagen o un video
     conservando su nombre. Es la unica forma de que el cambio llegue.
     ====================================================================== */
  var ASSETS_V = "1787978695";

  function asset(u) {
    if (!u || u.indexOf("assets/") !== 0) return u;
    return u + (u.indexOf("?") === -1 ? "?v=" : "&v=") + ASSETS_V;
  }

  /* Constructor de elementos. h("div.clase.otra#id", {attr}, hijos...)
     Una clase puede traer varios nombres separados por espacio, como en
     h("a.btn btn--wa"): se reparten en tokens antes de agregarlos. */
  function h(spec, attrs) {
    var parts = spec.split(/(?=[.#])/);
    var el = document.createElement(parts[0] || "div");
    for (var i = 1; i < parts.length; i++) {
      var token = parts[i].slice(1).trim();
      if (!token) continue;
      if (parts[i][0] === ".") {
        token.split(/\s+/).forEach(function (c) { if (c) el.classList.add(c); });
      } else {
        el.id = token;
      }
    }
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === "html") el.innerHTML = v;
        else if (k === "text") el.textContent = v;
        /* Toda ruta a assets/ sale versionada, sin tener que acordarse en
           cada llamada. */
        else if (k === "src" || k === "poster") el.setAttribute(k, asset(v));
        else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2).toLowerCase(), v);
        else el.setAttribute(k, v);
      }
    }
    for (var j = 2; j < arguments.length; j++) {
      var c = arguments[j];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) { for (var m = 0; m < c.length; m++) if (c[m]) el.appendChild(c[m]); }
      else if (typeof c === "string") el.appendChild(document.createTextNode(c));
      else el.appendChild(c);
    }
    return el;
  }

  var ARROW_L = '<svg width="15" height="10" viewBox="0 0 15 10" fill="none" aria-hidden="true">' +
                '<path d="M15 5H2M6 1L2 5l4 4" stroke="currentColor" stroke-width="1.4"/></svg>';
  var ARROW = '<svg width="15" height="10" viewBox="0 0 15 10" fill="none" aria-hidden="true">' +
              '<path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" stroke-width="1.4"/></svg>';
  var WA_ICON = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5 0-1.2.1-3.7-.9-3.1-1.3-5.1-4.5-5.3-4.7-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.4 1.8 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2.1 1c.3.1.5.2.5.4 0 .1 0 .7-.2 1.3z"/></svg>';

  /* Nombre corto; el año desempata versiones repetidas. */
  function repeatedTrim(v) {
    var n = 0;
    for (var i = 0; i < vehicles.length; i++) if (vehicles[i].trim === v.trim) n++;
    return n > 1;
  }
  function fullName(v) { return v.year + " Tacoma " + v.trim; }
  function altText(v) {
    return v.year + " Toyota Tacoma " + v.trim +
           (ready(v.drivetrain) ? " " + v.drivetrain : "") +
           (ready(v.color) ? " color " + v.color.toLowerCase() : "") +
           " en Car Haus LLC, Pharr, Texas";
  }

  /* Chat directo con la unidad ya nombrada: en este punto el visitante sabe
     qué quiere, y el mensaje precargado ahorra la mitad de la conversación. */
  function waUnit(v) {
    var msg = "Hola, vi la " + v.year + " Toyota Tacoma " + v.trim +
      (ready(v.drivetrain) ? " " + v.drivetrain : "") +
      " en la página de Car Haus. ¿Sigue disponible? Quiero conocer precio, down payment y requisitos.";
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
  }

  function metaOf(v) {
    var out = [];
    if (ready(v.drivetrain)) out.push(v.drivetrain);
    if (ready(v.engine)) out.push(v.engine);
    if (ready(v.cab)) out.push(v.cab);
    if (typeof v.mileage === "number") out.push(thousands(v.mileage) + " mi");
    if (ready(v.color)) out.push(v.color);
    return out;
  }

  function link(href, cls, label, icon) {
    return h("a." + cls, {
      href: href,
      target: href.indexOf("http") === 0 ? "_blank" : null,
      rel: href.indexOf("http") === 0 ? "noopener" : null
    }, document.createTextNode(label), icon ? h("span", { html: icon }) : null);
  }

  /* ======================= 04 · NAVEGACIÓN Y HERO ======================== */

  function buildNav() {
    var DESTINOS = [
      ["#giro", "La unidad"],
      ["#capacidades", "Capacidades"],
      ["#inventario", "Inventario"],
      ["#titulo", "Título rebuilt"],
      ["#comprar", "Cómo comprar"],
      ["#ubicacion", "Ubicación"]
    ];

    /* Enlaces de escritorio: fila simple dentro de la barra. */
    var enlacesEscritorio = DESTINOS.slice(0, 5).map(function (l) {
      return h("a", { href: l[0] }, l[1]);
    });
    var menuEscritorio = h("nav.nav__links", { "aria-label": "Principal" }, enlacesEscritorio);

    /* ---------------- Menu de telefono: hoja de vidrio ------------------
       Se despliega desde la barra, no desde el borde de la pantalla: asi se
       lee como que la barra CRECE, y no como una capa que aterriza encima.
       Cada renglon entra escalonado con su numero. */

    var filas = DESTINOS.map(function (l, i) {
      return h("a.sheet__row", {
        href: l[0],
        style: "transition-delay:" + (60 + i * 45) + "ms"
      },
        h("i", null, String(i + 1).padStart(2, "0")),
        h("span", null, l[1]),
        h("em", { html: ARROW }));
    });

    var hoja = h("div.sheet", { id: "menu-movil" },
      h("nav.sheet__list", { "aria-label": "Navegación" }, filas),
      h("div.sheet__foot", null,
        link(CONFIG.catalogUrl, "btn btn--wa", "Ver catálogo", ARROW),
        link(CONFIG.phoneHref, "btn btn--ghost", CONFIG.phoneDisplay)),
      h("a.sheet__addr", {
        href: CONFIG.mapsUrl, target: "_blank", rel: "noopener"
      },
        h("span.nav__dot", { "aria-hidden": "true" }),
        CONFIG.address)
    );

    var fondo = h("div.sheet__back", { "aria-hidden": "true" });

    var toggle = h("button.nav__toggle", {
      type: "button",
      "aria-label": "Abrir menú",
      "aria-expanded": "false",
      "aria-controls": "menu-movil"
    }, h("span"));

    var nav = h("header.nav", null,
      h("a.nav__brand", { href: "#top", "aria-label": "Car Haus LLC, inicio" },
        h("img", { src: CONFIG.logo, alt: "", width: 40, height: 40 }),
        h("span", null, "Car Haus")),
      h("a.nav__here", {
        href: CONFIG.mapsUrl, target: "_blank", rel: "noopener",
        "aria-label": "Ver Car Haus LLC en el mapa: " + CONFIG.address
      },
        h("span.nav__dot", { "aria-hidden": "true" }),
        h("span.nav__here-txt", null, "913 W Hwy 83")),
      menuEscritorio, toggle,
      link(CONFIG.catalogUrl, "btn btn--wa", "Catálogo", ARROW),
      hoja
    );

    function abrir(v) {
      nav.classList.toggle("is-open", v);
      fondo.classList.toggle("is-on", v);
      toggle.setAttribute("aria-expanded", v ? "true" : "false");
      toggle.setAttribute("aria-label", v ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = v ? "hidden" : "";
      if (v) {
        /* El foco entra al menu para que el teclado no se quede detras. */
        var primero = filas[0];
        if (primero) setTimeout(function () { primero.focus(); }, 260);
      }
    }

    toggle.addEventListener("click", function () {
      abrir(!nav.classList.contains("is-open"));
    });
    fondo.addEventListener("click", function () { abrir(false); });
    hoja.addEventListener("click", function (ev) {
      if (ev.target.closest("a")) abrir(false);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.classList.contains("is-open")) {
        abrir(false);
        toggle.focus();
      }
    });
    menuEscritorio.addEventListener("click", function (ev) {
      if (ev.target.tagName === "A") abrir(false);
    });

    nav._backdrop = fondo;
    return nav;
  }

  /* ---------------------------------------------------------------------
     HERO — el recorrido de dron, limpio y a sangre.

     DOS MECANISMOS SEGUN LA PANTALLA, y la razon es de peso:

     Escritorio -> video, con el scroll moviendo currentTime.
     Telefono   -> SECUENCIA DE FOTOS.

     En un telefono de verdad no basta con reproducir y pausar para que
     currentTime pinte cuadros: iOS y varios Android dejan el video
     congelado en el poster mientras el scroll corre. No es un ajuste que se
     pueda forzar, es como estan hechos esos navegadores.

     Una secuencia de imagenes no depende de ningun decodificador: se
     enciende la que toca y ya. Es lo que usan las paginas de producto de
     Apple para lo mismo. Aqui son 35 archivos WebP, 1.3 MB entre todos,
     menos de lo que pesaba el video que no funcionaba.
     --------------------------------------------------------------------- */

  function buildHero() {
    var small = window.matchMedia("(max-width: 767px)").matches;

    /* Senal de scroll: raton con la ruedita bajando mas dos flechas. Es el
       icono que la gente reconoce sin leer nada. */
    var MOUSE =
      '<svg width="22" height="34" viewBox="0 0 22 34" fill="none" aria-hidden="true">' +
      '<rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle class="cue-dot" cx="11" cy="10" r="2.4" fill="currentColor"/></svg>';
    var CHEV =
      '<svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">' +
      '<path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="1.5"/></svg>';

    var cue = h("div.hero__cue", { "aria-hidden": "true" },
      h("div.hero__cue-mouse", { html: MOUSE }),
      h("span", null, "Desliza para recorrer"),
      h("div.hero__cue-chev", { html: CHEV + CHEV }));

    /* Porcentaje del recorrido: le dice al visitante que el scroll esta
       moviendo algo y cuanto falta. */
    var pctB = h("b", null, "0%");
    var deg = h("div.spin__deg.hero__deg", null, pctB, h("span", null, "del recorrido"));

    var bar = h("i");

    var media, tickMedia;
    var imgs = [];

    /* Secuencia en las dos pantallas. Lo unico que cambia es de que carpeta
       salen los archivos. */
    var carpeta = small ? CONFIG.spin.filmDir : CONFIG.spin.filmDirHd;

    media = h("div.hero__seq");

    for (var i = 1; i <= CONFIG.spin.filmCount; i++) {
      var num = String(i);
      while (num.length < 3) num = "0" + num;
      var img = h("img", {
        src: carpeta + "f-" + num + ".webp",
        alt: i === 1 ? "Recorrido aéreo del lote de Car Haus LLC en Pharr, Texas" : "",
        "aria-hidden": i === 1 ? null : "true",
        decoding: "async"
      });
      imgs.push(img);
      media.appendChild(img);
    }
    imgs[0].classList.add("is-on");

    var last = 0;

    tickMedia = function (t) {
      var idx = clamp(Math.floor(t * imgs.length), 0, imgs.length - 1);

      /* Si ese cuadro todavia no llega, se queda el ultimo que si esta.
         Congelar un instante se ve mucho mejor que un hueco en blanco. */
      if (!pintable(imgs[idx])) {
        var j = idx;
        while (j > last && !pintable(imgs[j])) j--;
        if (!pintable(imgs[j])) return;
        idx = j;
      }

      if (idx === last) return;
      imgs[last].classList.remove("is-on");
      imgs[idx].classList.add("is-on");
      last = idx;
    };

    var still = h("img.hero__still", {
      /* Respaldo detras de la secuencia: el primer cuadro, no el poster de
         960px, que se veia blando en escritorio. */
      src: carpeta + "f-001.webp", alt: "", "aria-hidden": "true"
    });

    var stage = h("div.hero__stage", null,
      still, media,
      h("div.hero__scrim", { "aria-hidden": "true" }),
      deg, cue,
      h("div.spin__progress", { "aria-hidden": "true" }, bar)
    );

    /* is-seq marca el modo vertical: la toma se muestra completa, sin
       estirar. Es la diferencia entre nitido y pixelado en telefono. */
    var hero = h("section.hero.is-film#top", { class: small ? "hero is-film is-seq" : null }, stage);
    hero.id = "top";
    hero.className = "hero is-film" + (small ? " is-seq" : "");

    /* Lista de archivos que el precargador debe traer antes de soltar la
       pagina: sin esto el primer scroll cae sobre cuadros que aun no estan
       y el recorrido se ve a saltos justo en el peor momento. */
    /* Solo los primeros cuadros retienen la pagina. El resto sigue bajando
       por detras mientras el visitante ya esta viendo el hero: bloquear los
       48 significaba esperar 3 MB antes de ver nada, y eso se sentia como
       un tiron al abrir. */
    hero._preload = imgs.slice(0, 8).map(function (im) { return im.getAttribute("src"); });

    hero._tick = function (p) {
      var t = range(p, 0.03, 0.97);
      tickMedia(t);
      bar.style.transform = "scaleX(" + t + ")";
      pctB.textContent = Math.round(t * 100) + "%";
      /* En telefono la senal vive en su propio renglon, fuera de la imagen:
         se queda puesta todo el recorrido para acompanar al visitante. En
         escritorio se va en cuanto entiende, porque ahi va sobre la toma. */
      cue.style.opacity = small ? "1" : String(1 - range(p, 0.01, 0.09));
    };

    return hero;
  }

  /* ======================= 05 · TICKER Y CIFRAS ========================== */

  function buildTicker() {
    /* La cinta se duplica para que el bucle no muestre el corte. */
    function run() { return marquee.map(function (m) { return h("span", null, m); }); }
    return h("div.ticker", { "aria-hidden": "true" },
      h("div.ticker__track", null, run().concat(run())));
  }

  function buildStats() {
    var fourByFour = vehicles.filter(function (v) { return v.drivetrain === "4x4"; }).length;
    /* Los anios de experiencia van primero: es el dato que mas pesa en un
       lote de titulos rebuilt, y el unico que un competidor nuevo no puede
       copiar. Confirmado en la propia pagina de Facebook del negocio.

       Se retiro la cifra de "3 meses de garantia": en los datos de las cinco
       unidades el campo warranty sigue en "Actualizar", asi que la pagina
       estaba prometiendo algo sin confirmar. Cuando se confirme, vuelve. */
    /* Ya no se cuentan unidades: esta pagina dejo de ser un inventario y
       ese numero envejecia solo. Queda lo que no caduca. */
    var data = [
      { n: 30,  suf: "+", label: "Años en el Valle" },
      { n: 5,   suf: "",  label: "Versiones que manejamos" },
      { n: 100, suf: "%", label: "Títulos declarados de frente" }
    ];


    var items = data.map(function (d, i) {
      /* Arranca con el valor FINAL escrito, no con un cero.

         Antes empezaba en 0 y solo se llenaba cuando el navegador avisaba
         que la seccion habia entrado en pantalla. Si ese aviso no llegaba
         —pestana en segundo plano, navegador que no compone— la cifra se
         quedaba en cero para siempre. Un dato de portada no puede depender
         de eso: se escribe primero, y la animacion solo lo adorna. */
      var b = h("b", null, d.n + d.suf);
      var item = h("div.stats__item.reveal", { style: "transition-delay:" + (i * 110) + "ms" },
        b, h("i", null, d.label));
      item._target = d.n; item._suf = d.suf; item._b = b; item._done = false;
      return item;
    });

    var section = h("div.stats", null, items);

    /* Los números suben cuando la franja entra en pantalla, una sola vez. */
    section._enter = function () {
      items.forEach(function (item) {
        if (item._done) return;
        item._done = true;
        if (reduceMotion) return;          /* ya trae el valor escrito */
        var start = null, dur = 1100;
        (function step(ts) {
          if (start === null) start = ts;
          var t = clamp((ts - start) / dur, 0, 1);
          item._b.textContent = Math.round(item._target * easeOut(t)) + (t === 1 ? item._suf : "");
          if (t < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    };

    return section;
  }

  /* ============================ 06 · GIRO 360 ============================
     Tres fuentes posibles, resueltas en tiempo de carga. El scroll siempre
     controla lo mismo: un valor 0..1 que representa la vuelta completa.
     ====================================================================== */

  /* ====================== 06 · LO QUE TRAE UNA TACOMA ===================
     Slider con autoplay: las unidades van pasando solas, y al lado las
     cuatro capacidades del modelo.

     Detalles que hacen que un carrusel no moleste:
     - Se detiene al pasar el cursor, al tocarlo y al enfocar con teclado.
       Un carrusel que sigue corriendo mientras alguien lee es una molestia.
     - Con "reducir movimiento" no se apaga: cambia por fundido en vez de
       deslizar. Se sigue viendo el inventario, sin desplazamiento lateral.
     - Flechas y puntos para manejarlo a mano, y flechas del teclado.
     ====================================================================== */

  /* ==================== LO QUE TRAE UNA TACOMA ==========================
     Antes: un carrusel de recortes sobre fondo liso, con autoplay. Se veia
     como catalogo de refacciones.

     Ahora son cuatro paneles verticales de fotografia. El activo se abre y
     los otros se comprimen: en una mirada se entiende que hay cuatro cosas
     y cual estas viendo. Se cambia pasando el cursor, tocando, con el
     teclado, o dejando que el scroll lo lleve.

     El acordeon es el patron correcto aqui porque el contenido es
     comparable: cuatro caracteristicas del mismo nivel.
     ====================================================================== */

  function buildSpec() {
    var PANELES = [
      { img: "assets/paneles/4x4.webp",    n: "01", t: "4x4 real",
        d: "Tracción en las cuatro llantas. Terracería, brecha y lluvia sin pensarlo." },
      { img: "assets/paneles/motor.webp",  n: "02", t: "V6 3.5L",
        d: "El motor que le dio fama. Probado, y con refacción en cualquier taller." },
      { img: "assets/paneles/cabina.webp", n: "03", t: "Doble cabina",
        d: "Caben cinco y la caja queda libre. Familia entre semana, trabajo el sábado." },
      { img: "assets/paneles/caja.webp",   n: "04", t: "Caja de trabajo",
        d: "Para herramienta, material o campamento. La misma camioneta, otro uso." }
    ];

    var actual = 0;
    var paneles = PANELES.map(function (x, i) {
      var el = h("article.panel", {
        tabindex: "0", role: "button",
        "aria-label": x.t + ". " + x.d
      },
        h("img", { src: x.img, alt: x.t + " en una Toyota Tacoma",
                   loading: i < 2 ? "eager" : "lazy", decoding: "async" }),
        h("div.panel__velo", { "aria-hidden": "true" }),
        h("div.panel__cuerpo", null,
          h("span.panel__n", null, x.n),
          h("b", null, x.t),
          h("p", null, x.d)));

      function activar() { pinta(i); }
      el.addEventListener("mouseenter", activar);
      el.addEventListener("focus", activar);
      el.addEventListener("click", activar);
      return el;
    });
    paneles[0].classList.add("is-on");

    function pinta(i) {
      if (i === actual) return;
      paneles[actual].classList.remove("is-on");
      actual = i;
      paneles[i].classList.add("is-on");
    }

    var section = h("section.section.paneles#giro", null,
      h("div.section__inner", null,
        h("div.section__head.reveal", null,
          h("p.eyebrow", null, "Toyota Tacoma"),
          h("h2.display.h-md", null, "Lo que ", h("em", null, "trae"), " una Tacoma")),
        h("div.paneles__fila", null, paneles)));

    /* Mientras la seccion cruza la pantalla, el foco avanza solo. Si el
       visitante toca o pasa el cursor, manda el. */
    var tocado = false;
    section.addEventListener("pointerdown", function () { tocado = true; });
    section.addEventListener("mouseenter", function () { tocado = true; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ent) {
        ent.forEach(function (e) {
          if (!e.isIntersecting || tocado) return;
          var r = section.getBoundingClientRect();
          var avance = clamp(1 - (r.bottom / (window.innerHeight + r.height)), 0, 0.999);
          pinta(Math.floor(avance * PANELES.length));
        });
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(section);
    }

    return section;
  }

  /* ===================== 07 · TACOMA AZUL EN SCROLL =====================
     La protagonista avanza hacia la camara mientras cuatro referencias de
     la familia Tacoma aparecen como tarjetas secundarias. Los cuatro planos
     ya traen el mismo estudio y se cruzan suavemente para evitar tirones.
     ====================================================================== */

  function buildBlueJourney() {
    var frames = [1, 2, 3, 4].map(function (n, i) {
      return h("img.blue-run__frame", {
        src: "assets/features/blue-scroll/frame-0" + n + ".webp",
        alt: i === 0 ? "Toyota Tacoma azul acercándose en estudio" : "",
        loading: i < 2 ? "eager" : "lazy",
        decoding: "async",
        "aria-hidden": i === 0 ? null : "true"
      });
    });
    frames[0].classList.add("is-on");

    /* ESTILOS DE REFERENCIA, NO INVENTARIO.

       Antes eran cuatro renders con ano y version concretos: 2022 Army
       Green, 2023 Solar Octane, 2024 Limited, 2025 Trailhunter. Ninguna de
       esas camionetas esta en el lote, y poner ano y version junto a una
       foto hace que se lea como una unidad a la venta.

       Ahora son fotografias reales de Tacoma, descargadas de Unsplash
       (licencia de uso comercial, sin atribucion obligatoria), etiquetadas
       por ESTILO y no por ano. El pie de la seccion aclara que lo que esta
       disponible vive en el catalogo de WhatsApp. */
    var options = [
      { img: "assets/features/card-tacoma-arena.webp",  year: "Off Road",  name: "Arena",  color: "Para brecha y terraceria" },
      { img: "assets/features/card-tacoma-blanca.webp", year: "Cabina",    name: "Blanca", color: "Clasica, de trabajo" },
      { img: "assets/features/card-tacoma-plata.webp",  year: "Equipada",  name: "Plata",  color: "Lista para viaje largo" },
      { img: "assets/features/card-tacoma-negra.webp",  year: "TRD",       name: "Negra",  color: "Presencia en carretera" }
    ];

    var cards = options.map(function (o, i) {
      return h("article.blue-card.blue-card--" + (i + 1), null,
        h("span.blue-card__num", null, "0" + (i + 1)),
        h("img", { src: o.img, alt: "Toyota Tacoma " + o.name + ", estilo " + o.year, loading: "lazy", decoding: "async" }),
        h("div", null,
          h("small", null, o.year + " · " + o.color),
          h("b", null, o.name)));
    });

    var progress = h("i");
    var stage = h("div.blue-run__stage", null,
      h("div.blue-run__copy", null,
        h("p.eyebrow", null, "Toyota Tacoma · Car Haus"),
        h("h2.display", null, "Más cerca. ", h("em", null, "Más Tacoma.")),
        /* Sin parrafo aqui: tapaba la toma justo cuando la camioneta se
           acerca, que es lo unico que esta seccion tiene que ensenar. La
           invitacion a deslizar y el enlace al catalogo ya viven en el pie
           de la seccion. */),
      h("div.blue-run__frames", null, frames),
      h("div.blue-run__cards", null, cards),
      h("div.blue-run__foot", null,
        h("span", null, "Estilos de referencia · el inventario actual está en el catálogo"),
        link(CONFIG.catalogUrl, "btn btn--wa", "Ver las de hoy", ARROW)),
      h("div.blue-run__progress", { "aria-hidden": "true" }, progress));

    var section = h("section.blue-run#experiencia", { style: "height:380vh" }, stage);

    section._tick = function (p) {
      var travel = range(p, 0.04, 0.96);
      var framePos = travel * (frames.length - 1);

      frames.forEach(function (img, i) {
        var distance = Math.abs(framePos - i);
        var opacity = clamp(1 - distance, 0, 1);
        img.style.opacity = String(opacity);
        img.classList.toggle("is-on", opacity > 0.02);
        img.setAttribute("aria-hidden", opacity > 0.02 ? "false" : "true");
      });

      /* Micro movimiento entre cuadros: el acercamiento nunca se siente
         como cuatro diapositivas separadas. */
      var scale = lerp(1.015, 1.075, travel);
      var y = lerp(1.5, -1.2, travel);
      stage.style.setProperty("--truck-scale", sc(scale));
      stage.style.setProperty("--truck-y", mv(y) + "vh");

      cards.forEach(function (card, i) {
        var start = 0.16 + i * 0.14;
        var appear = range(travel, start, start + 0.13);
        var leave = i < 2 ? 1 - range(travel, 0.82, 0.96) : 1;
        var vis = appear * leave;
        card.style.opacity = String(vis);
        card.style.transform = "translate3d(0," + mv((1 - appear) * 28) + "px,0) scale(" + sc(0.94 + appear * 0.06) + ")";
      });

      progress.style.transform = "scaleX(" + travel + ")";
      stage.classList.toggle("is-close", travel > 0.76);
    };

    return section;
  }

  /* ===================== HECHAS PARA AGUANTAR ===========================
     Antes: un recorte de camioneta sobre fondo liso que se deslizaba
     mientras cambiaban cuatro parrafos. Correcto y plano.

     Ahora cada capacidad ocupa la pantalla completa con una fotografia que
     la demuestra: barro, nieve, sierra, desierto. El numero enorme al fondo
     da escala, y la barra lateral deja ver cuanto falta. Se puede saltar de
     una a otra tocando los puntos.
     ====================================================================== */

  function buildCaps() {
    var small = window.matchMedia("(max-width: 767px)").matches;

    var fotos = CAPS.map(function (c, i) {
      return h("div.aguanta__foto", null,
        h("img", {
          src: c.img + (small ? "-m" : "") + ".webp",
          alt: c.t + ", Toyota Tacoma",
          loading: i === 0 ? "eager" : "lazy", decoding: "async"
        }));
    });
    fotos[0].classList.add("is-on");

    var cifra = h("b.aguanta__cifra", null, "01");

    var textos = CAPS.map(function (c) {
      return h("article.aguanta__texto", null,
        h("h3", null, c.t),
        h("p", null, c.d));
    });
    textos[0].classList.add("is-on");

    var puntos = CAPS.map(function (c, i) {
      return h("button.aguanta__punto", {
        type: "button", "aria-label": c.t,
        onclick: function () { irA(i); }
      }, h("i"), h("span", null, c.n));
    });
    puntos[0].classList.add("is-on");

    var stage = h("div.aguanta__stage", null,
      h("div.aguanta__fondo", null, fotos),
      h("div.aguanta__velo", { "aria-hidden": "true" }),
      cifra,
      h("div.aguanta__cabecera", null,
        h("p.eyebrow", null, "Por qué una Tacoma"),
        h("h2.display.h-lg", null, "Hechas ", h("em", null, "para"), " aguantar")),
      h("div.aguanta__textos", null, textos),
      h("div.aguanta__puntos", null, puntos));

    var section = h("section.aguanta#capacidades", {
      style: "height:" + (CAPS.length * 90 + 60) + "vh"
    }, stage);

    var actual = 0;

    function pinta(i) {
      if (i === actual) return;
      fotos[actual].classList.remove("is-on");
      textos[actual].classList.remove("is-on");
      puntos[actual].classList.remove("is-on");
      actual = i;
      fotos[i].classList.add("is-on");
      textos[i].classList.add("is-on");
      puntos[i].classList.add("is-on");
      cifra.textContent = CAPS[i].n;
    }

    /* Los puntos llevan a su bloque: la seccion se puede recorrer sin
       depender del scroll, que es lo que espera quien usa teclado. */
    function irA(i) {
      var alto = section.offsetHeight - window.innerHeight;
      var destino = section.offsetTop + alto * ((i + 0.5) / CAPS.length);
      window.scrollTo({ top: destino, behavior: reduceMotion ? "auto" : "smooth" });
    }

    section._tick = function (p) {
      var span = range(p, 0.04, 0.96);
      pinta(clamp(Math.floor(span * CAPS.length), 0, CAPS.length - 1));
      /* Acercamiento lentisimo sobre la foto: da vida sin distraer. */
      stage.style.setProperty("--zoom", sc(1 + span * 0.07));
    };

    return section;
  }

  /* ========================= EL MURO DE TACOMAS ==========================
     Esta pagina NO es un inventario. Es una landing que lleva al catalogo
     de WhatsApp, que es donde vive lo que hay hoy y donde se actualiza.

     Antes esta seccion listaba cinco unidades con ano, version y millaje.
     Eso obligaba a que cada foto fuera de esa unidad exacta, y creaba un
     problema cada vez que una foto no daba la talla. Ademas envejecia sola:
     el dia que se vende una, la pagina miente.

     Ahora ensena CANTIDAD. Dos filas de Tacomas que se desplazan en
     sentidos opuestos con el scroll: el ojo lee abundancia antes de leer
     una sola palabra. Y todo termina en el catalogo.
     ====================================================================== */

  function buildMuro() {
    var MURO = [];
    for (var i = 1; i <= 12; i++) {
      MURO.push("assets/muro/t-" + (i < 10 ? "0" + i : i) + ".webp");
    }
    /* Se intercalan las unidades reales del lote entre las de referencia:
       las fotos propias son las que dan credibilidad. */
    vehicles.forEach(function (v, k) {
      if (v.photo) MURO.splice(2 + k * 3, 0, v.photo);
    });

    function fila(desde, hasta, clase) {
      var piezas = MURO.slice(desde, hasta).map(function (src, i) {
        return h("div.muro__pieza", null,
          h("img", { src: src, alt: "Toyota Tacoma", loading: "lazy", decoding: "async" }));
      });
      /* Se duplica el contenido para que la tira no muestre el final. */
      return h("div.muro__fila." + clase, null, piezas.concat(piezas.map(function (p) {
        return p.cloneNode(true);
      })));
    }

    var filaA = fila(0, Math.ceil(MURO.length / 2), "muro__fila--a");
    var filaB = fila(Math.ceil(MURO.length / 2), MURO.length, "muro__fila--b");

    var stage = h("div.muro__stage", null,
      h("div.muro__cabecera", null,
        h("p.eyebrow", null, "Lo que movemos"),
        h("h2.display.h-lg", null, "Puras ", h("em", null, "Tacomas")),
        h("p.lede", null,
          "Todas las versiones, todos los colores. Lo que está disponible hoy vive en el catálogo, y ahí se actualiza.")),
      h("div.muro__filas", { "aria-hidden": "true" }, filaA, filaB),
      h("div.muro__cta", null,
        link(CONFIG.catalogUrl, "btn btn--wa", "Ver todas por WhatsApp", ARROW),
        h("span.muro__nota", null, "Se actualiza cada vez que entra o sale una unidad")));

    var section = h("section.muro#inventario", { style: "height: 220vh" }, stage);

    section._tick = function (p) {
      /* Las dos filas se cruzan: una avanza y la otra retrocede. Ese
         contraste es lo que hace que se lea como movimiento y no como una
         imagen larga. */
      var t = range(p, 0.02, 0.98);
      filaA.style.transform = "translateX(" + (-t * 34) + "%)";
      filaB.style.transform = "translateX(" + (-66 + t * 34) + "%)";
    };

    return section;
  }

  /* ===================== EL TITULO, EN UNA FRANJA ========================
     Era una seccion entera con cuatro preguntas sobre fondo claro. Bien
     escrita, pero larga y en mitad del embudo: frenaba justo cuando el
     visitante venia lanzado hacia el catalogo.

     Se convierte en una franja. Dice lo unico que hay que decir, lo dice de
     frente, y sigue empujando al catalogo. Quien quiera el detalle lo
     pregunta por WhatsApp, que es adonde queremos llevarlo.
     ====================================================================== */

  function buildRebuilt() {
    return h("section.banda.on-ice#titulo", null,
      h("div.banda__inner", null,
        h("div.banda__texto", null,
          h("p.eyebrow", null, "Sin letra chica"),
          h("h2.display.h-md", null, "Todas con título ", h("em", null, "rebuilt")),
          h("p.lede", null,
            "Reparadas, inspeccionadas y legales para circular. Por eso una Tacoma bien equipada está a tu alcance. Te lo decimos aquí, antes de que preguntes.")),
        h("div.banda__cta", null,
          link(CONFIG.catalogUrl, "btn btn--wa", "Ver disponibles", ARROW),
          h("small", null, "¿Dudas sobre el título? Pregúntanos, contesta una persona."))));
  }



  function buildSteps() {
    return h("section.section#comprar", null,
      h("div.section__inner", null,
        h("div.section__head.reveal", null,
          h("p.eyebrow", null, "Cómo comprar"),
          h("h2.display.h-lg", null, "Tres ", h("em", null, "pasos"), " y ya")),
        h("div.steps", null, STEPS.map(function (st, i) {
          return h("div.steps__item.reveal", { style: "transition-delay:" + (i * 130) + "ms" },
            h("div.steps__marca", null, h("b", null, st.n), h("i", { "aria-hidden": "true" })),
            h("div.steps__cuerpo", null,
              h("h3", null, st.t),
              h("p", null, st.d)));
        })),
        h("div.steps__cierre.reveal", null,
          h("p", null, "¿Dudas antes de empezar? Contesta una persona, no un robot."),
          link(CONFIG.phoneHref, "btn btn--ghost", "Llamar al lote"))));
  }

  function buildPlace() {
    var rows = [
      ["Dirección", link(CONFIG.mapsUrl, "", CONFIG.address)],
      ["Teléfono", link(CONFIG.phoneHref, "", CONFIG.phoneDisplay)],
      ["WhatsApp", link(CONFIG.catalogUrl, "", "Catálogo en WhatsApp")],
      ["Facebook", link(CONFIG.facebookUrl, "", "Carhaus2021")]
    ].map(function (r, i) {
      return h("div.place__row.reveal", { style: "transition-delay:" + (i * 90) + "ms" },
        h("i", null, r[0]), r[1]);
    });

    return h("section.section#ubicacion", null,
      h("div.section__inner", null,
        h("div.place", null,
          /* Mapa real. El embed de Google no necesita clave de API con este
             formato. loading=lazy para que no pese en la carga inicial:
             esta hasta el final de la pagina. */
          h("div.place__map.reveal", null,
            h("iframe", {
              src: "https://www.google.com/maps?q=" +
                   encodeURIComponent("913 W US Hwy 83, Pharr, TX 78577") +
                   "&z=15&output=embed",
              title: "Mapa de Car Haus LLC en 913 W U.S. Hwy 83, Pharr, Texas",
              loading: "lazy",
              referrerpolicy: "no-referrer-when-downgrade",
              allowfullscreen: ""
            }),
            link(CONFIG.mapsUrl, "place__map-link", "Abrir en Google Maps", ARROW)),
          h("div.reveal", null,
            h("p.eyebrow", null, "Dónde estamos"),
            h("h2.display.h-md", null, "Pasa ", h("em", null, "a"), " verlas"),
            h("p.lede", { style: "margin-top:20px" },
              "Estamos sobre la 83 en Pharr. Servimos McAllen, Mission, Edinburg y todo el Valle."),
            h("div.place__rows", null, rows)))));
  }

  /* ============================== PIE =====================================
     Antes eran tres columnas de enlaces: correcto y olvidable.

     Ahora el pie cuenta el ultimo tramo del viaje. Una calle cruza el
     ancho de la pagina; la Tacoma la recorre mientras el visitante baja, y
     al final llega al letrero del local con la direccion. Es el mismo
     recorrido que abre la pagina, cerrado aqui: se entra por la carretera y
     se termina llegando.

     Ademas convierte el pie en lo que tiene que ser en una landing que
     manda al catalogo: el sitio donde queda claro DONDE estan.
     ====================================================================== */

  function buildFooter() {
    var truck = h("img.foot__truck", {
      src: HERO.image, alt: "", "aria-hidden": "true", loading: "lazy", decoding: "async"
    });

    /* LA RAYITA LLEGA AL MAPA.
       El recorrido no termina en el aire: la linea cruza, la camioneta la
       sigue y desemboca en el mapa real del local. Ese es el ultimo gesto
       de la pagina, y responde a la unica pregunta que queda: donde. */
    var mapa = h("div.foot__mapa", null,
      h("iframe", {
        src: "https://www.google.com/maps?q=" +
             encodeURIComponent("913 W US Hwy 83, Pharr, TX 78577") +
             "&z=16&output=embed",
        title: "Mapa de Car Haus LLC, 913 W U.S. Hwy 83, Pharr, Texas",
        loading: "lazy", referrerpolicy: "no-referrer-when-downgrade"
      }),
      h("span.foot__pin", { "aria-hidden": "true" }),
      link(CONFIG.mapsUrl, "foot__mapa-link", "Cómo llegar", ARROW));

    var camino = h("div.foot__road", { "aria-hidden": "true" },
      h("div.foot__road-line"),
      truck);

    var pie = h("footer.foot", null,
      h("div.foot__viaje", null,
        h("p.eyebrow", null, "Último tramo"),
        h("h2.display.h-md", null, "Te ", h("em", null, "esperamos"), " aquí"),
        camino,
        h("div.foot__llegada", null,
          mapa,
          h("div.foot__datos", null,
            h("b", null, "Car Haus LLC"),
            h("p", null, "913 W U.S. Hwy 83, Suite C"),
            h("p", null, "Pharr, TX 78577"),
            h("div.foot__enlaces", null,
              link(CONFIG.phoneHref, "", CONFIG.phoneDisplay),
              link(CONFIG.facebookUrl, "", "Facebook"),
              link("mailto:" + CONFIG.email, "", "Correo")),
            link(CONFIG.catalogUrl, "btn btn--wa", "Ver catálogo", ARROW)))),

      h("div.foot__legal", null,
        h("span", null, "© " + new Date().getFullYear() + " Car Haus LLC · Pharr, TX · 30+ años"),
        h("span", null, "Todas las unidades con título rebuilt. Disponibilidad sujeta a cambio.")));

    pie._tick = function (p) {
      var avance = easeOut(range(p, 0.05, 0.68));
      truck.style.transform = "translateX(" + (avance * 100 - 100) + "%)";
      camino.style.setProperty("--avance", avance);
      mapa.classList.toggle("is-on", avance > 0.9);
    };

    return pie;
  }






  /* ========================== PRECARGA ===================================
     El primer scroll es el peor momento para que falte un archivo: el
     recorrido salta y la primera impresion se pierde. Asi que la pagina se
     retiene hasta que el hero esta completo, con una pantalla de carga que
     muestra el avance real.

     Tiene salida de emergencia: si algo tarda demasiado o falla, a los 15
     segundos suelta igual. Mas vale una pagina con un cuadro faltante que
     un visitante atrapado mirando un porcentaje.
     ====================================================================== */

  function preload(urls, onProgress) {
    return new Promise(function (resolve) {
      if (!urls.length) return resolve();

      var total = urls.length, done = 0, settled = false;

      function step() {
        done++;
        if (onProgress) onProgress(done / total);
        if (done >= total && !settled) { settled = true; resolve(); }
      }

      urls.forEach(function (u) {
        var im = new Image();
        im.onload = step;
        im.onerror = step;      /* un error no puede dejar la pagina colgada */
        im.src = asset(u);
      });

      setTimeout(function () { if (!settled) { settled = true; resolve(); } }, 15000);
    });
  }

  function buildLoader() {
    var bar = h("i");
    var pct = h("span.load__pct", null, "0%");
    var el = h("div.load", { "aria-hidden": "true" },
      h("img.load__logo", { src: CONFIG.logo, alt: "" }),
      h("div.load__bar", null, bar),
      pct);
    el._set = function (v) {
      bar.style.transform = "scaleX(" + v + ")";
      pct.textContent = Math.round(v * 100) + "%";
    };
    return el;
  }

  /* ========================= 09 · MOTOR DE SCROLL ========================
     Un solo requestAnimationFrame para toda la página. Cada sección con
     efecto expone _tick(progreso) y aquí se le entrega su valor 0..1.
     ====================================================================== */

  function boot() {
    var root = document.getElementById("root");

    var nav = buildNav();
    var hero = buildHero();
    var stats = buildStats();
    var spec = buildSpec();
    var blueJourney = buildBlueJourney();
    var caps = buildCaps();

    root.appendChild(nav);
    if (nav._backdrop) root.appendChild(nav._backdrop);
    root.appendChild(hero);
    root.appendChild(buildTicker());
    root.appendChild(stats);
    /* La Tacoma azul va inmediatamente despues del hero: el visitante acaba
       de llegar al lote y lo primero que ve es la camioneta acercandose.
       Los paneles vienen despues, cuando ya quiere saber que trae. */
    root.appendChild(blueJourney);
    root.appendChild(spec);
    root.appendChild(caps);
    var inv = buildMuro();
    root.appendChild(inv);
    root.appendChild(buildRebuilt());
    var pie = buildFooter();
    root.appendChild(pie);

    /* La pagina no se entrega hasta que el hero esta completo. */
    var loader = buildLoader();
    document.body.appendChild(loader);
    document.documentElement.classList.add("is-loading");

    var criticos = (hero._preload || []).slice();
    /* La primera foto del inventario tambien, que es la siguiente parada. */
    if (vehicles[0] && vehicles[0].photo) criticos.push(vehicles[0].photo);
    /* Los dos primeros planos evitan un destello cuando comienza el
       acercamiento; los dos cercanos se precargan despues. */
    criticos.push("assets/features/blue-scroll/frame-01.webp");
    criticos.push("assets/features/blue-scroll/frame-02.webp");

    preload(criticos, loader._set).then(function () {
      document.documentElement.classList.remove("is-loading");
      loader.classList.add("is-done");
      setTimeout(function () { loader.remove(); }, 700);
      /* Repinta ya, para que el hero muestre el cuadro que toca. */
      if (typeof paint === "function") paint();

      /* Segunda tanda, ya sin retener a nadie: los recortes de
         "Hechas para aguantar" y el resto de fotos del inventario. Asi para
         cuando el visitante llegue abajo ya estan, y el cambio de unidad no
         ensena el hueco mientras carga. */
      var despues = [];
      /* Las fotos de las secciones nuevas: llegan por detras para que no
         aparezcan en blanco cuando el visitante baje. */
      ["barro", "nieve", "montana", "desierto"].forEach(function (n) {
        despues.push("assets/aguantar/" + n + (window.innerWidth <= 767 ? "-m" : "") + ".webp");
      });
      ["4x4", "motor", "cabina", "caja"].forEach(function (n) {
        despues.push("assets/paneles/" + n + ".webp");
      });
      for (var mi = 1; mi <= 12; mi++) {
        despues.push("assets/muro/t-" + (mi < 10 ? "0" + mi : mi) + ".webp");
      }
      vehicles.forEach(function (v) {
        if (v.image) despues.push(v.image);
        if (v.photo) {
          /* Se precarga la que el navegador va a usar de verdad, no las dos. */
          despues.push(window.innerWidth <= 767 ? v.photo.replace(/\.webp$/, "-m.webp") : v.photo);
        }
      });
      despues.push("assets/features/blue-scroll/frame-03.webp");
      despues.push("assets/features/blue-scroll/frame-04.webp");
      preload(despues);
    });

    var fab = link(CONFIG.catalogUrl, "fab", "", WA_ICON);
    fab.appendChild(h("span.fab__txt", null, "Ver catálogo"));
    fab.setAttribute("aria-label", "Abrir catálogo en WhatsApp");
    document.body.appendChild(fab);

    /* --- Revelado al entrar en pantalla --------------------------------- */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-in");
          if (en.target._enter) en.target._enter();
          io.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px -12% 0px" });

      Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) { io.observe(el); });
      io.observe(stats);

      /* Red de seguridad: si a los 4 segundos algo sigue oculto esperando un
         aviso que no llego, se muestra igual. Vale mas una entrada sin
         animacion que contenido invisible. */
      setTimeout(function () {
        Array.prototype.forEach.call(document.querySelectorAll(".reveal:not(.is-in)"), function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 1.5) el.classList.add("is-in");
        });
      }, 4000);
    } else {
      Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el) { el.classList.add("is-in"); });
      if (stats._enter) stats._enter();
    }

    /* El bucle corre SIEMPRE, también con "reducir movimiento" activado.
       Lo que cambia es cuánto se mueve cada cosa, no si la página funciona:
       con la preferencia puesta, SOFT deja los cambios de opacidad y el
       avance del giro (que los dirige el scroll del usuario) y anula los
       desplazamientos y las escalas, que son lo que marea. */

    /* --- Bucle único ----------------------------------------------------- */
    var scenes = [hero, blueJourney, caps, inv, pie].filter(function (s) { return s && s._tick; });
    var iceZones = [caps];
    var raf = null;

    function paint() {
      raf = null;
      var vh = window.innerHeight;

      for (var i = 0; i < scenes.length; i++) {
        var s = scenes[i];
        var r = s.getBoundingClientRect();
        /* Progreso del recorrido fijo: 0 cuando el borde superior toca el
           tope, 1 cuando el inferior lo alcanza. */
        var total = r.height - vh;
        var p = total > 0 ? clamp(-r.top / total, 0, 1) : (r.top <= 0 ? 1 : 0);
        /* Fuera de pantalla no se pinta: ahorra trabajo en móvil. */
        if (r.bottom < -vh || r.top > vh * 2) continue;
        s._tick(p);
      }

      var y = window.pageYOffset || document.documentElement.scrollTop;
      nav.classList.toggle("is-stuck", y > 40);
      fab.classList.toggle("is-on", y > vh * 0.9);
      /* A mitad de pagina el visitante ya sabe que busca: el boton deja de
         ser un icono y se abre con la invitacion. */
      var total = document.documentElement.scrollHeight - vh;
      fab.classList.toggle("is-wide", total > 0 && y / total > 0.28);

      /* La barra se invierte cuando cruza una sección clara. */
      var onIce = false;
      for (var k = 0; k < iceZones.length; k++) {
        var z = iceZones[k].getBoundingClientRect();
        if (z.top <= 70 && z.bottom >= 70) { onIce = true; break; }
      }
      var lightSections = document.querySelectorAll(".section--ice");
      for (var m = 0; m < lightSections.length && !onIce; m++) {
        var ls = lightSections[m].getBoundingClientRect();
        if (ls.top <= 70 && ls.bottom >= 70) onIce = true;
      }
      nav.classList.toggle("on-ice", onIce);
    }

    /* Bucle por muestreo en vez de escuchar "scroll".
       Dos razones: en iOS el evento se entrega a tirones durante el scroll
       por inercia, y hay contextos donde un scroll por código no lo dispara.
       Comparar un número por cuadro no cuesta nada, y si nada se movió se
       sale antes de tocar el layout. */
    var lastY = -1, lastH = -1, idle = 0;

    function frame() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var vh = window.innerHeight;

      if (y !== lastY || vh !== lastH) {
        lastY = y; lastH = vh; idle = 0;
        paint();
      } else if (idle < 90) {
        idle++;                       // margen tras la última parada
      }

      /* Con la pestaña oculta el navegador ya congela rAF; no hace falta
         apagarlo a mano. */
      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", function () { lastH = -1; }, { passive: true });
    window.addEventListener("orientationchange", function () { lastH = -1; });

    paint();
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
