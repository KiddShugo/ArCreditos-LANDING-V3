/* AR Créditos · CONFIGURACIÓN GENERAL DEL SITIO
   ───────────────────────────────────────────────────────────────────────────────────────────────
   Todo lo que la empresa puede necesitar cambiar sin tocar el resto del código.

   ⚠ WHATSAPP: el número que recibe las consultas del catálogo se configura SOLO acá, en
   "whatsapp.numero", en formato internacional sin "+", espacios ni guiones
   (Argentina: 54 + 9 + código de área sin 0 + número sin 15; ej. 54 9 11 2535-7853 → '5491125357853').
   El valor actual es el mismo número que ya usaba la landing en sus botones. Confirmar que sea el que
   debe recibir las consultas del catálogo. Si se deja vacío (''), el enlace abre WhatsApp para que la
   persona elija el contacto, y la consola del navegador muestra un aviso.

   Los botones de WhatsApp escritos en el HTML (hero, pie, zonas) llevan data-wa: el script les arma el
   enlace con este mismo número, así el número vive en un único lugar. */
(function () {
  const AR = (window.AR = window.AR || {});

  AR.config = {
    whatsapp: {
      numero: '5491125357853',
      // Mensaje de los botones generales de WhatsApp (sin productos elegidos)
      mensajeGeneral: 'Hola, quisiera recibir asesoramiento sobre un plan de pago diario.',
    },

    // Textos del mensaje que se arma con la lista de consulta (assets/js/consulta.js)
    mensaje: {
      saludoVarios: 'Hola, quisiera recibir asesoramiento sobre los siguientes productos:',
      saludoUno: 'Hola, quisiera recibir asesoramiento sobre el siguiente producto:',
      cierre: 'Quisiera conocer más información, disponibilidad y condiciones.',
      despedida: '¡Muchas gracias!',
    },

    // Cómo se muestran los datos que faltan en un producto
    textos: {
      sinValor: 'Consultar valor',
      sinPlazo: 'Plazo a consultar',
    },

    // Catálogo: cuántas tarjetas se muestran al principio y con cada "Ver más"
    catalogo: { porPagina: 12 },

    // Clave con la que se guarda la lista de consulta en el navegador del visitante
    almacenamiento: 'ar-consulta-v1',
  };
})();
