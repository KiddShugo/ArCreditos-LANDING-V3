/* AR Créditos · CATÁLOGO (interfaz): categorías, búsqueda, tipo, orden, tarjetas, "ver más" y detalle.
   Los datos vienen de assets/data/productos.js; la lógica de filtros de assets/js/catalogo-core.js.
   El estado de los filtros se refleja en la dirección (?categoria=hogar&tipo=televisores&q=noblex&orden=valor-asc),
   así un enlace lleva directo al catálogo filtrado y el detalle de un producto se puede compartir (?producto=<id>).
   El catálogo vive en catalogo.html (sección #productos). El detalle del producto (<dialog id="producto">)
   funciona en las dos páginas: en el inicio lo abre la vitrina de destacados (assets/js/promos.js). */
(function () {
  const AR = (window.AR = window.AR || {});
  const C = AR.cat;
  const { esc, textoPlazo, textoValor, marcaModelo } = C;
  const POR_PAGINA = AR.config.catalogo.porPagina;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ORDENES = { '': 'Orden del catálogo', 'valor-asc': 'Menor valor informado', 'valor-desc': 'Mayor valor informado', nombre: 'Nombre (A-Z)' };

  const ICON = {
    wa: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41"/></svg>',
    plus: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  };

  /* la foto del producto si la tiene; si no, la ilustración de su tipo */
  const media = (p, w = 480, h = 360) => p.imagen
    ? `<img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy" decoding="async" width="${w}" height="${h}">`
    : AR.ilustracion(p.ilustracion);

  /* ------------------------------------------------------------ tarjeta */
  function acciones(p) {
    const n = AR.consulta.cantidad(p.id);
    const qty = n
      ? `<div class="qty qty--card" role="group" aria-label="Cantidad de ${esc(p.nombre)} en tu consulta">
           <button type="button" class="qty__btn" data-q="-1" aria-label="${n === 1 ? 'Quitar de la consulta' : 'Restar uno'}">−</button>
           <span class="qty__n" aria-live="polite">${n}</span>
           <button type="button" class="qty__btn" data-q="1" aria-label="Sumar uno">+</button>
         </div>
         <span class="pc__added">${ICON.check}<span>En tu consulta</span></span>`
      : `<button type="button" class="btn btn--primary pc__add" data-add>${ICON.plus}<span>Agregar<span class="pc__add-long"> a la consulta</span></span></button>`;
    return `${qty}<a class="pc__wa" href="${AR.whatsapp.url(AR.whatsapp.mensajeProducto(p))}" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp solo este producto: ${esc(p.nombre)}" title="Consultar solo este producto por WhatsApp">${ICON.wa}</a>`;
  }

  function tarjeta(p, i) {
    const tipo = C.tipoPorId.get(p.tipo)?.nombre || '';
    const mm = marcaModelo(p);
    const n = AR.consulta.cantidad(p.id);
    return `<li class="pc${n ? ' is-in' : ''}" data-id="${p.id}" style="--i:${i}">
      <article class="pc__in">
        <div class="pc__media">${media(p)}<span class="pc__tag">${esc(tipo)}</span></div>
        <div class="pc__body">
          ${mm ? `<p class="pc__brand">${esc(mm)}</p>` : ''}
          <h3 class="pc__name"><a class="pc__link" href="?producto=${p.id}#productos" data-detalle>${esc(p.nombre)}</a></h3>
          <dl class="pc__facts">
            <div class="pc__fact"><dt>Plazo</dt><dd>${esc(textoPlazo(p))}</dd></div>
            <div class="pc__fact pc__fact--value"><dt>${p.valor ? 'Valor informado' : 'Valor'}</dt><dd${p.valor ? ' class="pc__value"' : ''}>${esc(textoValor(p))}</dd></div>
          </dl>
          <div class="pc__actions">${acciones(p)}</div>
        </div>
      </article>
    </li>`;
  }

  /* piezas compartidas con la vitrina de destacados del inicio (assets/js/promos.js) */
  AR.ui = { ICON, media, acciones };

  /* ------------------------------------------------------------ estado <-> dirección */
  const estado = { categoria: '', tipo: '', q: '', orden: '' };
  let visibles = POR_PAGINA;

  function leerURL() {
    const sp = new URLSearchParams(location.search);
    estado.categoria = C.catPorId.has(sp.get('categoria')) ? sp.get('categoria') : '';
    const t = C.tipoPorId.get(sp.get('tipo'));
    estado.tipo = t && (!estado.categoria || t.categoria === estado.categoria) ? t.id : '';
    estado.q = (sp.get('q') || '').slice(0, 60);
    estado.orden = ORDENES[sp.get('orden')] ? sp.get('orden') : '';
    return sp.get('producto');
  }
  function escribirURL() {
    const sp = new URLSearchParams(location.search);
    ['categoria', 'tipo', 'q', 'orden'].forEach((k) => (estado[k] ? sp.set(k, estado[k]) : sp.delete(k)));
    const qs = sp.toString();
    history.replaceState(history.state, '', `${location.pathname}${qs ? '?' + qs : ''}${location.hash}`);
  }

  /* ------------------------------------------------------------ montaje
     ctx.lista: la lista que recorre "anterior / siguiente" en el detalle (la filtrada en el catálogo,
     la de destacados en el inicio). ctx.irA: filtra el catálogo sin salir de la página (solo en catalogo.html;
     en el inicio los enlaces de categoría llevan a catalogo.html). */
  function init() {
    const ctx = { lista: () => C.productos, irA: null };
    const dlg = document.getElementById('producto');
    const detalle = dlg ? crearDetalle(dlg, ctx) : null;
    AR.detalle = { usarLista(fn) { ctx.lista = fn; } };

    const root = document.getElementById('productos');
    if (root) montarCatalogo(root, detalle, ctx);

    if (!detalle) return;
    const pid = new URLSearchParams(location.search).get('producto');
    if (pid && C.porId.has(pid)) detalle.abrir(pid, { desdeURL: true });
    window.addEventListener('popstate', () => {
      const id = new URLSearchParams(location.search).get('producto');
      if (id && C.porId.has(id)) detalle.abrir(id, { desdeURL: true });
      else detalle.cerrar({ desdeHistorial: true });
    });
  }

  function montarCatalogo(root, detalle, ctx) {
    // los números del encabezado de catalogo.html salen de los datos
    document.querySelectorAll('[data-cpage-total]').forEach((el) => { el.textContent = C.productos.length; });
    document.querySelectorAll('[data-cpage-cats]').forEach((el) => { el.textContent = C.categorias.length; });
    const tabs = $('[data-cat-tabs]', root);
    const inQ = $('#cat-q', root);
    const btnClear = $('[data-q-clear]', root);
    const selTipo = $('#cat-tipo', root);
    const selOrden = $('#cat-orden', root);
    const grid = $('#cat-grid', root);
    const resultado = $('#cat-resultado', root);
    const chips = $('[data-cat-chips]', root);
    const masWrap = $('[data-cat-mas]', root);
    const mas = $('button', masWrap);
    const vacio = $('[data-cat-vacio]', root);
    const cta = $('[data-cat-cta]', root);

    /* pestañas de categoría, con sus cantidades calculadas de los datos */
    const pestañas = [{ id: '', nombre: 'Todo el catálogo', bajada: 'Las tres categorías juntas', ilustracion: null }, ...C.categorias];
    tabs.innerHTML = pestañas.map((c) => {
      const n = c.id ? C.cuenta((p) => p.categoria === c.id) : C.productos.length;
      return `<button type="button" class="ctab" data-cat="${c.id}" aria-pressed="false">
        ${c.ilustracion ? `<span class="ctab__ilu">${AR.ilustracion(c.ilustracion)}</span>` : '<span class="ctab__ilu ctab__ilu--all" aria-hidden="true"><i></i><i></i><i></i><i></i></span>'}
        <span class="ctab__txt"><span class="ctab__name">${esc(c.nombre)}</span><span class="ctab__count">${n} productos</span></span>
      </button>`;
    }).join('');
    selOrden.innerHTML = Object.entries(ORDENES).map(([v, t]) => `<option value="${v}">${t}</option>`).join('');

    /* fila de categorías deslizable (teléfono): bordes difuminados según la posición, flecha para avanzar
       y, la primera vez que aparece en pantalla, un pequeño deslizamiento de ida y vuelta que muestra que se mueve */
    const tabsWrap = tabs.parentElement;
    const tabsMas = $('[data-ctabs-more]', tabsWrap);
    const marcarBordes = () => {
      const max = tabs.scrollWidth - tabs.clientWidth;
      tabsWrap.classList.toggle('is-scrollable', max > 4);
      tabsWrap.classList.toggle('is-scrolled', tabs.scrollLeft > 4);
      tabsWrap.classList.toggle('is-end', max <= 4 || tabs.scrollLeft >= max - 4);
    };
    tabs.addEventListener('scroll', marcarBordes, { passive: true });
    tabsWrap.addEventListener('bordes', marcarBordes);
    addEventListener('resize', marcarBordes, { passive: true });
    tabsMas?.addEventListener('click', () => tabs.scrollBy({ left: Math.round(tabs.clientWidth * 0.7), behavior: reduce() ? 'auto' : 'smooth' }));
    let tabsTocadas = false;
    ['pointerdown', 'touchstart', 'wheel'].forEach((ev) => tabs.addEventListener(ev, () => { tabsTocadas = true; }, { passive: true, once: true }));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        marcarBordes();
        if (reduce() || tabsTocadas || !tabsWrap.classList.contains('is-scrollable') || tabsWrap.classList.contains('is-end')) return;
        setTimeout(() => {
          if (tabsTocadas) return;
          const x0 = tabs.scrollLeft;
          tabsWrap.classList.add('is-nudging');
          tabs.scrollTo({ left: x0 + 96, behavior: 'smooth' });
          setTimeout(() => {
            if (!tabsTocadas) tabs.scrollTo({ left: x0, behavior: 'smooth' });
            setTimeout(() => tabsWrap.classList.remove('is-nudging'), 600);
            tabsMas?.classList.add('is-bob');
          }, 700);
        }, 450);
      }, { threshold: 0.9 });
      io.observe(tabs);
    }

    function pintarTipos() {
      const lista = C.tiposDe(estado.categoria);
      selTipo.innerHTML = `<option value="">Todos los tipos</option>` + lista.map((t) => {
        const n = C.cuenta((p) => p.tipo === t.id);
        return `<option value="${t.id}">${esc(t.nombre)} (${n})</option>`;
      }).join('');
      selTipo.value = estado.tipo;
    }

    let ultimaLista = [];
    ctx.lista = () => (ultimaLista.length ? ultimaLista : C.productos);
    function pintar({ animar = true, desde = 0 } = {}) {
      tabs.querySelectorAll('.ctab').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === estado.categoria)));
      // en el teléfono las pestañas se deslizan: la elegida queda a la vista
      // (en la primera carga, sin animación y después de que la página se acomode)
      const llevar = (suave) => {
        const b = tabs.querySelector('.ctab[aria-pressed="true"]');
        if (b && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: Math.max(0, b.offsetLeft - tabs.offsetLeft - 24), behavior: suave && !reduce() ? 'smooth' : 'auto' });
      };
      if (tabs.dataset.listo) llevar(true);
      else { tabs.dataset.listo = '1'; requestAnimationFrame(() => llevar(false)); addEventListener('load', () => llevar(false), { once: true }); }
      requestAnimationFrame(() => tabsWrap.dispatchEvent(new Event('bordes')));
      if (inQ.value !== estado.q) inQ.value = estado.q;
      btnClear.hidden = !estado.q;
      selOrden.value = estado.orden;
      const lista = C.filtrar(estado);
      ultimaLista = lista;
      const ver = lista.slice(0, visibles);

      // cada tarjeta nueva entra con una animación corta (CSS, escalonada por --i); las que ya estaban no se tocan
      if (desde > 0) grid.insertAdjacentHTML('beforeend', ver.slice(desde).map((p, i) => tarjeta(p, i)).join(''));
      else grid.innerHTML = ver.map((p, i) => tarjeta(p, animar ? i : 0)).join('');
      grid.setAttribute('aria-busy', 'false');

      const cat = C.catPorId.get(estado.categoria);
      const tipo = C.tipoPorId.get(estado.tipo);
      const total = lista.length;
      let txt = `${total} ${total === 1 ? 'producto' : 'productos'}`;
      if (estado.q) txt = `${total} ${total === 1 ? 'resultado' : 'resultados'} para “${estado.q}”`;
      if (tipo) txt += ` en ${tipo.nombre}`; else if (cat) txt += ` en ${cat.nombre}`;
      if (total > ver.length) txt += ` · mostrando ${ver.length}`;
      resultado.textContent = txt;

      const activos = [];
      if (tipo) activos.push(['tipo', tipo.nombre]);
      if (estado.q) activos.push(['q', `“${estado.q}”`]);
      if (estado.orden) activos.push(['orden', ORDENES[estado.orden]]);
      chips.innerHTML = activos.map(([k, t]) => `<button type="button" class="chip" data-quitar-filtro="${k}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.x}</button>`).join('')
        + (activos.length || estado.categoria ? '<button type="button" class="chip chip--clear" data-limpiar>Limpiar filtros</button>' : '');

      const resto = total - ver.length;
      masWrap.hidden = resto <= 0;
      mas.innerHTML = `Ver más productos <span class="muted">(${resto} ${resto === 1 ? 'restante' : 'restantes'})</span>`;
      vacio.hidden = total > 0;
      if (!total) {
        $('[data-vacio-q]', vacio).textContent = estado.q ? `para “${estado.q}”` : 'con estos filtros';
        const wa = $('[data-vacio-wa]', vacio);
        wa.href = AR.whatsapp.url(estado.q ? `Hola, estoy buscando: ${estado.q}. ¿Lo pueden conseguir?` : AR.config.whatsapp.mensajeGeneral);
      }
      pintarCTA(cat);
    }

    /* el cierre del catálogo cambia según la categoría elegida */
    const CTA = {
      '': ['¿No encontrás lo que buscás?', 'Conseguimos productos a pedido, siempre de primeras marcas. Escribinos y un asesor te ayuda a elegir.', 'Hola, estoy buscando un producto que no encuentro en el catálogo.'],
      comercial: ['¿Necesitás otro equipo para tu comercio?', 'Conseguimos el equipamiento que necesita cada comercio, siempre de primeras marcas.', 'Hola, busco equipamiento para mi comercio que no encuentro en el catálogo.'],
      hogar: ['¿Buscás otro producto para tu casa?', 'Si no está en la lista, preguntanos: lo conseguimos a pedido.', 'Hola, busco un producto para el hogar que no encuentro en el catálogo.'],
      personal: ['¿Buscás otro producto de uso personal?', 'Si no está en la lista, preguntanos: lo conseguimos a pedido.', 'Hola, busco un producto de uso personal que no encuentro en el catálogo.'],
    };
    function pintarCTA(cat) {
      const [h, p, msg] = CTA[cat?.id || ''];
      $('[data-cta-h]', cta).textContent = h;
      $('[data-cta-p]', cta).textContent = p;
      $('[data-cta-wa]', cta).href = AR.whatsapp.url(msg);
    }

    function cambiar(parcial, { scroll = false } = {}) {
      Object.assign(estado, parcial);
      if ('categoria' in parcial) {
        const t = C.tipoPorId.get(estado.tipo);
        if (t && estado.categoria && t.categoria !== estado.categoria) estado.tipo = '';
        pintarTipos();
      }
      visibles = POR_PAGINA;
      escribirURL();
      pintar();
      if (scroll) irAlCatalogo();
    }

    /* lleva la vista al título del catálogo, justo debajo del header */
    function irAlCatalogo() {
      const y = root.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(root).paddingTop) - (AR.headerAlto?.() ?? 64) - 24;
      window.scrollTo({ top: Math.max(0, y), behavior: reduce() ? 'auto' : 'smooth' });
    }

    /* eventos de los controles */
    tabs.addEventListener('click', (e) => { const b = e.target.closest('.ctab'); if (b) cambiar({ categoria: b.dataset.cat }); });
    let qT;
    inQ.addEventListener('input', () => { clearTimeout(qT); qT = setTimeout(() => cambiar({ q: inQ.value.trim().slice(0, 60) }), 140); btnClear.hidden = !inQ.value; });
    inQ.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(qT); cambiar({ q: inQ.value.trim().slice(0, 60) }); } });
    btnClear.addEventListener('click', () => { inQ.value = ''; cambiar({ q: '' }); inQ.focus(); });
    selTipo.addEventListener('change', () => {
      const t = C.tipoPorId.get(selTipo.value);
      cambiar(t && !estado.categoria ? { categoria: t.categoria, tipo: t.id } : { tipo: selTipo.value });
    });
    selOrden.addEventListener('change', () => cambiar({ orden: selOrden.value }));
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('[data-quitar-filtro]');
      if (b) return cambiar({ [b.dataset.quitarFiltro]: '' });
      if (e.target.closest('[data-limpiar]')) cambiar({ categoria: '', tipo: '', q: '', orden: '' });
    });
    $('[data-vacio-limpiar]', vacio).addEventListener('click', () => { cambiar({ categoria: '', tipo: '', q: '', orden: '' }); inQ.focus(); });
    mas.addEventListener('click', () => {
      const desde = Math.min(visibles, ultimaLista.length);
      visibles += POR_PAGINA;
      pintar({ desde });
      // el foco pasa al primer producto nuevo, para seguir con el teclado desde ahí
      grid.children[desde]?.querySelector('.pc__link')?.focus({ preventScroll: true });
    });

    /* acciones dentro de las tarjetas */
    grid.addEventListener('click', (e) => {
      const li = e.target.closest('.pc'); if (!li) return;
      const id = li.dataset.id;
      if (e.target.closest('[data-add]')) { AR.consulta.agregar(id); return; }
      const q = e.target.closest('[data-q]');
      if (q) { AR.consulta.fijar(id, AR.consulta.cantidad(id) + Number(q.dataset.q)); return; }
      if (e.target.closest('[data-detalle]') && detalle) { e.preventDefault(); detalle.abrir(id); }
    });

    /* si la lista cambia (desde una tarjeta, el detalle, el panel u otra pestaña), se actualizan las tarjetas afectadas */
    AR.consulta.on((d) => {
      const ids = d.id ? [d.id] : [...grid.children].map((li) => li.dataset.id);
      ids.forEach((id) => {
        const li = grid.querySelector(`.pc[data-id="${id}"]`); if (!li) return;
        const p = C.porId.get(id);
        const foco = li.contains(document.activeElement) ? (document.activeElement.dataset.q || (document.activeElement.matches('[data-add]') ? 'add' : null)) : null;
        li.classList.toggle('is-in', AR.consulta.cantidad(id) > 0);
        li.querySelector('.pc__actions').innerHTML = acciones(p);
        // el foco no se pierde al cambiar el botón por el contador
        if (foco) (li.querySelector(foco === 'add' ? '[data-q="1"]' : `[data-q="${foco}"]`) || li.querySelector('[data-add]') || li.querySelector('.pc__link'))?.focus();
        if (d.tipo === 'nuevo' && !reduce()) { const a = li.querySelector('.pc__in'); a.classList.remove('is-pop'); void a.offsetWidth; a.classList.add('is-pop'); }
      });
    });

    /* API para el header y otros enlaces: llevar al catálogo con un filtro */
    AR.catalogoUI = {
      ir(parcial = {}) { cambiar({ categoria: '', tipo: '', q: '', orden: '', ...parcial }, { scroll: true }); },
      abrir: (id) => detalle?.abrir(id),
    };
    ctx.irA = (parcial) => AR.catalogoUI.ir(parcial);
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-ir-categoria]');
      if (!a) return;
      e.preventDefault();
      AR.catalogoUI.ir({ categoria: a.dataset.irCategoria });
    });

    // las tarjetas del primer pintado esperan quietas hasta que el catálogo entra en pantalla
    if (!reduce() && 'IntersectionObserver' in window) {
      grid.classList.add('is-waiting');
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { grid.classList.remove('is-waiting'); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
      io.observe(grid);
    }

    leerURL();
    pintarTipos();
    pintar();
    AR.catalogoListo = true;
    document.documentElement.dataset.catalogo = 'listo';
  }

  /* ------------------------------------------------------------ detalle del producto (<dialog>) */
  function crearDetalle(dlg, ctx) {
    const el = (s) => $(s, dlg);
    let actual = null, cant = 1, empujado = false, ultimoFoco = null, cerrando = false;

    function urlCon(id) {
      const sp = new URLSearchParams(location.search);
      id ? sp.set('producto', id) : sp.delete('producto');
      const qs = sp.toString();
      return `${location.pathname}${qs ? '?' + qs : ''}${location.hash}`;
    }

    function pintarCompra() {
      const n = AR.consulta.cantidad(actual.id);
      el('[data-pm-n]').textContent = cant;
      el('[data-pm-menos]').disabled = cant <= 1;
      const add = el('[data-pm-add]');
      add.innerHTML = n ? (n === cant ? `${ICON.check}<span>En tu consulta</span>` : `<span>Actualizar cantidad</span>`) : `${ICON.plus}<span>Agregar a mi consulta</span>`;
      add.classList.toggle('is-done', n > 0 && n === cant);
      el('[data-pm-ver]').hidden = !n;
      el('[data-pm-wa]').href = AR.whatsapp.url(AR.whatsapp.mensajeProducto(actual, cant));
    }

    function pintarProducto(p) {
      actual = p;
      cant = AR.consulta.cantidad(p.id) || 1;
      const cat = C.catPorId.get(p.categoria), tipo = C.tipoPorId.get(p.tipo);
      el('[data-pm-media]').innerHTML = media(p, 960, 720) + (p.imagen ? '' : '<span class="pm__ref">Ilustración de referencia</span>');
      el('[data-pm-crumb]').innerHTML = `<a href="catalogo.html?categoria=${cat.id}" data-pm-cat="${cat.id}">${esc(cat.nombre)}</a><span aria-hidden="true">/</span><a href="catalogo.html?categoria=${cat.id}&amp;tipo=${tipo.id}" data-pm-tipo="${tipo.id}">${esc(tipo.nombre)}</a>`;
      el('#pm-title').textContent = p.nombre;
      const mm = marcaModelo(p);
      el('[data-pm-brand]').textContent = mm;
      el('[data-pm-brand]').hidden = !mm;
      el('[data-pm-valor]').textContent = textoValor(p);
      el('[data-pm-valor-dt]').textContent = p.valor ? 'Valor informado' : 'Valor';
      el('[data-pm-plazo]').textContent = textoPlazo(p);
      const ul = el('[data-pm-datos]');
      ul.innerHTML = p.datos.map((d) => `<li>${esc(d)}</li>`).join('');
      el('[data-pm-datos-wrap]').hidden = !p.datos.length;
      // anterior / siguiente dentro de la lista que se está viendo (la filtrada o la de destacados)
      const lista = ctx.lista();
      const i = lista.indexOf(p);
      const prev = lista[i - 1], next = lista[i + 1];
      const bp = el('[data-pm-prev]'), bn = el('[data-pm-next]');
      const enfocado = document.activeElement;
      bp.disabled = !prev; bn.disabled = !next;
      // si el botón que tenía el foco quedó deshabilitado (primer o último producto), el foco pasa al otro
      if ((enfocado === bp && !prev) || (enfocado === bn && !next)) ((enfocado === bp ? bn : bp).disabled ? el('.pm__close') : (enfocado === bp ? bn : bp)).focus();
      bp.dataset.id = prev?.id || ''; bn.dataset.id = next?.id || '';
      bp.querySelector('span').textContent = prev ? prev.nombre : '';
      bn.querySelector('span').textContent = next ? next.nombre : '';
      pintarCompra();
      el('.pm__panel').scrollTop = 0;
    }

    function abrir(id, { desdeURL = false } = {}) {
      const p = C.porId.get(id); if (!p) return;
      pintarProducto(p);
      if (!dlg.open) {
        ultimoFoco = document.activeElement;
        dlg.showModal();
        document.documentElement.classList.add('has-dialog');
        if (!desdeURL) { history.pushState({ producto: id }, '', urlCon(id)); empujado = true; }
      } else history.replaceState(history.state, '', urlCon(id));
      el('.pm__close').focus({ preventScroll: true });
    }

    function cerrar({ desdeHistorial = false } = {}) {
      if (!dlg.open || cerrando) return;
      cerrando = true;
      const fin = () => {
        cerrando = false;
        dlg.classList.remove('is-closing'); dlg.close();
        // si se abrió otro panel (la lista de consulta), el foco queda allá
        if (document.querySelector('dialog[open]')) return;
        document.documentElement.classList.remove('has-dialog');
        if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
      };
      if (!desdeHistorial) {
        if (empujado) { empujado = false; history.back(); }
        else history.replaceState(history.state, '', urlCon(null));
      } else empujado = false;
      if (reduce()) fin(); else { dlg.classList.add('is-closing'); setTimeout(fin, 200); }
    }

    dlg.addEventListener('cancel', (e) => { e.preventDefault(); cerrar(); });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) return cerrar();
      if (e.target.closest('[data-producto-cerrar]')) return cerrar();
      if (e.target.closest('[data-pm-menos]')) { cant = Math.max(1, cant - 1); return pintarCompra(); }
      if (e.target.closest('[data-pm-mas]')) { cant = Math.min(99, cant + 1); return pintarCompra(); }
      if (e.target.closest('[data-pm-add]')) {
        const n = AR.consulta.cantidad(actual.id);
        if (!n) AR.consulta.agregar(actual.id, cant); else if (n !== cant) AR.consulta.fijar(actual.id, cant);
        return pintarCompra();
      }
      const nav = e.target.closest('[data-pm-prev], [data-pm-next]');
      if (nav && nav.dataset.id) { pintarProducto(C.porId.get(nav.dataset.id)); history.replaceState(history.state, '', urlCon(nav.dataset.id)); return; }
      // en el catálogo, la categoría o el tipo filtran sin recargar; en el inicio el enlace lleva a catalogo.html
      const c = e.target.closest('[data-pm-cat], [data-pm-tipo]');
      if (c && ctx.irA) {
        e.preventDefault();
        const p = actual;
        cerrar();
        setTimeout(() => ctx.irA(c.dataset.pmTipo ? { categoria: p.categoria, tipo: p.tipo } : { categoria: p.categoria }), 240);
      }
    });
    // flechas del teclado: producto anterior / siguiente
    document.addEventListener('keydown', (e) => {
      if (!dlg.open || e.target.closest?.('input, select, textarea')) return;
      if (e.key === 'ArrowRight') el('[data-pm-next]').click();
      if (e.key === 'ArrowLeft') el('[data-pm-prev]').click();
    });
    AR.consulta.on(() => { if (dlg.open && actual) pintarCompra(); });

    AR.producto = { abrir, cerrar };
    return { abrir, cerrar };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
