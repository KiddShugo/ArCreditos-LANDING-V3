/* AR Créditos · lógica del catálogo (sin DOM): búsqueda, filtros, orden y textos de cada producto.
   Lee los datos de AR.catalogo (assets/data/productos.js) y los textos de AR.config. */
(function () {
  const AR = (window.AR = window.AR || {});
  const { categorias, tipos, productos } = AR.catalogo;
  const T = AR.config.textos;

  const porId = new Map(productos.map((p) => [p.id, p]));
  const catPorId = new Map(categorias.map((c) => [c.id, c]));
  const tipoPorId = new Map(tipos.map((t) => [t.id, t]));

  /* texto sin tildes y en minúsculas, para buscar "balanza" o "ELECTRICA" sin importar cómo se escriba */
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  /* el texto en el que busca cada producto: nombre, marca, modelo, tipo y categoría */
  const indice = new Map(productos.map((p) => [p.id, norm([p.nombre, p.marca, p.modelo, tipoPorId.get(p.tipo)?.nombre, catPorId.get(p.categoria)?.nombre].join(' '))]));

  /* El valor se guarda como fue informado ("23.800"). Solo es comparable (para ordenar) cuando tiene
     forma de número con puntos de miles; "17.00" u otro formato dudoso queda fuera del orden por valor. */
  function valorNumero(p) {
    if (!p.valor) return null;
    const v = String(p.valor).trim();
    if (/^\d{1,3}(\.\d{3})+$/.test(v) || /^\d+$/.test(v)) return Number(v.replace(/\./g, ''));
    return null;
  }

  const textoValor = (p) => p.valor || T.sinValor;
  const textoPlazo = (p) => (p.plazo ? `${p.plazo} días` : p.plazoNota || T.sinPlazo);
  const marcaModelo = (p) => [p.marca, p.modelo && p.modelo !== p.marca ? p.modelo : null].filter(Boolean).join(' · ');

  /* estado: { categoria, tipo, q, orden }  (todos opcionales) */
  function filtrar(estado = {}) {
    const palabras = norm(estado.q).split(/\s+/).filter(Boolean);
    let lista = productos.filter((p) =>
      (!estado.categoria || p.categoria === estado.categoria) &&
      (!estado.tipo || p.tipo === estado.tipo) &&
      palabras.every((w) => indice.get(p.id).includes(w)));
    return ordenar(lista, estado.orden);
  }

  function ordenar(lista, orden) {
    const base = lista.map((p, i) => ({ p, i }));
    const sinValorAlFinal = (a, b, dir) => {
      const va = valorNumero(a.p), vb = valorNumero(b.p);
      if (va == null && vb == null) return a.i - b.i;
      if (va == null) return 1;
      if (vb == null) return -1;
      return dir * (va - vb) || a.i - b.i;
    };
    if (orden === 'valor-asc') base.sort((a, b) => sinValorAlFinal(a, b, 1));
    else if (orden === 'valor-desc') base.sort((a, b) => sinValorAlFinal(a, b, -1));
    else if (orden === 'nombre') base.sort((a, b) => a.p.nombre.localeCompare(b.p.nombre, 'es') || a.i - b.i);
    return base.map((x) => x.p);
  }

  const tiposDe = (categoria) => tipos.filter((t) => !categoria || t.categoria === categoria);
  const cuenta = (filtro) => productos.filter(filtro).length;

  /* datos pendientes de confirmar (para revisar desde la consola: AR.cat.pendientes()) */
  const pendientes = () => productos.filter((p) => p.revisar || !p.valor || !p.plazo)
    .map((p) => ({ id: p.id, nombre: p.nombre, valor: p.valor, plazo: p.plazo, nota: p.revisar || '' }));

  /* escapar texto antes de ponerlo en HTML */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  AR.cat = { categorias, tipos, productos, porId, catPorId, tipoPorId, norm, valorNumero, textoValor, textoPlazo, marcaModelo, filtrar, ordenar, tiposDe, cuenta, pendientes, esc };
})();
