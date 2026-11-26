/* AR Créditos: animaciones propias de la página.
   Con "reducir movimiento" / "quitar animaciones" del teléfono las animaciones siguen, en versión suave:
   sin rebotes, sin desplazamientos y la cinta más lenta (se pausa con un toque). */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = document.documentElement;
  html.classList.add('ar-anim');
  if (reduce) html.classList.add('ar-calm');

  /* 1. El calendario del hero: los días se van pagando de a uno y el plan vuelve a empezar */
  const cal = document.querySelector('[data-ar-cal]');
  if (cal) {
    const days = [...cal.children];
    const bar = document.querySelector('[data-ar-progress]');
    const paidLabel = document.querySelector('[data-ar-paid]');
    const TOTAL = days.length;           // 28
    let today = 5;                        // el día 5 es "hoy" al cargar
    let visible = true;

    const paint = () => {
      days.forEach((d, i) => {
        const n = i + 1;
        d.classList.toggle('cal__day--deliver', n === 1);
        d.classList.toggle('cal__day--paid', n > 1 && n < today);
        d.classList.toggle('cal__day--today', n === today);
        d.classList.remove('is-new');
      });
      const prev = days[today - 2];
      if (prev && today > 2) prev.classList.add('is-new');
      const paid = Math.max(0, Math.min(today - 2, TOTAL - 1));
      if (paidLabel) paidLabel.textContent = paid;
      if (bar) bar.style.transform = `scaleX(${paid / (TOTAL - 1)})`;
    };
    paint();

    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cal);

    setInterval(() => {
      if (!visible || document.hidden) return;
      today = today >= TOTAL + 1 ? 2 : today + 1;   // al terminar, nueva entrega y vuelve a arrancar
      if (today === 2) { cal.classList.add('is-reset'); setTimeout(() => cal.classList.remove('is-reset'), 400); }
      paint();
    }, 700);
  }

  /* cinta de rubros: se duplica el contenido para que el loop no tenga corte */
  document.querySelectorAll('.marquee__track').forEach((t) => {
    [...t.children].forEach((c) => t.appendChild(c.cloneNode(true)));
    // un toque (o clic) la pausa y otro la reanuda
    const band = t.parentElement;
    band.addEventListener('click', () => band.classList.toggle('is-paused'));
  });

  /* 2. Contador: el número cuenta desde 0 una vez, al cargar */
  document.querySelectorAll('[data-ar-count]').forEach((el) => {
    const to = +el.dataset.arCount;
    const dur = 1400;
    let t0;
    const step = (t) => {
      t0 ??= t;
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * eased).toLocaleString('es-AR');
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    setTimeout(() => requestAnimationFrame(step), 500);
    // respaldo: si el navegador no anima (pestaña en segundo plano), el número final queda igual
    setTimeout(() => { el.textContent = to.toLocaleString('es-AR'); }, 2500);
  });

  /* MAPA DE ZONAS: Leaflet con mapa de OpenStreetMap pasado a blanco y negro.
     Se carga recién cuando la sección se acerca a la pantalla, para no pesar en la carga inicial. */
  const mapEl = document.getElementById('mapa');
  const zonaBtns = [...document.querySelectorAll('.zona')];
  if (mapEl) {
    const loadLeaflet = () => new Promise((ok, fail) => {
      if (window.L) return ok();
      const sc = document.createElement('script');
      sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      sc.onload = ok; sc.onerror = fail;
      document.head.appendChild(sc);
    });

    const initMap = () => {
      const L = window.L;
      const map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17, className: 'map-bw',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const icon = (on) => L.divIcon({ className: 'pin' + (on ? ' pin--on' : ''), iconSize: on ? [18, 18] : [12, 12] });
      const markers = new Map();
      const gba = [];
      zonaBtns.forEach((b) => {
        if (b.dataset.bounds) return;
        const ll = [+b.dataset.lat, +b.dataset.lng];
        gba.push(ll);
        const m = L.marker(ll, { icon: icon(false), title: b.textContent, keyboard: false })
          .addTo(map)
          .bindTooltip(b.textContent, { direction: 'top', offset: [0, -8], className: 'pin-tip' });
        m.on('click', () => select(b));
        markers.set(b, m);
      });
      // Entre Ríos: un rectángulo sobre toda la provincia
      const prov = zonaBtns.find((b) => b.dataset.bounds);
      let provRect;
      if (prov) {
        const [s, w, n, e] = prov.dataset.bounds.split(',').map(Number);
        provRect = L.rectangle([[s, w], [n, e]], { color: '#141414', weight: 1, fillColor: '#141414', fillOpacity: 0.08, dashArray: '4 4' })
          .bindTooltip('Entre Ríos: toda la provincia', { sticky: true, className: 'pin-tip' });
      }

      const gbaBounds = L.latLngBounds(gba).pad(0.12);
      map.fitBounds(gbaBounds);

      let current;
      function select(b) {
        if (current) {
          current.classList.remove('is-on'); current.setAttribute('aria-pressed', 'false');
          const m = markers.get(current); if (m) { m.setIcon(icon(false)); m.closeTooltip(); }
        }
        if (provRect && map.hasLayer(provRect)) provRect.remove();
        if (current === b) { current = null; map.flyToBounds(gbaBounds, { duration: reduce ? 0 : 0.9 }); return; }
        current = b;
        b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true');
        if (b.dataset.bounds) {
          provRect.addTo(map);
          map.flyToBounds(provRect.getBounds(), { duration: reduce ? 0 : 1.2, padding: [20, 20] });
          provRect.openTooltip(provRect.getCenter());
        } else {
          const m = markers.get(b);
          m.setIcon(icon(true));
          map.flyTo(m.getLatLng(), 13, { duration: reduce ? 0 : 1 });
          m.openTooltip();
        }
      }
      zonaBtns.forEach((b) => {
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => select(b));
        b.addEventListener('mouseenter', () => { const m = markers.get(b); if (m && current !== b) m.setIcon(icon(true)); });
        b.addEventListener('mouseleave', () => { const m = markers.get(b); if (m && current !== b) m.setIcon(icon(false)); });
      });
    };

    const start = () => loadLeaflet().then(initMap).catch(() => mapEl.classList.add('is-failed'));
    if ('IntersectionObserver' in window) {
      const mo = new IntersectionObserver(([e]) => { if (e.isIntersecting) { mo.disconnect(); start(); } }, { rootMargin: '400px 0px' });
      mo.observe(mapEl);
    } else start();
  }

  /* 3. Aparición al entrar en pantalla, una sola vez, en cascada dentro de cada grupo */
  if ('IntersectionObserver' in window) {
    const groups = [
      'main > section:not(.hero) .section-head',
      '.ctabs > .ctab',
      '.ctools, .cstatus',
      '.ccta',
      '.vit__stage, .vit__side',
      '.promos__cta',
      '.promos__cats > li',
      '.cpage-links__list > li',
      '.plazos > li',
      '.ejemplos > li',
      '.perks > .perk',
      '.steps > li',
      '.req',
      '.zonas > li',
      '.zonas__label, .zonas__mapwrap, .zonas__ask',
      '.acc-group__h, .acc__item',
      '.closing__cta > *',
    ];
    const items = [];
    groups.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('ar-reveal');
        const delay = sel.includes('zonas > li') ? i * 30 : sel.includes('acc') ? i * 50 : i * 90;
        el.style.setProperty('--ar-delay', `${Math.min(delay, 700)}ms`);
        items.push(el);
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    items.forEach((el) => io.observe(el));
    // al imprimir se muestra todo
    window.addEventListener('beforeprint', () => items.forEach((el) => el.classList.add('is-in')));
  }

  /* 4. Línea de tiempo del proceso: la línea se va completando a medida que se recorre la sección */
  const tl = document.querySelector('[data-timeline]');
  if (tl && 'IntersectionObserver' in window) {
    const pasos = [...tl.children];
    const marcar = () => {
      const hechos = pasos.filter((li) => li.classList.contains('is-on')).length;
      tl.style.setProperty('--tl', String(hechos <= 1 ? 0 : (hechos - 1) / (pasos.length - 1)));
    };
    // la línea va del centro del primer número al centro del último
    const medir = () => {
      const nums = pasos.map((li) => li.querySelector('.step-num'));
      const t0 = tl.getBoundingClientRect().top;
      const c = (el) => { const r = el.getBoundingClientRect(); return r.top - t0 + r.height / 2; };
      tl.style.setProperty('--tl-top', c(nums[0]) + 'px');
      tl.style.setProperty('--tl-h', Math.max(0, c(nums[nums.length - 1]) - c(nums[0])) + 'px');
    };
    medir();
    addEventListener('resize', medir, { passive: true });
    document.fonts?.ready.then(medir);
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-on'); io.unobserve(e.target); } });
      marcar();
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0.6 });
    pasos.forEach((li) => io.observe(li));
    window.addEventListener('beforeprint', () => { pasos.forEach((li) => li.classList.add('is-on')); marcar(); });
  }

  /* 5. Preguntas frecuentes en acordeón: abre una por vez dentro de cada grupo, con altura animada.
     Son <details> nativos: sin script siguen funcionando (se abren y cierran solos). */
  document.querySelectorAll('[data-acc]').forEach((acc) => {
    const items = [...acc.querySelectorAll('details')];
    items.forEach((d) => {
      const sum = d.querySelector('summary');
      const body = d.querySelector('.acc__body');
      sum.addEventListener('click', (e) => {
        e.preventDefault();
        if (d.open) cerrar(d); else { items.filter((o) => o !== d && o.open).forEach(cerrar); abrir(d); }
      });
      function abrir(el) {
        el.open = true;
        if (reduce) return;
        const b = el.querySelector('.acc__body');
        b.animate([{ height: '0px', opacity: 0 }, { height: b.scrollHeight + 'px', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.2,.7,.2,1)' });
      }
      function cerrar(el) {
        const b = el.querySelector('.acc__body');
        if (reduce) { el.open = false; return; }
        const a = b.animate([{ height: b.scrollHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 220, easing: 'ease-in' });
        a.onfinish = () => { el.open = false; };
      }
      void body;
    });
  });
})();
