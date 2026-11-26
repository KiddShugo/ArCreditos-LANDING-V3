/* AR Créditos · WHATSAPP: el único lugar que arma enlaces y mensajes de WhatsApp.
   El número sale de AR.config.whatsapp.numero (assets/js/config.js). */
(function () {
  const AR = (window.AR = window.AR || {});
  const cfg = AR.config;
  const numero = String(cfg.whatsapp.numero || '').replace(/\D/g, '');
  if (!numero) console.warn('AR Créditos: falta configurar el número de WhatsApp en assets/js/config.js (AR.config.whatsapp.numero).');

  /* enlace wa.me con el texto ya escrito */
  const url = (texto) => `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

  /* un bloque del mensaje por producto, como en el ejemplo pedido:
       1. Heladera Exhibidora MT17 Inelro
          Plazo: 150 días
          Valor informado: 23.800
          Cantidad: 1                                                                   */
  function bloque(p, cantidad, n) {
    const plazo = p.plazo ? `${p.plazo} días` : (p.plazoNota ? p.plazoNota : 'a consultar');
    const valor = p.valor ? p.valor : 'a consultar';
    return [`${n}. ${p.nombre}`, `   Plazo: ${plazo}`, `   Valor informado: ${valor}`, `   Cantidad: ${cantidad}`].join('\n');
  }

  /* items: [{ producto, cantidad }]; datos: { nombre, localidad } opcionales del visitante */
  function mensajeLista(items, datos = {}) {
    const m = cfg.mensaje;
    const partes = [items.length === 1 ? m.saludoUno : m.saludoVarios, ''];
    items.forEach((it, i) => { partes.push(bloque(it.producto, it.cantidad, i + 1), ''); });
    partes.push(m.cierre);
    const quien = [datos.nombre && `Mi nombre es ${datos.nombre.trim()}`, datos.localidad && `soy de ${datos.localidad.trim()}`].filter(Boolean);
    if (quien.length) partes.push(quien.join(' y ') + '.');
    partes.push('', m.despedida);
    return partes.join('\n');
  }

  const mensajeProducto = (p, cantidad = 1) => mensajeLista([{ producto: p, cantidad }]);

  /* los enlaces escritos en el HTML con data-wa toman el número de la configuración;
     data-wa="texto" usa ese texto, data-wa vacío usa el mensaje general */
  function enlazar(root = document) {
    root.querySelectorAll('a[data-wa]').forEach((a) => {
      a.href = url(a.dataset.wa || cfg.whatsapp.mensajeGeneral);
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => enlazar(), { once: true });
  else enlazar();

  AR.whatsapp = { numero, url, mensajeLista, mensajeProducto, enlazar };
})();
