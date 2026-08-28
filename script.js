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
    logo: "assets/logo/carhaus-logo.png",

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
    heroImage: "assets/360/frame-01.webp",
    heroVideo: "assets/hero/hero_video.mp4",
    heroVideoFallback: "assets/hero/hero-cover.webm"
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
  var CAPS = [
    { n: "01", t: "TRD Pro",      tag: "Solar Octane · Concepto visual", d: "Una Tacoma creada para abrir camino, con presencia agresiva y carácter TRD.", image: "assets/features/card-2023-tacoma-trd-pro-solar-octane.webp" },
    { n: "02", t: "Trailhunter",  tag: "Bronze Oxide · Concepto visual", d: "Equipo overland, postura elevada y una estética preparada para salir del pavimento.", image: "assets/features/card-2025-tacoma-trailhunter-bronze-oxide.webp" },
    { n: "03", t: "Limited",      tag: "Pearl White · Concepto visual", d: "Comodidad premium y diseño limpio para quien quiere Tacoma todos los días.", image: "assets/features/card-2024-tacoma-limited-white.webp" },
    { n: "04", t: "TRD Sport",    tag: "Army Green · Concepto visual", d: "Actitud deportiva, cabina doble y el look inconfundible de una Tacoma moderna.", image: "assets/features/card-2022-tacoma-trd-sport-army-green.webp" }
  ];

  var STEPS = [
    { n: "01", t: "Escoge", d: "Mira el catálogo actualizado de WhatsApp. Pregunta lo que sea: te contestamos nosotros, no un robot." },
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
      ["#capacidades", "Tacomas"],
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

    /* Un solo video reemplaza los 80 WebP antiguos. El MP4 es la fuente
       principal; WebM queda como respaldo para navegadores compatibles. */
    var media = h("video.hero__video", {
      muted: true,
      playsinline: true,
      preload: "auto",
      "aria-label": "Recorrido aéreo del lote de Car Haus LLC en Pharr, Texas"
    });
    media.muted = true;
    media.playsInline = true;
    media.appendChild(h("source", { src: CONFIG.heroVideo, type: "video/mp4" }));
    media.appendChild(h("source", { src: CONFIG.heroVideoFallback, type: "video/webm" }));

    var duration = 0;
    var wantedTime = 0;
    media.addEventListener("loadedmetadata", function () {
      duration = isFinite(media.duration) ? media.duration : 0;
      media.currentTime = 0.01;
    });
    media.addEventListener("canplay", function () {
      media.classList.add("is-ready");
    });

    function tickMedia(t) {
      if (!duration || media.readyState < 2) return;
      wantedTime = clamp(t, 0, 0.999) * duration;
      /* Un umbral corto evita ordenar el mismo seek docenas de veces por
         segundo, que era la causa principal de los destellos al hacer scroll. */
      if (Math.abs(media.currentTime - wantedTime) > 0.045) {
        media.currentTime = wantedTime;
      }
    }

    var stage = h("div.hero__stage", null,
      media,
      h("div.hero__scrim", { "aria-hidden": "true" }),
      deg, cue,
      h("div.spin__progress", { "aria-hidden": "true" }, bar)
    );

    /* is-seq marca el modo vertical: la toma se muestra completa, sin
       estirar. Es la diferencia entre nitido y pixelado en telefono. */
    var hero = h("section.hero.is-film#top", null, stage);
    hero.id = "top";
    hero.className = "hero is-film is-video";

    /* Lista de archivos que el precargador debe traer antes de soltar la
       pagina: sin esto el primer scroll cae sobre cuadros que aun no estan
       y el recorrido se ve a saltos justo en el peor momento. */
    /* Solo los primeros cuadros retienen la pagina. El resto sigue bajando
       por detras mientras el visitante ya esta viendo el hero: bloquear los
       48 significaba esperar 3 MB antes de ver nada, y eso se sentia como
       un tiron al abrir. */
    hero._preload = [];

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
    /* Los anios de experiencia van primero: es el dato que mas pesa en un
       lote de titulos rebuilt, y el unico que un competidor nuevo no puede
       copiar. Confirmado en la propia pagina de Facebook del negocio.

       Se retiro la cifra de "3 meses de garantia": en los datos de las cinco
       unidades el campo warranty sigue en "Actualizar", asi que la pagina
       estaba prometiendo algo sin confirmar. Cuando se confirme, vuelve. */
    var data = [
      { n: 4,  suf: "",   label: "Estilos Tacoma destacados" },
      { n: 1,  suf: "",   label: "Catálogo actualizado" },
      { n: 24, suf: "/7", label: "Catálogo disponible" }
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

  function buildSpec() {
    var INTERVALO = 3800;

    var slides = vehicles.map(function (v, i) {
      return h("div.spec__slide", { "aria-hidden": i === 0 ? null : "true" },
        h("img", {
          src: v.image, alt: altText(v),
          loading: i === 0 ? "eager" : "lazy", decoding: "async"
        }));
    });
    slides[0].classList.add("is-on");

    var etiqueta = h("p.eyebrow.spec__label", null,
      vehicles[0].year + " · " + vehicles[0].trim);

    var puntos = vehicles.map(function (v, i) {
      return h("button.spec__dot", {
        type: "button",
        "aria-label": "Ver " + fullName(v),
        onclick: function () { ir(i, true); }
      });
    });
    puntos[0].classList.add("is-on");

    var notas = SPIN_NOTES.map(function (n, i) {
      return h("li.spec__item.reveal", { style: "transition-delay:" + (i * 90) + "ms" },
        h("b", null, n.t),
        h("p", null, n.d));
    });

    function flecha(dir, etiquetaTxt) {
      return h("button.spec__arrow", {
        type: "button", "aria-label": etiquetaTxt,
        onclick: function () { ir(actual + dir, true); }
      }, h("span", { html: dir < 0 ? ARROW_L : ARROW }));
    }

    var visor = h("div.spec__viewer", null,
      slides,
      flecha(-1, "Unidad anterior"),
      flecha(1, "Unidad siguiente"));

    var actual = 0, timer = null, detenido = false;

    function ir(i, manual) {
      i = ((i % vehicles.length) + vehicles.length) % vehicles.length;
      if (i === actual) return;
      slides[actual].classList.remove("is-on");
      slides[actual].setAttribute("aria-hidden", "true");
      puntos[actual].classList.remove("is-on");
      actual = i;
      slides[i].classList.add("is-on");
      slides[i].removeAttribute("aria-hidden");
      puntos[i].classList.add("is-on");
      etiqueta.textContent = vehicles[i].year + " · " + vehicles[i].trim;
      /* Un toque manual reinicia el reloj: si no, la siguiente puede saltar
         medio segundo despues de que el visitante eligio. */
      if (manual) arrancar();
    }

    function arrancar() {
      parar();
      if (detenido) return;
      timer = setInterval(function () { ir(actual + 1); }, INTERVALO);
    }
    function parar() { if (timer) { clearInterval(timer); timer = null; } }

    var seccion = h("section.section.spec#giro", null,
      h("div.section__inner", null,
        h("div.section__head.reveal", null,
          etiqueta,
          h("h2.display.h-md", null, "Lo que ", h("em", null, "trae"), " una Tacoma")),
        h("div.spec__grid", null,
          h("div.spec__stage", null, visor, h("div.spec__dots", null, puntos)),
          h("ul.spec__list", null, notas))));

    /* Pausa mientras alguien lo esta mirando o usando.

       El caso tactil necesita trato aparte: en un telefono nunca llega
       mouseleave ni focusout, asi que si el toque solo pausara, el carrusel
       se quedaria detenido para siempre en cuanto alguien lo rozara. Se
       reanuda solo unos segundos despues del ultimo toque. */
    var reanudar = null;

    function pausar() {
      if (reanudar) { clearTimeout(reanudar); reanudar = null; }
      detenido = true;
      parar();
    }
    function reanudarPronto(ms) {
      if (reanudar) clearTimeout(reanudar);
      reanudar = setTimeout(function () {
        reanudar = null;
        detenido = false;
        arrancar();
      }, ms);
    }

    ["mouseenter", "focusin"].forEach(function (ev) {
      seccion.addEventListener(ev, pausar, { passive: true });
    });
    ["mouseleave", "focusout"].forEach(function (ev) {
      seccion.addEventListener(ev, function () { detenido = false; arrancar(); });
    });

    seccion.addEventListener("touchstart", pausar, { passive: true });
    seccion.addEventListener("touchend", function () { reanudarPronto(6000); }, { passive: true });
    seccion.addEventListener("touchcancel", function () { reanudarPronto(3000); }, { passive: true });

    seccion.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowRight") { ev.preventDefault(); ir(actual + 1, true); }
      if (ev.key === "ArrowLeft")  { ev.preventDefault(); ir(actual - 1, true); }
    });

    /* Solo corre mientras la seccion esta a la vista: un temporizador
       girando en una seccion que nadie ve solo gasta bateria. */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { e.isIntersecting ? arrancar() : parar(); });
      }, { threshold: 0.25 }).observe(seccion);
    } else {
      arrancar();
    }

    return seccion;
  }

  /* ========================== 07 · CAPACIDADES ===========================
     La inversión a fondo claro. La camioneta viaja pegada al scroll y va
     cambiando de unidad en cada bloque, así el visitante ve variedad de
     inventario sin salir del efecto.

     El giro vive en su propia sección (#giro); aquí lo que cambia es la
     unidad, no el ángulo.
     ====================================================================== */

  function buildCaps() {
    var truckImg = h("img", { src: CAPS[0].image, alt: "Toyota Tacoma " + CAPS[0].t + " en estudio azul" });
    var truck = h("div.caps__truck.caps__truck--single", null, truckImg);

    var panels = CAPS.map(function (c) {
      return h("article.caps__panel", null,
        h("img.caps__thumb", { src: c.image, alt: "", loading: "lazy", decoding: "async" }),
        h("div.caps__copy", null,
          h("span.n", null, c.n + " · " + c.tag),
          h("b", null, c.t),
          h("p", null, c.d),
          link(CONFIG.catalogUrl, "caps__link", "Ver catálogo actual", ARROW)));
    });

    var dots = CAPS.map(function () { return h("i"); });

    var stage = h("div.caps__stage", null,
      h("div.caps__head", null,
        h("p.eyebrow", null, "Diseñadas para destacar"),
        h("h2.display.h-lg", null, "Elige tu ", h("em", null, "actitud"))),
      truck,
      h("div.caps__panels", null, panels),
      h("div.caps__dots", { "aria-hidden": "true" }, dots)
    );

    /* Una pantalla de scroll por bloque, más una de entrada y otra de salida. */
    var section = h("section.caps#capacidades", {
      style: "height:" + (CAPS.length * 80 + 60) + "vh"
    }, stage);

    var current = -1;

    section._tick = function (p) {
      var span = range(p, 0.06, 0.94);
      var pos = span * CAPS.length;
      var idx = clamp(Math.floor(pos), 0, CAPS.length - 1);

      if (idx !== current) {
        current = idx;
        /* Cambio de unidad con un parpadeo corto: sustituir el src en seco
           enseña el hueco mientras carga la siguiente foto. */
        truckImg.classList.add("is-out");
        var next = CAPS[idx];
        setTimeout(function () {
          if (current !== idx) return;
          truckImg.src = next.image;
          truckImg.alt = "Toyota Tacoma " + next.t + " en estudio azul";
          truckImg.classList.remove("is-out");
        }, 180);
        dots.forEach(function (d, i) { d.classList.toggle("is-on", i === idx); });
      }

      /* Recorrido en zigzag: cada bloque la recibe del lado contrario al
         texto. */
      var local = pos - idx;
      var dir = idx % 2 === 0 ? 1 : -1;
      var x = lerp(-22 * dir, 16 * dir, easeOut(local));
      var y = lerp(6, -6, local);
      var rot = lerp(-1.6 * dir, 1.6 * dir, local);
      var pulse = 0.92 + local * 0.13;

      truck.style.transform =
        "translate(calc(-50% + " + mv(x) + "vw), calc(-50% + " + mv(y) + "vh)) " +
        "rotate(" + mv(rot) + "deg) scale(" + sc(pulse) + ")";

      /* Recortado a los extremos para que el primero y el último se
         sostengan mientras la sección sigue fija. */
      var posVis = clamp(pos, 0, CAPS.length - 1);
      for (var i = 0; i < panels.length; i++) {
        var d = i - posVis;
        var vis = clamp(1 - Math.abs(d) * 1.9, 0, 1);
        panels[i].style.opacity = String(vis);
        panels[i].style.transform = "translateY(" + mv(d * 46) + "px)";
      }
    };

    return section;
  }

  /* ===================== 08 · INVENTARIO ================================
     "Lo que hay hoy". Sección fija: al bajar se va mostrando una camioneta
     a la vez con su FOTO REAL del lote, a pantalla completa, con la ficha
     al lado.

     Las fotos son las del lote, con el sol del Valle y el sticker en el
     parabrisas. Eso es lo que convence a un comprador de título rebuilt:
     la unidad existe y está parada ahí.
     ====================================================================== */

  function buildInventory() {
    var shots = vehicles.map(function (v, i) {
      return h("div.inv__shot", null,
        h("img", {
          src: v.photo || v.image,
          alt: altText(v),
          loading: i < 2 ? "eager" : "lazy",
          decoding: "async"
        }));
    });
    shots[0].classList.add("is-on");

    /* Una ficha por unidad: se cruzan con opacidad, no se reescribe el
       contenido. Reescribir provoca un parpadeo del texto en cada cambio. */
    var cards = vehicles.map(function (v) {
      var tags = v.highlights.slice(0, 4).map(function (t) { return h("span", null, t); });
      tags.push(h("span.is-rebuilt", null, "Título rebuilt"));

      return h("article.inv__card", null,
        h("div.inv__card-top", null,
          h("span.inv__yr", null, String(v.year)),
          h("h3.inv__name", null, v.trim)),
        h("div.inv__meta", null, metaOf(v).map(function (m) { return h("span", null, m); })),
        h("div.inv__tags", null, tags),
        h("p.inv__note", null, v.titleDisclosure),
        h("div.inv__cta", null,
          link(waUnit(v), "btn btn--wa", "Preguntar por esta", ARROW),
          link(CONFIG.phoneHref, "btn btn--ghost", "Llamar")));
    });
    cards[0].classList.add("is-on");

    var counter = h("b", null, "01");
    var dots = vehicles.map(function () { return h("i"); });
    dots[0].classList.add("is-on");

    var stage = h("div.inv__stage", null,
      h("div.inv__frame", null, shots),
      h("div.inv__scrim", { "aria-hidden": "true" }),
      h("div.inv__head", null,
        h("p.eyebrow", null, "Inventario · " + vehicles.length + " unidades"),
        h("h2.display.h-md", null, "Lo que ", h("em", null, "hay"), " hoy")),
      h("div.inv__cards", null, cards),
      h("div.inv__num", null, counter, h("span", null, "de " + String(vehicles.length).padStart(2, "0"))),
      h("div.inv__dots", { "aria-hidden": "true" }, dots)
    );

    /* Una pantalla de scroll por unidad, más una de entrada y otra de
       salida: da tiempo de leer la ficha sin que se sienta atorado. */
    var section = h("section.inv#inventario", {
      style: "height:" + (vehicles.length * 80 + 60) + "vh"
    }, stage);

    var current = -1;

    section._tick = function (p) {
      var span = range(p, 0.05, 0.95);
      var idx = clamp(Math.floor(span * vehicles.length), 0, vehicles.length - 1);

      if (idx === current) return;
      current = idx;

      shots.forEach(function (s, i) { s.classList.toggle("is-on", i === idx); });
      cards.forEach(function (c, i) { c.classList.toggle("is-on", i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle("is-on", i === idx); });
      counter.textContent = String(idx + 1).padStart(2, "0");
    };

    return section;
  }

    function buildRebuilt() {
    var dl = h("dl.rebuilt__qa");
    REBUILT_QA.forEach(function (qa, i) {
      /* Escalonadas: entran una tras otra en vez de aparecer las cuatro de
         golpe, que se lee como un bloque de texto. */
      var d = "transition-delay:" + (i * 110) + "ms";
      dl.appendChild(h("dt.reveal", { style: d }, qa.q));
      dl.appendChild(h("dd.reveal", { style: d }, qa.a));
    });

    return h("section.section.section--ice.on-ice#titulo", null,
      h("div.section__inner", null,
        h("div.section__head.reveal", null,
          h("p.eyebrow", null, "Sin letra chica"),
          h("h2.display.h-lg", null, "Hablemos ", h("em", null, "del"), " título")),
        h("div.rebuilt", null,
          dl,
          h("aside.rebuilt__note.reveal", null,
            h("b", null, "Te lo decimos antes de que preguntes"),
            h("p", null, "Las unidades publicadas por Car Haus pueden incluir título rebuilt. No lo escondemos: consulta el historial y las condiciones de cada Tacoma directamente con nosotros."),
            h("p", null, "Llevamos más de 30 años haciendo esto en el Valle. Un lote que piensa quedarse no puede permitirse esconderle nada a un cliente."),
            h("p", null, "Si eso no es para ti, lo entendemos. Si lo que buscas es una Tacoma bien equipada a un precio que existe, ven a verla."),
            link(CONFIG.catalogUrl, "btn btn--wa", "Ver catálogo", ARROW)))));
  }

  function buildSteps() {
    return h("section.section#comprar", null,
      h("div.section__inner", null,
        h("div.section__head.reveal", null,
          h("p.eyebrow", null, "Cómo comprar"),
          h("h2.display.h-lg", null, "Tres ", h("em", null, "pasos"), " y ya")),
        h("div.steps", null, STEPS.map(function (st, i) {
          return h("div.steps__item.reveal", { style: "transition-delay:" + (i * 130) + "ms" },
            h("b", null, st.n), h("h3", null, st.t), h("p", null, st.d));
        }))));
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

  function buildFooter() {
    return h("footer.foot", null,
      h("img.foot__mark", { src: CONFIG.logo, alt: "", "aria-hidden": "true", loading: "lazy" }),
      h("div.foot__grid", null,
        h("div", null,
          h("h4", null, "Car Haus LLC"),
          h("p", { style: "margin:0;max-width:34ch;color:var(--on-night-2)" },
            "Más de 30 años en el Valle. Toyota Tacoma inspeccionadas, con financiamiento y el título declarado de frente."),
          h("div", { style: "margin-top:22px" },
            link(CONFIG.catalogUrl, "btn btn--wa", "Catálogo", ARROW))),
        h("div", null, h("h4", null, "Navegar"),
          h("ul", null, [
            ["#giro", "El lote"], ["#capacidades", "Capacidades"], ["#inventario", "Inventario"],
            ["#titulo", "Título rebuilt"], ["#comprar", "Cómo comprar"], ["#ubicacion", "Ubicación"]
          ].map(function (l) { return h("li", null, h("a", { href: l[0] }, l[1])); }))),
        h("div", null, h("h4", null, "Contacto"),
          h("ul", null,
            h("li", null, link(CONFIG.phoneHref, "", CONFIG.phoneDisplay)),
            h("li", null, link("mailto:" + CONFIG.email, "", CONFIG.email)),
            h("li", null, link(CONFIG.mapsUrl, "", "913 W U.S. Hwy 83, Suite C")),
            h("li", null, link(CONFIG.facebookUrl, "", "Facebook"))))),
      h("div.foot__legal", null,
        h("span", null, "© " + new Date().getFullYear() + " Car Haus LLC · Pharr, TX"),
        h("span", null, "Todas las unidades con título rebuilt. Precios y disponibilidad sujetos a cambio.")));
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
        im.src = u;
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
    var caps = buildCaps();

    root.appendChild(nav);
    if (nav._backdrop) root.appendChild(nav._backdrop);
    root.appendChild(hero);
    root.appendChild(buildTicker());
    root.appendChild(stats);
    root.appendChild(caps);
    root.appendChild(buildRebuilt());
    root.appendChild(buildSteps());
    root.appendChild(buildPlace());
    root.appendChild(buildFooter());

    /* La pagina no se entrega hasta que el hero esta completo. */
    var loader = buildLoader();
    document.body.appendChild(loader);
    document.documentElement.classList.add("is-loading");

    var criticos = (hero._preload || []).slice();
    /* La primera imagen del showcase llega mientras el hero termina. */
    if (CAPS[0] && CAPS[0].image) criticos.push(CAPS[0].image);

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
      CAPS.forEach(function (c) { if (c.image) despues.push(c.image); });
      preload(despues);
    });

    var fab = link(CONFIG.catalogUrl, "fab", "", WA_ICON);
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
    var scenes = [hero, caps].filter(function (s) { return s && s._tick; });
    var iceZones = [];
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
