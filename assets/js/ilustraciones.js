/* AR Créditos · ilustraciones de referencia por TIPO de producto.
   Se muestran mientras un producto no tiene foto propia (campo "imagen" en assets/data/productos.js).
   No representan el modelo exacto: son un dibujo de línea del tipo de producto, en el blanco y negro
   de la marca. Lienzo de 120 x 90; clases: t = relleno suave, k = relleno medio, s = relleno sólido,
   l = línea fina. */
(function () {
  const AR = (window.AR = window.AR || {});

  const I = {
    /* ---------------- equipamiento comercial ---------------- */
    exhibidora: `<rect class="t" x="38" y="6" width="44" height="76" rx="2"/><rect class="s" x="38" y="6" width="44" height="11" rx="2"/>
      <rect x="43" y="21" width="34" height="56" rx="1"/><path class="l" d="M43 35h34M43 49h34M43 63h34"/>
      <path class="l" d="M47 34v-7h4v7M54 34v-8h4v8M61 34v-7h4v7M47 48v-8h4v8M54 48v-6h4v6M61 48v-8h4v8M68 48v-7h4v7M47 62v-6h4v6M54 62v-8h4v8M61 62v-7h4v7"/>
      <path d="M74 42v14" stroke-width="2.6"/><path d="M42 82v3M78 82v3"/>`,
    freezer: `<rect class="t" x="18" y="42" width="84" height="38" rx="3"/><rect class="t" x="16" y="33" width="88" height="10" rx="2"/>
      <rect class="s" x="51" y="44" width="18" height="4" rx="2"/><path class="l" d="M84 68h12M84 72h12M84 76h12"/>
      <circle cx="26" cy="82" r="3"/><circle cx="94" cy="82" r="3"/>`,
    'freezer-vidrio': `<rect class="t" x="18" y="44" width="84" height="36" rx="3"/><rect class="t" x="16" y="30" width="88" height="14" rx="2"/>
      <rect class="l" x="22" y="33" width="76" height="8" rx="1"/><path class="l" d="M32 40l6-6M40 40l6-6M74 40l6-6"/>
      <rect class="s" x="51" y="46" width="18" height="4" rx="2"/><path class="l" d="M84 70h12M84 74h12"/>
      <circle cx="26" cy="82" r="3"/><circle cx="94" cy="82" r="3"/>`,
    vitrina: `<rect class="t" x="8" y="48" width="104" height="32" rx="2"/><path class="t" d="M14 48C14 33 21 25 34 24H110V48Z"/>
      <path class="l" d="M22 40h86"/><rect class="l" x="28" y="34" width="18" height="6" rx="1"/><rect class="l" x="52" y="34" width="18" height="6" rx="1"/><rect class="l" x="76" y="34" width="18" height="6" rx="1"/>
      <path class="l" d="M24 30q4-3 9-3"/><path class="l" d="M16 66h22M16 71h22"/><path d="M14 80v4M106 80v4"/>`,
    tortera: `<rect class="t" x="34" y="62" width="52" height="20" rx="2"/><rect x="36" y="14" width="48" height="48" rx="1"/>
      <rect class="s" x="34" y="8" width="52" height="7" rx="2"/><path class="l" d="M36 30h48M36 46h48"/>
      <rect class="t" x="44" y="22" width="14" height="8" rx="1"/><rect class="t" x="62" y="24" width="12" height="6" rx="1"/>
      <rect class="t" x="46" y="38" width="22" height="8" rx="1"/><rect class="t" x="50" y="34" width="14" height="4" rx="1"/>
      <rect class="t" x="48" y="54" width="24" height="8" rx="1"/><path class="l" d="M78 20l-5 8"/><path class="l" d="M42 70h16"/><path d="M38 82v3M82 82v3"/>`,
    balanza: `<rect class="t" x="20" y="64" width="80" height="18" rx="3"/><rect class="t" x="24" y="57" width="54" height="7" rx="1"/>
      <path d="M86 57V32"/><rect class="t" x="72" y="14" width="30" height="18" rx="2"/><rect class="s" x="76" y="18" width="22" height="7" rx="1"/>
      <rect class="s" x="28" y="69" width="24" height="7" rx="1"/><path class="l" d="M60 72h4M68 72h4M76 72h4M84 72h4"/>`,
    'balanza-ticket': `<rect class="t" x="20" y="64" width="80" height="18" rx="3"/><rect class="t" x="24" y="57" width="54" height="7" rx="1"/>
      <path d="M86 57V36"/><rect class="t" x="70" y="18" width="32" height="18" rx="2"/><rect class="s" x="74" y="22" width="16" height="7" rx="1"/>
      <path class="t" d="M93 18V6h8v12"/><path class="l" d="M95 10h4M95 13h4"/>
      <rect class="s" x="28" y="69" width="24" height="7" rx="1"/><path class="l" d="M60 72h4M68 72h4M76 72h4M84 72h4"/>`,
    cortadora: `<rect class="t" x="16" y="66" width="88" height="16" rx="3"/><circle class="t" cx="46" cy="42" r="24"/><circle cx="46" cy="42" r="17"/>
      <circle class="s" cx="46" cy="42" r="4"/><path class="t" d="M68 62l32-9 3 8-31 9z"/><path d="M95 54V40"/><circle cx="95" cy="37" r="3"/>
      <circle class="l" cx="28" cy="74" r="3"/>`,
    panchera: `<rect class="t" x="28" y="26" width="64" height="56" rx="3"/><rect class="s" x="26" y="20" width="68" height="7" rx="2"/>
      <rect x="34" y="32" width="52" height="28" rx="1"/><rect class="t" x="40" y="39" width="22" height="5" rx="2.5"/><rect class="t" x="52" y="47" width="24" height="5" rx="2.5"/>
      <rect class="t" x="42" y="53" width="20" height="4" rx="2"/><rect x="34" y="65" width="52" height="11" rx="1"/><path d="M53 70h14"/>
      <path class="l" d="M46 16q3-4 0-8M60 16q3-4 0-8M74 16q3-4 0-8"/><path d="M34 82v3M86 82v3"/>`,
    caramelera: `<path class="t" d="M44 30h32v4q10 6 10 18v24q0 6-6 6H40q-6 0-6-6V52q0-12 10-18z"/><rect class="s" x="40" y="22" width="40" height="8" rx="2"/>
      <rect x="55" y="15" width="10" height="7" rx="2"/><circle class="l" cx="48" cy="66" r="5"/><circle class="l" cx="60" cy="72" r="5"/><circle class="l" cx="72" cy="64" r="5"/>
      <circle class="l" cx="54" cy="56" r="4"/><circle class="l" cx="68" cy="52" r="4"/><circle class="l" cx="44" cy="76" r="3"/><path class="l" d="M78 46q2 6 2 12"/>`,
    plancha: `<rect class="t" x="20" y="58" width="80" height="22" rx="3"/><path class="t" d="M24 56h72l-5-12H29z"/><path class="l" d="M33 50h54"/>
      <rect class="s" x="46" y="35" width="28" height="5" rx="2.5"/><path d="M52 40v4M68 40v4"/><circle cx="32" cy="69" r="4"/><circle class="s" cx="88" cy="69" r="2"/>
      <path d="M26 80v4M94 80v4"/>`,
    'horno-pizzero': `<rect class="t" x="22" y="16" width="76" height="42" rx="3"/><rect x="30" y="27" width="46" height="24" rx="2"/>
      <rect class="s" x="36" y="21" width="34" height="3" rx="1.5"/><ellipse class="l" cx="53" cy="44" rx="16" ry="3"/>
      <circle cx="88" cy="29" r="4"/><circle cx="88" cy="44" r="4"/><path d="M28 58v26M92 58v26"/><path class="l" d="M28 74h64"/>`,
    freidora: `<rect class="t" x="26" y="38" width="68" height="44" rx="2"/><rect class="s" x="24" y="32" width="72" height="6" rx="1"/>
      <rect class="l" x="32" y="24" width="22" height="8" rx="1"/><rect class="l" x="66" y="24" width="22" height="8" rx="1"/>
      <path d="M43 24l-3-12h-5M77 24l3-12h5"/><circle cx="40" cy="50" r="4"/><circle cx="80" cy="50" r="4"/>
      <rect class="l" x="32" y="60" width="56" height="16" rx="1"/><path d="M30 82v3M90 82v3"/>`,
    'horno-convector': `<rect class="t" x="18" y="16" width="84" height="60" rx="3"/><rect x="24" y="22" width="56" height="48" rx="2"/>
      <path class="l" d="M28 34h48M28 46h48M28 58h48"/><rect class="s" x="76" y="34" width="3" height="24" rx="1.5"/>
      <rect class="l" x="84" y="22" width="12" height="48" rx="1"/><circle cx="90" cy="32" r="3"/><circle cx="90" cy="45" r="3"/><rect class="s" x="86" y="56" width="8" height="4"/>
      <path d="M24 76v8M96 76v8"/>`,
    amasadora: `<rect class="t" x="72" y="24" width="18" height="58" rx="3"/><rect class="t" x="30" y="14" width="60" height="18" rx="6"/>
      <path class="t" d="M30 52h40l-4 24q-1 4-5 4H39q-4 0-5-4z"/><path d="M27 52h46"/><path d="M50 32v10q0 6 4 8q5 2 2 9"/>
      <rect class="s" x="24" y="80" width="72" height="4" rx="2"/><circle cx="81" cy="40" r="3"/>`,
    sobadora: `<rect class="t" x="46" y="28" width="28" height="36" rx="3"/><circle cx="60" cy="46" r="5"/><path d="M60 28V18h10"/><circle cx="73" cy="18" r="3"/>
      <rect class="t" x="8" y="56" width="38" height="6" rx="1"/><rect class="t" x="74" y="56" width="38" height="6" rx="1"/>
      <path class="l" d="M12 54h28M80 54h20"/><rect class="t" x="40" y="64" width="40" height="18" rx="2"/><path d="M44 82v3M76 82v3"/>`,
    ralladora: `<rect class="t" x="38" y="36" width="44" height="44" rx="4"/><path class="t" d="M42 36l-6-20h48l-6 20"/>
      <rect class="l" x="46" y="62" width="28" height="10" rx="1"/><path d="M54 67h12"/><circle cx="72" cy="47" r="3"/><path class="l" d="M46 45h14M46 49h14"/>
      <path d="M42 80v4M78 80v4"/>`,
    gaveta: `<rect class="t" x="12" y="44" width="96" height="32" rx="3"/><path d="M12 50h96"/>
      <rect class="l" x="17" y="54" width="14" height="17" rx="2"/><rect class="l" x="35" y="54" width="14" height="17" rx="2"/><rect class="l" x="53" y="54" width="14" height="17" rx="2"/>
      <rect class="l" x="71" y="54" width="14" height="17" rx="2"/><rect class="l" x="89" y="54" width="14" height="17" rx="2"/><path d="M18 76v6M102 76v6"/>`,
    licuadora: `<path class="t" d="M44 16h32l-4 44H48z"/><rect class="s" x="42" y="10" width="36" height="6" rx="2"/>
      <path d="M75 22h7q4 0 4 4v16q0 4-4 4h-8"/><path class="l" d="M50 26h6M50 34h6M50 42h6"/><path class="l" d="M54 55l6-3 6 3"/>
      <path class="t" d="M42 60h36l4 22H38z"/><circle cx="60" cy="71" r="4"/>`,
    picadora: `<rect class="t" x="48" y="40" width="48" height="36" rx="4"/><path class="t" d="M40 22h56l-6 6H46z"/><rect class="t" x="58" y="28" width="14" height="12"/>
      <rect class="t" x="22" y="44" width="26" height="16" rx="2"/><rect class="s" x="16" y="42" width="6" height="20" rx="2"/>
      <circle cx="84" cy="56" r="3"/><path class="l" d="M56 66h20"/><rect class="s" x="44" y="76" width="56" height="6" rx="2"/>`,
    'cortadora-papas': `<rect class="t" x="24" y="72" width="72" height="8" rx="2"/><rect class="t" x="30" y="20" width="8" height="52"/>
      <path d="M34 24l58 12" stroke-width="3"/><path d="M88 35l14 3" stroke-width="5"/>
      <rect class="t" x="56" y="38" width="20" height="10"/><path class="l" d="M60 38v10M64 38v10M68 38v10M72 38v10"/>
      <rect class="l" x="54" y="60" width="24" height="12"/><ellipse class="t" cx="66" cy="55" rx="9" ry="5"/><path d="M28 80v4M92 80v4"/>`,
    mesa: `<rect class="t" x="12" y="28" width="96" height="10" rx="1"/><rect class="t" x="12" y="38" width="96" height="6" rx="1"/>
      <path d="M18 44v40M102 44v40"/><path class="l" d="M28 44v36M92 44v36"/><rect class="t" x="16" y="66" width="88" height="4" rx="1"/>`,
    mesada: `<rect class="t" x="10" y="26" width="100" height="8" rx="1"/><rect class="t" x="10" y="34" width="100" height="6" rx="1"/>
      <rect class="t" x="62" y="40" width="34" height="16" rx="2"/><path d="M79 26V16q0-4-4-4h-6v4"/>
      <path d="M14 40v44M106 40v44"/><rect class="t" x="14" y="62" width="92" height="3"/><rect class="t" x="14" y="74" width="92" height="3"/>`,
    generador: `<rect x="18" y="30" width="84" height="50" rx="6"/><rect class="t" x="30" y="23" width="46" height="14" rx="5"/><circle class="s" cx="66" cy="23" r="3"/>
      <rect class="t" x="28" y="44" width="34" height="28" rx="3"/><path class="l" d="M32 50h26M32 56h26M32 62h26"/>
      <rect class="t" x="68" y="46" width="28" height="22" rx="2"/><circle cx="76" cy="58" r="3"/><circle cx="88" cy="58" r="3"/><path d="M24 80v4M96 80v4"/>`,
    compresor: `<rect class="t" x="14" y="50" width="88" height="26" rx="13"/><rect class="t" x="30" y="30" width="36" height="20" rx="3"/>
      <path class="l" d="M34 36h28M34 42h28"/><circle cx="82" cy="38" r="6"/><path d="M82 44v6"/><path class="l" d="M82 38l3-3"/>
      <circle cx="24" cy="79" r="5"/><path d="M92 76v8"/><path class="l" d="M102 60q8 0 8 10"/>`,
    motosierra: `<g transform="translate(0 14)"><path class="t" d="M42 40h28q8 0 8 8v14q0 6-6 6H40q-6 0-6-6V48q0-8 8-8z"/>
      <path d="M78 46q16 0 16 12q0 10-12 10h-4"/><path d="M44 40q0-14 14-14q10 0 12 10"/>
      <path class="t" d="M34 49H8q-6 0-6 7t6 7h26"/><path class="l" d="M8 49h24M8 63h24" stroke-dasharray="2 3"/><path class="l" d="M94 62q8 6 2 10"/></g>`,
    bordeadora: `<path d="M32 78L94 16" stroke-width="3"/><rect class="t" x="86" y="6" width="20" height="13" rx="4" transform="rotate(-45 96 13)"/>
      <path d="M56 46l14 14M54 56l10-10" stroke-width="2.4"/><path class="t" d="M18 80q8-16 28-8"/><circle class="s" cx="30" cy="80" r="4"/><path class="l" d="M26 83H14M34 83h12"/>`,

    /* ---------------- hogar ---------------- */
    cocina: `<rect class="t" x="28" y="26" width="64" height="56" rx="2"/><path class="t" d="M30 26h60l-6-10H36z"/>
      <ellipse class="l" cx="48" cy="21" rx="7" ry="2.5"/><ellipse class="l" cx="72" cy="21" rx="7" ry="2.5"/>
      <circle cx="38" cy="32" r="2.2"/><circle cx="49" cy="32" r="2.2"/><circle cx="60" cy="32" r="2.2"/><circle cx="71" cy="32" r="2.2"/><circle cx="82" cy="32" r="2.2"/>
      <rect x="34" y="39" width="52" height="36" rx="2"/><path d="M40 44h40"/><rect class="l" x="40" y="50" width="40" height="19" rx="1"/><path d="M32 82v3M88 82v3"/>`,
    'aire-split': `<rect class="t" x="14" y="20" width="92" height="28" rx="8"/><path d="M22 41h76"/><path class="l" d="M30 45h60"/><circle class="s" cx="92" cy="29" r="2"/>
      <path class="l" d="M32 56q6 4 0 8t0 8M60 56q6 4 0 8t0 8M88 56q6 4 0 8t0 8"/>`,
    'aire-ventana': `<rect class="t" x="24" y="20" width="72" height="56" rx="3"/><rect x="30" y="26" width="40" height="44" rx="2"/>
      <path class="l" d="M34 32h32M34 38h32M34 44h32M34 50h32M34 56h32M34 62h32"/><rect class="l" x="74" y="26" width="16" height="44" rx="1"/>
      <circle cx="82" cy="36" r="3"/><circle cx="82" cy="48" r="3"/><path d="M30 76v6M90 76v6"/>`,
    'aire-portatil': `<rect class="t" x="36" y="12" width="40" height="68" rx="6"/><rect class="s" x="42" y="17" width="28" height="6" rx="2"/>
      <path class="l" d="M44 30h24M44 35h24M44 40h24M44 45h24"/><rect class="l" x="44" y="54" width="24" height="16" rx="2"/>
      <path d="M76 40h8q12 0 12-12V12" stroke-width="3"/><circle cx="44" cy="82" r="3"/><circle cx="68" cy="82" r="3"/>`,
    frigobar: `<rect class="t" x="36" y="30" width="48" height="52" rx="3"/><path class="l" d="M36 42h48"/><path d="M78 49v18" stroke-width="2.6"/>
      <path d="M40 82v3M80 82v3"/>`,
    heladera: `<rect class="t" x="38" y="6" width="44" height="76" rx="3"/><path d="M38 30h44"/><path d="M76 14v10M76 38v18" stroke-width="2.6"/>
      <path d="M42 82v3M78 82v3"/>`,
    lavarropas: `<rect class="t" x="32" y="16" width="56" height="66" rx="3"/><path d="M32 28h56"/><rect class="l" x="37" y="20" width="14" height="5" rx="1"/>
      <rect class="s" x="57" y="20" width="10" height="4"/><circle cx="77" cy="22" r="3"/><circle cx="60" cy="54" r="19"/><circle class="t" cx="60" cy="54" r="13"/>
      <path class="l" d="M52 46q4-4 10-4"/><path d="M36 82v3M84 82v3"/>`,
    secarropas: `<rect class="t" x="36" y="24" width="48" height="58" rx="4"/><rect class="s" x="34" y="16" width="52" height="8" rx="2"/>
      <rect class="l" x="42" y="30" width="36" height="8" rx="1"/><circle cx="72" cy="34" r="2.5"/><path class="l" d="M48 70h24"/><path d="M40 82v3M80 82v3"/>`,
    termotanque: `<rect class="t" x="40" y="16" width="40" height="62" rx="12"/><path d="M52 16V6h-6M68 16V6h6"/>
      <rect class="l" x="50" y="44" width="20" height="14" rx="2"/><circle cx="60" cy="51" r="3"/><path d="M46 78v6M74 78v6"/>`,
    tv: `<rect class="t" x="12" y="10" width="96" height="58" rx="2"/><rect class="k" x="16" y="14" width="88" height="50"/><path class="l" d="M78 18L62 60"/>
      <path class="t" d="M54 68h12l4 14H50z"/><path d="M44 84h32"/>`,
    pava: `<path class="t" d="M38 34h40l6 42q0 6-6 6H38q-6 0-6-6z"/><path d="M44 34q14-8 28 0"/><rect class="s" x="56" y="24" width="8" height="4" rx="2"/>
      <path d="M80 38q14 2 14 18q0 10-8 14" stroke-width="2.6"/><path class="t" d="M36 42l-12-10-2 6 10 12"/><path class="l" d="M50 50v20"/>
      <rect class="s" x="28" y="82" width="60" height="3" rx="1.5"/>`,
    batidora: `<g transform="translate(0 8)"><path class="t" d="M28 30q0-12 14-12h40q10 0 10 10v8q0 8-10 8H40q-12 0-12-14z"/>
      <path d="M46 18q6-10 16-10h14q8 0 8 8v4"/><circle cx="78" cy="28" r="3"/><path d="M48 44v22M62 44v22"/>
      <path d="M44 66q4 12 8 0M58 66q4 12 8 0"/></g>`,
    'horno-electrico': `<rect class="t" x="16" y="22" width="88" height="54" rx="4"/><rect x="22" y="30" width="58" height="38" rx="3"/>
      <rect class="s" x="26" y="25" width="50" height="3" rx="1.5"/><path class="l" d="M26 50h50"/><circle cx="92" cy="34" r="4"/><circle cx="92" cy="48" r="4"/><circle cx="92" cy="62" r="4"/>
      <path d="M22 76v6M98 76v6"/>`,
    microondas: `<rect class="t" x="14" y="24" width="92" height="52" rx="4"/><rect class="k" x="22" y="32" width="54" height="36" rx="2"/>
      <rect class="s" x="86" y="32" width="14" height="6" rx="1"/><circle class="s" cx="89" cy="46" r="1.8"/><circle class="s" cx="97" cy="46" r="1.8"/>
      <circle class="s" cx="89" cy="54" r="1.8"/><circle class="s" cx="97" cy="54" r="1.8"/><circle class="s" cx="89" cy="62" r="1.8"/><circle class="s" cx="97" cy="62" r="1.8"/>
      <path d="M20 76v4M100 76v4"/>`,
    sandwichera: `<path class="t" d="M24 62q0-6 6-6h60q6 0 6 6v10q0 6-6 6H30q-6 0-6-6z"/><path class="t" d="M26 54q2-18 34-18t34 18z"/>
      <rect class="s" x="90" y="46" width="18" height="6" rx="3"/><path d="M95 52v8"/><circle class="s" cx="38" cy="67" r="2"/><path d="M34 78v4M86 78v4"/>`,
    tostadora: `<rect class="t" x="26" y="38" width="68" height="40" rx="12"/><path class="t" d="M38 38V22q0-4 4-4h12q4 0 4 4v16M64 38V22q0-4 4-4h12q4 0 4 4v16"/>
      <rect class="s" x="35" y="36" width="26" height="4" rx="2"/><rect class="s" x="61" y="36" width="26" height="4" rx="2"/>
      <circle cx="48" cy="58" r="4"/><rect class="s" x="94" y="50" width="6" height="10" rx="2"/><path d="M34 78v4M86 78v4"/>`,
    cafetera: `<rect class="t" x="40" y="12" width="40" height="70" rx="6"/><rect class="s" x="40" y="12" width="40" height="18" rx="6"/>
      <rect x="46" y="34" width="28" height="38" rx="2"/><rect class="s" x="56" y="34" width="8" height="6" rx="1"/>
      <path class="t" d="M52 56h16v10q0 4-4 4h-8q-4 0-4-4z"/><path d="M68 59q4 0 4 3t-4 3"/><rect class="s" x="44" y="74" width="32" height="5" rx="1"/>`,
    ollas: `<path class="t" d="M30 46h60v26q0 10-10 10H40q-10 0-10-10z"/><path d="M26 46h68"/><path class="t" d="M30 44q30-18 60 0"/>
      <rect class="s" x="55" y="29" width="10" height="6" rx="3"/><path d="M30 54h-10v-6h10M90 54h10v-6H90"/>`,
    'freidora-aire': `<path class="t" d="M36 20q0-8 8-8h32q8 0 8 8v54q0 8-8 8H44q-8 0-8-8z"/><rect class="s" x="48" y="18" width="24" height="10" rx="3"/>
      <path class="l" d="M50 35h20"/><rect x="40" y="44" width="40" height="30" rx="4"/><rect class="s" x="52" y="54" width="16" height="10" rx="3"/>
      <path d="M44 82v3M76 82v3"/>`,
    pileta: `<ellipse class="t" cx="60" cy="40" rx="48" ry="12"/><ellipse class="l" cx="60" cy="42" rx="42" ry="8"/>
      <path d="M12 40v34M108 40v34M12 74q48 20 96 0"/><path class="l" d="M30 50v30M60 52v32M90 50v30"/><path class="l" d="M44 41q4-2 8 0t8 0"/>`,
    sombrilla: `<path class="t" d="M14 38Q60 2 106 38q-11.5-6-23 0q-11.5-6-23 0q-11.5-6-23 0q-11.5-6-23 0z"/>
      <path class="l" d="M60 12L37 38M60 12L83 38M60 12v26"/><path d="M60 12v72M60 12V8"/><path d="M52 84h16" stroke-width="3"/>`,
    tender: `<path d="M14 40l20-10h52l20 10"/><path class="l" d="M20 37l18-9M26 34l16-7M100 37l-18-9M94 34l-16-7M34 30h52"/>
      <path d="M36 30l38 54M84 30L46 84"/><path class="t" d="M50 30v22h14V30"/>`,
    hidrolavadora: `<rect class="t" x="48" y="30" width="34" height="46" rx="8"/><path d="M78 30V12H66"/><circle cx="58" cy="78" r="6"/>
      <circle class="l" cx="65" cy="46" r="6"/><rect class="s" x="18" y="48" width="14" height="6" rx="2"/><path d="M18 51H4M28 54l-2 8"/>
      <path class="l" d="M26 62q10 10 22-2"/>`,
    aspiradora: `<rect class="t" x="50" y="36" width="40" height="44" rx="6"/><rect class="s" x="48" y="30" width="44" height="8" rx="3"/>
      <path d="M62 30v-6h16v6"/><path d="M50 50q-20 0-24 14t-12 14" stroke-width="3"/><rect class="s" x="6" y="78" width="20" height="5" rx="2"/>
      <circle cx="56" cy="83" r="2"/><circle cx="84" cy="83" r="2"/>`,

    /* ---------------- uso personal ---------------- */
    celular: `<rect class="t" x="44" y="8" width="32" height="74" rx="6"/><rect class="k" x="47" y="12" width="26" height="66" rx="4"/>
      <rect class="s" x="55" y="15" width="10" height="3" rx="1.5"/><path class="l" d="M76 26v8M44 24v6M44 34v8"/>`,
    notebook: `<rect class="t" x="26" y="14" width="68" height="46" rx="3"/><rect class="k" x="30" y="18" width="60" height="38"/>
      <path class="t" d="M14 62h92l-4 8q-1 2-3 2H21q-2 0-3-2z"/><path class="l" d="M52 66h16"/>`,
    secador: `<rect class="t" x="12" y="32" width="12" height="16" rx="2"/><rect class="t" x="24" y="26" width="56" height="28" rx="14"/>
      <path class="l" d="M72 31v18"/><path class="t" d="M56 54l-6 26q0 3 3 3h8q3 0 3-3l2-26"/><path d="M58 62v6"/><path class="l" d="M58 83q10-2 16-10"/>`,
    planchita: `<path class="t" d="M54 80L42 18q-1-6 5-6t6 5l9 61z"/><path class="t" d="M58 78l12-60q1-5 6-4t4 6L66 80z"/>
      <path d="M46 22l4 26M74 22l-4 26" stroke-width="3"/><circle class="s" cx="60" cy="80" r="4"/><path class="l" d="M60 84q6 2 14 0"/>`,
    afeitadora: `<path class="t" d="M44 30h32v46q0 8-8 8H52q-8 0-8-8z"/><rect class="t" x="40" y="12" width="40" height="18" rx="5"/>
      <rect class="k" x="44" y="15" width="32" height="8" rx="4"/><rect class="s" x="56" y="42" width="8" height="12" rx="4"/><path class="l" d="M52 64h16M52 68h16"/>`,
    parlante: `<rect class="t" x="38" y="8" width="44" height="76" rx="4"/><rect class="s" x="46" y="13" width="28" height="6" rx="2"/>
      <circle class="l" cx="60" cy="38" r="15"/><circle cx="60" cy="38" r="11"/><circle class="s" cx="60" cy="38" r="4"/>
      <circle class="l" cx="60" cy="66" r="15"/><circle cx="60" cy="66" r="11"/><circle class="s" cx="60" cy="66" r="4"/>`,
    parrilla: `<rect class="t" x="22" y="40" width="76" height="18" rx="2"/><path class="t" d="M22 40V30q0-8 8-8h60q8 0 8 8v10"/><path d="M50 22v-4h20v4"/>
      <path d="M28 58l-4 26M92 58l4 26"/><path class="l" d="M26 74h68"/><path class="t" d="M98 44h12l-2 12h-8z"/><path class="l" d="M104 40q3-4 0-8"/>`,
    reposera: `<path class="t" d="M38 20l20 42 38-4-2-4-34 3-18-38z"/><path d="M38 20l20 42h38"/><path d="M90 58l10 26M44 84l20-24"/>
      <path class="l" d="M50 44h32"/><path d="M82 44l4 14"/>`,
    ventilador: `<circle class="t" cx="60" cy="30" r="24"/><circle class="l" cx="60" cy="30" r="17"/>
      <ellipse class="l" cx="60" cy="19" rx="5" ry="10"/><ellipse class="l" cx="60" cy="19" rx="5" ry="10" transform="rotate(120 60 30)"/><ellipse class="l" cx="60" cy="19" rx="5" ry="10" transform="rotate(240 60 30)"/>
      <circle class="s" cx="60" cy="30" r="4"/><path d="M60 54v26"/><rect class="s" x="44" y="80" width="32" height="4" rx="2"/>`,
    gazebo: `<path class="t" d="M14 34L60 12l46 22z"/><path class="t" d="M14 34h92v6H14z"/><path d="M60 12V8"/><path d="M18 40v44M102 40v44"/><path class="l" d="M40 40v38M80 40v38"/>`,
    bicicleta: `<circle cx="30" cy="62" r="20"/><circle cx="90" cy="62" r="20"/><circle class="s" cx="30" cy="62" r="2"/><circle class="s" cx="90" cy="62" r="2"/>
      <path d="M30 62h24l26-28H48zM48 34l6 28M80 34l10 28M80 34l-2-8h8"/><path d="M43 30h11" stroke-width="3"/><circle cx="54" cy="62" r="4"/>`,
    moto: `<circle cx="26" cy="66" r="16"/><circle cx="94" cy="66" r="16"/><circle class="s" cx="26" cy="66" r="2"/><circle class="s" cx="94" cy="66" r="2"/>
      <rect class="t" x="46" y="52" width="22" height="14" rx="3"/><path class="t" d="M48 44q10-8 24-4l2 6H48z"/><path class="s" d="M26 42h24v5H30q-4 0-4-5z"/>
      <path d="M26 66l22-4M40 47l40-9M94 66L82 30M82 30l-8-3"/><circle class="t" cx="87" cy="37" r="4"/>
      <path class="l" d="M12 60q12-14 28-6M40 74h30l4-3M83 54q12-6 22 2"/>`,
  };

  const GROUND = '<path class="g" d="M14 85.5h92"/>';

  /* Devuelve el SVG de la ilustración (o la genérica si la clave no existe). */
  AR.ilustracion = function (clave, titulo) {
    const body = I[clave] || '<rect class="t" x="34" y="18" width="52" height="64" rx="4"/><path class="l" d="M34 34h52"/>';
    const t = titulo ? `<title>${titulo}</title>` : '';
    const aria = titulo ? 'role="img"' : 'aria-hidden="true" focusable="false"';
    return `<svg class="ilu" viewBox="0 0 120 90" ${aria}>${t}<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${GROUND}${body}</g></svg>`;
  };
  AR.ilustraciones = Object.keys(I);
})();
