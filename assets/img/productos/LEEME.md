# Fotos de producto

Mientras un producto no tiene foto, el catálogo muestra una ilustración de su tipo (heladera, freezer,
balanza, etc.). Para poner la foto real:

1. Guardar la foto en esta carpeta con el **id** del producto como nombre, en formato `.webp` (o `.jpg`).
   El id está en `assets/data/productos.js`. Ejemplo: `com-heladera-exhibidora-mt17-inelro.webp`.
2. En `assets/data/productos.js`, en ese producto, cambiar `imagen: null` por
   `imagen: 'assets/img/productos/com-heladera-exhibidora-mt17-inelro.webp'`.

Recomendaciones para que todas se vean parejas:

- Foto del producto entero, de frente, sobre fondo blanco o liso, sin logos de otros comercios.
- Proporción 4:3 (por ejemplo 1200 × 900 px) y menos de 150 KB cada una.
- La tarjeta muestra la foto completa (no la recorta); el fondo blanco se funde con el gris de la tarjeta.
