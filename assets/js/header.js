/* AR Créditos · HEADER de dos niveles
   - arriba: el sello y el nombre centrados; abajo: la navegación.
   - al bajar, el primer nivel se esconde y queda la barra de navegación con el sello chico y "Mi consulta".
   - "Productos" abre un desplegable con las tres categorías (mouse, toque y teclado).
   - en pantallas chicas la navegación pasa a un menú a pantalla completa.
   - la sección que se está viendo queda marcada en la barra (en catalogo.html, "Productos" queda marcado fijo).
   - los enlaces de categoría llevan a catalogo.html; dentro del catálogo filtran sin recargar (assets/js/catalogo.js). */
(function () {
  const AR = (window.AR = window.AR || {});
  const hdr = document.getElementById('hdr');
  if (!hdr) return;
  const $ = (s, r = hdr) => r.querySelector(s);
  const $$ = (s, r = hdr) => [...r.querySelectorAll(s)];
  const desktop = matchMedia('(min-width: 900px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = AR.cat;

  /* ------------------------------------------------------------ categorías del desplegable (desde los datos) */
  const cats = $('[data-drop-cats]');
  if (cats && C) {
    cats.innerHTML = C.categorias.map((c, i) => `<li style="--i:${i}">
      <a class="drop__card" href="catalogo.html?categoria=${c.id}" data-ir-categoria="${c.id}">
        <span class="drop__ilu">${AR.ilustracion(c.ilustracion)}</span>
        <span class="drop__txt"><span class="drop__name">${C.esc(c.nombre)}</span><span class="drop__desc">${C.esc(c.bajada)}</span>
        <span class="drop__count">${C.cuenta((p) => p.categoria === c.id)} productos</span></span>
      </a></li>`).join('');
    const all = $('[data-drop-total]');
    if (all) all.textContent = C.productos.length;
  }

  /* ------------------------------------------------------------ compacto al bajar */
  const UMBRAL = 72;
  let compacto = false, tick = false;
  const mbar = document.querySelector('.mbar');
  const fab = document.querySelector('.fab');
  /* el botón de WhatsApp de la barra del teléfono "late" cada 7 segundos mientras la barra está a la vista:
     una onda que sale del botón y el ícono que se sacude. Se detiene cuando la persona ya lo tocó, y no
     se mueve con "reducir movimiento" activado en el teléfono. */
  const waBar = mbar?.querySelector('.mbar__wa');
  let tPulso = 0;
  const pulsoActivo = () => waBar && !reduce() && !waBar.dataset.usado && mbar.classList.contains('is-on')
    && !document.documentElement.classList.contains('has-dialog') && !document.documentElement.classList.contains('menu-open') && !document.hidden;
  function pulsar() {
    clearTimeout(tPulso);
    if (!waBar) return;
    if (pulsoActivo()) { waBar.classList.remove('is-pulse'); void waBar.offsetWidth; waBar.classList.add('is-pulse'); }
    tPulso = setTimeout(pulsar, 7000);
  }
  waBar?.addEventListener('click', () => { waBar.dataset.usado = '1'; waBar.classList.remove('is-pulse'); clearTimeout(tPulso); });
  function medir() {
    tick = false;
    // la barra del teléfono y el botón flotante aparecen cuando el hero (con sus propios botones) ya quedó arriba
    const pasado = scrollY > innerHeight * 0.55;
    if (mbar && mbar.classList.contains('is-on') !== pasado) {
      mbar.classList.toggle('is-on', pasado);
      clearTimeout(tPulso);
      // la primera onda llega apenas la barra terminó de aparecer
      if (pasado && waBar && !waBar.dataset.usado) tPulso = setTimeout(pulsar, 1200);
    }
    if (fab) fab.classList.toggle('is-away', !pasado);
    const c = desktop.matches && scrollY > UMBRAL;
    if (c !== compacto) { compacto = c; hdr.classList.toggle('is-compact', c); }
    hdr.classList.toggle('is-scrolled', scrollY > 4);
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(medir); } }, { passive: true });
  desktop.addEventListener('change', () => { medir(); cerrarMenu(); cerrarDrop(); });
  medir();
  // si el foco llega al primer nivel escondido (con Tab), el header se despliega
  $('.hdr__top').addEventListener('focusin', () => { if (compacto) { compacto = false; hdr.classList.remove('is-compact'); } });
  /* la altura que tapa el header en la parte de arriba de la pantalla, para los desplazamientos */
  AR.headerAlto = () => (desktop.matches ? $('.hdr__nav').offsetHeight : hdr.offsetHeight);

  /* ------------------------------------------------------------ desplegable de Productos */
  const item = $('.hdr__item--drop');
  const trigger = $('.hdr__trigger');
  const drop = $('.hdr__drop');
  let tOpen, tClose;
  function abrirDrop({ foco = false } = {}) {
    clearTimeout(tClose);
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    if (foco) drop.querySelector('a')?.focus();
  }
  function cerrarDrop({ foco = false } = {}) {
    clearTimeout(tOpen);
    if (!item.classList.contains('is-open')) return;
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (foco) trigger.focus();
  }
  trigger.addEventListener('click', () => (item.classList.contains('is-open') ? cerrarDrop() : abrirDrop()));
  // mouse: abre con una pequeña intención y cierra con un respiro, para que no parpadee al pasar
  item.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && desktop.matches && finePointer.matches) { clearTimeout(tClose); tOpen = setTimeout(abrirDrop, 90); } });
  item.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && desktop.matches) { clearTimeout(tOpen); tClose = setTimeout(cerrarDrop, 220); } });
  trigger.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); abrirDrop({ foco: true }); } });
  drop.addEventListener('keydown', (e) => {
    const links = [...drop.querySelectorAll('a')];
    const i = links.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
  });
  item.addEventListener('focusout', (e) => { if (desktop.matches && !item.contains(e.relatedTarget)) cerrarDrop(); });
  document.addEventListener('click', (e) => { if (!item.contains(e.target)) cerrarDrop(); });

  /* ------------------------------------------------------------ menú del teléfono */
  const burger = $('.hdr__burger');
  const fuera = () => [document.querySelector('main'), document.querySelector('footer'), document.querySelector('.actionbar'), document.querySelector('.fab')].filter(Boolean);
  const ICON_MENU = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 14h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  const ICON_X = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  function abrirMenu() {
    hdr.classList.add('is-menu');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú');
    burger.innerHTML = ICON_X;
    document.documentElement.classList.add('menu-open');
    fuera().forEach((el) => { el.inert = true; });
  }
  function cerrarMenu({ foco = false } = {}) {
    if (!hdr.classList.contains('is-menu')) return;
    hdr.classList.remove('is-menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    burger.innerHTML = ICON_MENU;
    document.documentElement.classList.remove('menu-open');
    fuera().forEach((el) => { el.inert = false; });
    cerrarDrop();
    if (foco) burger.focus();
  }
  burger.addEventListener('click', () => (hdr.classList.contains('is-menu') ? cerrarMenu() : abrirMenu()));

  /* cualquier enlace del menú lo cierra (y del desplegable también) */
  hdr.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    cerrarDrop();
    cerrarMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (item.classList.contains('is-open')) { cerrarDrop({ foco: true }); return; }
    if (hdr.classList.contains('is-menu')) cerrarMenu({ foco: true });
  });

  /* ------------------------------------------------------------ sección actual en la barra */
  const links = $$('.hdr__links a.hdr__link[href^="#"], .hdr__trigger[data-seccion]');
  const secciones = links.map((l) => document.getElementById((l.getAttribute('href') || '#' + l.dataset.seccion).slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window && secciones.length) {
    const visibles = new Map();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => visibles.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let mejor = null, max = 0;
      visibles.forEach((r, id) => { if (r > max) { max = r; mejor = id; } });
      links.forEach((l) => {
        const id = (l.getAttribute('href') || '#' + l.dataset.seccion).slice(1);
        if (id === mejor) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.01] });
    secciones.forEach((s) => io.observe(s));
  }

  /* desplazamiento suave hacia las secciones (sin animación con "reducir movimiento") */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-ir-categoria') || e.defaultPrevented) return;
    const id = a.getAttribute('href').slice(1);
    const t = id ? document.getElementById(id) : null;
    if (!t || id === 'contenido') return;
    e.preventDefault();
    const y = id === 'top' ? 0 : t.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: y, behavior: reduce() ? 'auto' : 'smooth' });
    history.replaceState(history.state, '', `${location.pathname}${location.search}#${id}`);
    // el foco va a la sección, para que el teclado siga desde ahí
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  });
})();
