/* AR Créditos · LISTA DE CONSULTA: los productos que el visitante elige para consultar.
   No es un carrito de compra: no hay pagos ni cobros. La lista se guarda en el navegador del visitante
   (localStorage), así se mantiene al recargar o volver otro día, y se envía armada por WhatsApp.

   API:  AR.consulta.agregar(id, n) · fijar(id, n) · quitar(id) · vaciar() · cantidad(id) · items()
         unidades() · on(fn) · abrir() · cerrar() · avisar(texto, accion)                         */
(function () {
  const AR = (window.AR = window.AR || {});
  const { porId, esc, textoPlazo, textoValor, marcaModelo } = AR.cat;
  const KEY = AR.config.almacenamiento;
  const MAX = 99;

  /* ------------------------------------------------------------ estado y guardado */
  let lista = new Map();          // id -> cantidad, en el orden en que se agregaron
  let datos = { nombre: '', localidad: '' };
  const subs = new Set();

  function leer() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      lista = new Map((raw?.items || []).filter(([id, n]) => porId.has(id) && n > 0).map(([id, n]) => [id, Math.min(MAX, Math.floor(n))]));
      datos = { nombre: raw?.datos?.nombre || '', localidad: raw?.datos?.localidad || '' };
    } catch { lista = new Map(); }
  }
  function guardar() {
    try { localStorage.setItem(KEY, JSON.stringify({ v: 1, items: [...lista], datos })); } catch { /* modo privado: la lista vive mientras la página esté abierta */ }
  }
  function avisarCambio(detalle) { guardar(); subs.forEach((fn) => fn(detalle)); }
  leer();
  // otra pestaña del sitio cambió la lista: se toma su versión
  window.addEventListener('storage', (e) => { if (e.key === KEY) { leer(); subs.forEach((fn) => fn({ tipo: 'sync' })); } });

  const api = {
    items: () => [...lista].map(([id, cantidad]) => ({ producto: porId.get(id), cantidad })),
    cantidad: (id) => lista.get(id) || 0,
    unidades: () => [...lista.values()].reduce((a, b) => a + b, 0),
    distintos: () => lista.size,
    agregar(id, n = 1) {
      if (!porId.has(id)) return;
      const antes = lista.get(id) || 0;
      lista.set(id, Math.min(MAX, antes + n));
      avisarCambio({ tipo: antes ? 'suma' : 'nuevo', id });
    },
    fijar(id, n) {
      if (!lista.has(id)) return;
      if (n <= 0) return api.quitar(id);
      lista.set(id, Math.min(MAX, Math.floor(n)));
      avisarCambio({ tipo: 'cantidad', id });
    },
    quitar(id) {
      if (!lista.has(id)) return;
      const n = lista.get(id);
      const orden = [...lista.keys()].indexOf(id);
      lista.delete(id);
      avisarCambio({ tipo: 'quitado', id });
      const p = porId.get(id);
      api.avisar(`Quitaste ${p.nombre}`, { texto: 'Deshacer', fn: () => {
        const arr = [...lista];
        arr.splice(orden, 0, [id, n]);
        lista = new Map(arr);
        avisarCambio({ tipo: 'nuevo', id });
      } });
    },
    vaciar() {
      if (!lista.size) return;
      const copia = new Map(lista);
      lista.clear();
      avisarCambio({ tipo: 'vaciada' });
      api.avisar('Vaciaste la lista', { texto: 'Deshacer', fn: () => { lista = copia; avisarCambio({ tipo: 'sync' }); } });
    },
    datos: () => ({ ...datos }),
    on: (fn) => { subs.add(fn); return () => subs.delete(fn); },
    mensaje: () => AR.whatsapp.mensajeLista(api.items(), datos),
  };
  AR.consulta = api;

  /* ------------------------------------------------------------ interfaz */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    const drawer = $('#consulta');
    if (!drawer) return;
    const listaEl = $('[data-consulta-lista]', drawer);
    const vacioEl = $('[data-consulta-vacio]', drawer);
    const pies = $$('[data-consulta-pie]', drawer);
    const resumenEl = $('[data-consulta-resumen]', drawer);
    const waBtn = $('[data-consulta-wa]', drawer);
    const preview = $('[data-consulta-preview]', drawer);
    const inNombre = $('#consulta-nombre', drawer);
    const inLocalidad = $('#consulta-localidad', drawer);
    let ultimoFoco = null;

    inNombre.value = datos.nombre;
    inLocalidad.value = datos.localidad;
    [inNombre, inLocalidad].forEach((el) => el.addEventListener('input', () => {
      datos = { nombre: inNombre.value.slice(0, 60), localidad: inLocalidad.value.slice(0, 60) };
      guardar(); pintarMensaje();
    }));

    function pintarMensaje() {
      const hay = lista.size > 0;
      waBtn.href = hay ? AR.whatsapp.url(api.mensaje()) : '#';
      waBtn.setAttribute('aria-disabled', String(!hay));
      if (preview) preview.textContent = hay ? api.mensaje() : '';
    }

    const fila = ({ producto: p, cantidad: n }) => `
      <li class="ci" data-id="${p.id}">
        <div class="ci__media">${p.imagen ? `<img src="${esc(p.imagen)}" alt="" loading="lazy" decoding="async" width="72" height="54">` : AR.ilustracion(p.ilustracion)}</div>
        <div class="ci__body">
          <p class="ci__name">${esc(p.nombre)}</p>
          <p class="ci__meta"><span>${esc(textoPlazo(p))}</span><span>${p.valor ? `Valor informado: <b>${esc(p.valor)}</b>` : `<b>${esc(textoValor(p))}</b>`}</span></p>
          <div class="ci__row">
            <div class="qty" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
              <button type="button" class="qty__btn" data-q="-1" aria-label="${n === 1 ? 'Quitar de la consulta' : 'Restar uno'}">${n === 1 ? ICON_TRASH : '−'}</button>
              <span class="qty__n" aria-live="polite">${n}</span>
              <button type="button" class="qty__btn" data-q="1" aria-label="Sumar uno" ${n >= MAX ? 'disabled' : ''}>+</button>
            </div>
            <button type="button" class="ci__del" data-quitar>Quitar</button>
          </div>
        </div>
      </li>`;

    function pintarLista() {
      const its = api.items();
      listaEl.innerHTML = its.map(fila).join('');
      vacioEl.hidden = its.length > 0;
      pies.forEach((el) => { el.hidden = its.length === 0; });
      const u = api.unidades();
      resumenEl.textContent = its.length ? `${its.length} ${its.length === 1 ? 'producto' : 'productos'} · ${u} ${u === 1 ? 'unidad' : 'unidades'}` : '';
      pintarMensaje();
    }

    listaEl.addEventListener('click', (e) => {
      const li = e.target.closest('.ci'); if (!li) return;
      const id = li.dataset.id;
      const q = e.target.closest('[data-q]');
      if (q) { const d = +q.dataset.q; const n = api.cantidad(id) + d; if (n <= 0) salir(li, id); else api.fijar(id, n); return; }
      if (e.target.closest('[data-quitar]')) salir(li, id);
    });
    // la fila se pliega antes de irse
    function salir(li, id) {
      if (reduce()) return api.quitar(id);
      li.style.height = li.offsetHeight + 'px';
      li.classList.add('is-leaving');
      requestAnimationFrame(() => { li.style.height = '0px'; });
      setTimeout(() => api.quitar(id), 260);
    }

    $('[data-consulta-vaciar]', drawer)?.addEventListener('click', () => api.vaciar());
    $('[data-consulta-copiar]', drawer)?.addEventListener('click', async (e) => {
      try { await navigator.clipboard.writeText(api.mensaje()); api.avisar('Mensaje copiado'); }
      catch { api.avisar('No se pudo copiar: seleccioná el texto del mensaje'); }
      e.currentTarget.blur();
    });
    waBtn.addEventListener('click', (e) => { if (!lista.size) e.preventDefault(); });

    /* abrir y cerrar: <dialog> nativo (atrapa el foco, Escape cierra) con una entrada y salida suaves */
    api.abrir = () => {
      if (drawer.open) return;
      ultimoFoco = document.activeElement;
      pintarLista();
      drawer.showModal();
      drawer.classList.remove('is-closing');
      document.documentElement.classList.add('has-dialog');
    };
    api.cerrar = () => {
      if (!drawer.open) return;
      const fin = () => { drawer.classList.remove('is-closing'); drawer.close(); };
      if (reduce()) fin(); else { drawer.classList.add('is-closing'); setTimeout(fin, 220); }
    };
    drawer.addEventListener('close', () => {
      if (document.querySelector('dialog[open]')) return;
      document.documentElement.classList.remove('has-dialog');
      if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
    });
    drawer.addEventListener('cancel', (e) => { e.preventDefault(); api.cerrar(); });
    drawer.addEventListener('click', (e) => { if (e.target === drawer) api.cerrar(); });   // clic en el fondo
    $$('[data-consulta-cerrar]', drawer).forEach((b) => b.addEventListener('click', () => api.cerrar()));
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-consulta-abrir]');
      if (!b) return;
      e.preventDefault();
      // desde el detalle de un producto: primero se cierra el detalle y después se abre la lista
      if (document.getElementById('producto')?.open) { AR.producto?.cerrar(); setTimeout(() => api.abrir(), 230); }
      else api.abrir();
    });

    /* contadores: header, botón flotante y barra del teléfono */
    const contadores = $$('[data-consulta-cuenta]');
    const fab = $('.fab');
    function pintarContadores(detalle) {
      const n = api.distintos();
      contadores.forEach((c) => {
        c.textContent = n;
        c.closest('[data-consulta-abrir]')?.setAttribute('aria-label', n ? `Mi consulta: ${n} ${n === 1 ? 'producto' : 'productos'}` : 'Mi consulta: vacía');
        c.hidden = n === 0 && c.hasAttribute('data-ocultar-cero');
      });
      if (fab) fab.hidden = n === 0;
      document.documentElement.classList.toggle('has-consulta', n > 0);
      if (detalle && (detalle.tipo === 'nuevo' || detalle.tipo === 'suma') && !reduce()) {
        [...contadores, fab].filter(Boolean).forEach((el) => { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); });
      }
    }

    api.on((d) => {
      pintarContadores(d);
      if (drawer.open) pintarLista();
      if (d.tipo === 'nuevo' && !drawer.open && !document.getElementById('producto')?.open) {
        const p = porId.get(d.id);
        api.avisar(`Agregaste ${p.nombre}`, { texto: 'Ver mi consulta', fn: () => api.abrir() });
      }
    });
    pintarContadores();
  }

  /* ------------------------------------------------------------ aviso breve (con una acción opcional)
     El contenedor .toast está siempre en la página (role="status"), así los lectores de pantalla leen cada aviso. */
  let toastT;
  api.avisar = (texto, accion) => {
    const t = document.querySelector('.toast');
    if (!t) return;
    // con un panel abierto, el aviso se muestra dentro de él (si no, quedaría detrás del fondo oscuro)
    const host = document.querySelector('dialog[open]') || document.body;
    if (t.parentElement !== host) host.appendChild(t);
    t.querySelector('.toast__text').textContent = texto;
    const b = t.querySelector('.toast__action');
    b.hidden = !accion;
    if (accion) { b.textContent = accion.texto; b.onclick = () => { accion.fn(); ocultar(); }; }
    t.classList.remove('is-on'); void t.offsetWidth;
    t.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(ocultar, accion ? 5000 : 2600);
    // mientras el mouse o el foco están en el aviso, no se va
    t.onpointerenter = t.onfocusin = () => clearTimeout(toastT);
    t.onpointerleave = () => { clearTimeout(toastT); toastT = setTimeout(ocultar, 1800); };
    function ocultar() { t.classList.remove('is-on'); b.onclick = null; }
  };

  const ICON_TRASH = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
