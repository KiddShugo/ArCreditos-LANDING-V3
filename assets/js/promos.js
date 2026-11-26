/* AR Créditos · DESTACADOS: la vitrina de la página de inicio (sección #destacados).
   ───────────────────────────────────────────────────────────────────────────────────────────────
   Muestra los productos que tienen el campo "destacado" en assets/data/productos.js, en ese orden:
   uno grande y la lista al costado. Los valores y plazos son los mismos del catálogo (no se inventan
   descuentos ni precios de oferta).

   - Pasa solo al siguiente cada 7 segundos y una barra en la lista marca el tiempo. Se detiene con el mouse
     encima, con el foco del teclado adentro, con un panel abierto, cuando la sección no está en pantalla y
     con el botón de pausa. Elegir un producto a mano también la detiene.
   - Con "reducir movimiento" activado no pasa sola ni hace la cortina negra: cambia con un fundido.
   - Cada producto se agrega a la consulta, se consulta por WhatsApp o abre su detalle: el mismo panel del
     catálogo (assets/js/catalogo.js), que en el inicio recorre solo los destacados. */
(function () {
  const AR = (window.AR = window.AR || {});
  const C = AR.cat, UI = AR.ui;
  const root = document.querySelector('[data-vitrina]');
  if (!root || !C || !UI) return;
  const seccion = root.closest('section');
  const { esc, textoPlazo, textoValor, marcaModelo } = C;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = root) => r.querySelector(s);
  const dos = (n) => String(n).padStart(2, '0');

  const lista = C.productos.filter((p) => p.destacado).sort((a, b) => a.destacado - b.destacado);
  if (!lista.length) { seccion.hidden = true; return; }
  AR.detalle?.usarLista(() => lista);

  const stage = $('[data-vit-stage]');
  const mediaEl = $('[data-vit-media]');
  const bodyEl = $('[data-vit-body]');
  const wipe = $('.vit__wipe');
  const tabs = $('[data-vit-tabs]');
  const pos = $('[data-vit-pos]');
  const btnPausa = $('[data-vit-pausa]');

  /* ------------------------------------------------------------ lista lateral */
  /* (botones comunes y no role="tab": assets/system.js toma todo role="tablist" y esconde los paneles) */
  tabs.innerHTML = lista.map((p, i) => `<li>
    <button type="button" class="vit__tab" id="vit-tab-${i}" aria-controls="vit-panel" data-i="${i}">
      <span class="vit__thumb">${AR.ilustracion(p.ilustracion)}</span>
      <span class="vit__tab-txt">
        <span class="vit__tab-name">${esc(p.nombre)}</span>
        <span class="vit__tab-val">${esc(textoValor(p))}<span aria-hidden="true"> · </span><span class="sr-only">, </span>${esc(textoPlazo(p))}</span>
      </span>
      <span class="vit__tab-n" aria-hidden="true">${dos(i + 1)}</span>
      <span class="vit__prog" aria-hidden="true"><i></i></span>
    </button>
  </li>`).join('');
  const botones = [...tabs.querySelectorAll('.vit__tab')];

  /* ------------------------------------------------------------ producto grande */
  function pintarAcciones(p) {
    $('.vit__actions', bodyEl).innerHTML = UI.acciones(p);
  }
  function pintar(i) {
    const p = lista[i];
    const cat = C.catPorId.get(p.categoria);
    const tipo = C.tipoPorId.get(p.tipo)?.nombre || '';
    const mm = marcaModelo(p);
    mediaEl.innerHTML = `
      <span class="vit__big" aria-hidden="true"><span>${dos(i + 1)}</span></span>
      <div class="vit__ilu">${UI.media(p, 960, 720)}</div>
      <span class="pc__tag vit__tag">${esc(tipo)}</span>`;
    bodyEl.innerHTML = `
      <p class="vit__cat" style="--k:0">${esc(cat.nombre)}${mm ? `<span aria-hidden="true"> · </span>${esc(mm)}` : ''}</p>
      <h3 class="vit__name" style="--k:1">${esc(p.nombre)}</h3>
      <dl class="vit__facts" style="--k:2">
        <div><dt>Plazo</dt><dd>${esc(textoPlazo(p))}</dd></div>
        <div><dt>${p.valor ? 'Valor informado' : 'Valor'}</dt><dd class="vit__value">${esc(textoValor(p))}</dd></div>
      </dl>
      <div class="pc__actions vit__actions" style="--k:3"></div>
      <a class="tlink vit__more" style="--k:4" href="?producto=${p.id}" data-vit-detalle>Ver detalle del producto<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg></a>`;
    pintarAcciones(p);
    stage.classList.toggle('is-added', AR.consulta.cantidad(p.id) > 0);
    mostrado = i;
  }

  /* el cambio: una cortina negra tapa la imagen, cambia el producto y se corre hacia el otro lado mientras
     el texto nuevo sube. Si se pide otro producto en el medio, la cortina termina y muestra el último pedido. */
  let mostrado = -1, objetivo = 0, enCurso = false;
  const CURVA = 'cubic-bezier(.7, 0, .25, 1)';
  const cortina = (desde, hasta, origen, ms) => {
    wipe.getAnimations().forEach((a) => a.cancel());
    wipe.style.transformOrigin = origen;
    return wipe.animate([{ transform: `scaleX(${desde})` }, { transform: `scaleX(${hasta})` }], { duration: ms, easing: CURVA, fill: 'forwards' }).finished;
  };
  async function cambiarA(i) {
    objetivo = i;
    if (enCurso) return;
    if (mostrado < 0 || reduce() || !wipe.animate) {
      const primera = mostrado < 0;
      pintar(i);
      if (!primera) { stage.classList.remove('is-fade'); void stage.offsetWidth; stage.classList.add('is-fade'); }
      return;
    }
    enCurso = true;
    stage.classList.add('is-swapped');
    try {
      while (mostrado !== objetivo) {
        await cortina(0, 1, 'left center', 300);
        pintar(objetivo);
        await cortina(1, 0, 'right center', 480);
      }
    } catch (e) { pintar(objetivo); }
    enCurso = false;
  }

  function elegir(i, { foco = false, manual = false } = {}) {
    i = (i + lista.length) % lista.length;
    actual = i;
    botones.forEach((b, k) => { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    stage.setAttribute('aria-label', `Destacado ${i + 1} de ${lista.length}: ${lista[i].nombre}`);
    pos.textContent = `${dos(i + 1)} / ${dos(lista.length)}`;
    if (foco) botones[i].focus();
    // en el teléfono la lista se desliza: el elegido queda a la vista (sin mover la página)
    if (tabs.scrollWidth > tabs.clientWidth + 4) {
      const b = botones[i].parentElement;
      tabs.scrollTo({ left: Math.max(0, b.offsetLeft - tabs.offsetLeft - 16), behavior: reduce() ? 'auto' : 'smooth' });
    }
    if (manual) pausar(true);
    cambiarA(i);
  }
  let actual = 0;

  /* ------------------------------------------------------------ paso automático */
  let pausaUsuario = reduce(), porMouse = false, porFoco = false, fuera = true;
  const ICON_PAUSA = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>';
  const ICON_PLAY = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 3l8 5-8 5z" fill="currentColor"/></svg>';
  function actualizar() {
    const html = document.documentElement;
    const quieto = pausaUsuario || porMouse || porFoco || fuera || document.hidden || html.classList.contains('has-dialog') || html.classList.contains('menu-open');
    root.classList.toggle('is-paused', quieto);
    root.classList.toggle('is-stopped', pausaUsuario);
    // mientras pasa solo no se anuncia cada cambio; detenida, el lector de pantalla lee el producto elegido
    stage.setAttribute('aria-live', pausaUsuario ? 'polite' : 'off');
    btnPausa.innerHTML = pausaUsuario ? `${ICON_PLAY}<span>Reproducir</span>` : `${ICON_PAUSA}<span>Pausar</span>`;
    btnPausa.setAttribute('aria-label', pausaUsuario ? 'Pasar los destacados automáticamente' : 'Detener el paso automático de los destacados');
  }
  function pausar(si) { pausaUsuario = si; actualizar(); }

  tabs.addEventListener('animationend', (e) => {
    if (e.animationName !== 'vit-prog' || pausaUsuario) return;
    elegir(actual + 1);
  });
  btnPausa.addEventListener('click', () => pausar(!pausaUsuario));
  root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { porMouse = true; actualizar(); } });
  root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { porMouse = false; actualizar(); } });
  root.addEventListener('focusin', () => { porFoco = true; actualizar(); });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) { porFoco = false; actualizar(); } });
  document.addEventListener('visibilitychange', actualizar);
  new MutationObserver(actualizar).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { fuera = !e.isIntersecting; actualizar(); }, { threshold: 0.35 }).observe(root);
  } else fuera = false;

  /* ------------------------------------------------------------ interacción */
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('.vit__tab');
    if (b) elegir(Number(b.dataset.i), { manual: true });
  });
  tabs.addEventListener('keydown', (e) => {
    const paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (paso) { e.preventDefault(); elegir(actual + paso, { foco: true, manual: true }); }
    if (e.key === 'Home') { e.preventDefault(); elegir(0, { foco: true, manual: true }); }
    if (e.key === 'End') { e.preventDefault(); elegir(lista.length - 1, { foco: true, manual: true }); }
  });
  stage.addEventListener('click', (e) => {
    const p = lista[mostrado];
    if (!p) return;
    if (e.target.closest('[data-add]')) { AR.consulta.agregar(p.id); return; }
    const q = e.target.closest('[data-q]');
    if (q) { AR.consulta.fijar(p.id, AR.consulta.cantidad(p.id) + Number(q.dataset.q)); return; }
    if (e.target.closest('[data-vit-detalle]') && AR.producto) { e.preventDefault(); AR.producto.abrir(p.id); }
  });
  // si la lista cambia (desde acá, el detalle o el panel), se actualizan los botones del producto grande
  AR.consulta.on((d) => {
    const p = lista[mostrado];
    if (!p || (d.id && d.id !== p.id)) return;
    const f = document.activeElement;
    const foco = stage.contains(f) ? (f.dataset.q || (f.matches('[data-add]') ? 'add' : null)) : null;
    pintarAcciones(p);
    stage.classList.toggle('is-added', AR.consulta.cantidad(p.id) > 0);
    // el foco no se pierde al cambiar el botón por el contador
    if (foco) ($(foco === 'add' ? '[data-q="1"]' : `[data-q="${foco}"]`, stage) || $('[data-add]', stage))?.focus();
  });

  /* ------------------------------------------------------------ cierre: el total del catálogo cuenta al aparecer */
  seccion.querySelectorAll('[data-total-productos]').forEach((el) => { el.textContent = C.productos.length; });
  seccion.querySelectorAll('[data-cat-ilu]').forEach((el) => {
    const cat = C.catPorId.get(el.dataset.catIlu);
    if (cat) el.innerHTML = AR.ilustracion(cat.ilustracion);
  });
  seccion.querySelectorAll('[data-cuenta-cat]').forEach((el) => {
    const n = C.cuenta((p) => p.categoria === el.dataset.cuentaCat);
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  const contador = seccion.querySelector('[data-contar]');
  if (contador && !reduce() && 'IntersectionObserver' in window) {
    const fin = C.productos.length;
    contador.textContent = '0';
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let t0;
      const paso = (t) => {
        t0 ??= t;
        const k = Math.min(1, (t - t0) / 1300);
        contador.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
      setTimeout(() => { contador.textContent = fin; }, 2200);   // respaldo si la pestaña no anima
    }, { threshold: 0.6 });
    io.observe(contador);
  }

  elegir(0);
  actualizar();
})();
