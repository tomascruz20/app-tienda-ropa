# Tienda de Ropa - App Móvil (Proyecto ABP)

## Descripción del Proyecto
Aplicación móvil e-commerce para la visualización de un catálogo de prendas de vestir, filtrado de productos y gestión de un carrito de compras. Desarrollada con React Native y Expo.

## Integrantes
Tomas Cruz
Samira Nieto
Juan Francisco Carballo Mamani

---

## Features Previstas y Estado Actual

| Feature | Estado |
| :--- | :---: |
| Pantalla principal con catálogo de productos | 
| Componentes reutilizables (Cards de producto) | 
| Filtros por género y subcategorías | 
| Búsqueda de ropa por nombre |
| Carrito de compras con cálculo de totales | 
| Persistencia del carrito (`AsyncStorage`) | 
| Detalle de producto individual (`[id].tsx`) | 🚧 En Desarrollo |
| Autenticación de usuarios / Registro | ⏳ Pendiente |
| Pasarela de pago / Finalizar compra | ⏳ Pendiente |

---

Mejoras realizadas en la app "Urban Store"
Problemas detectados y solucionados
Problema	Causa	Solución
La pantalla de detalle del producto se rompía	Buscaba el producto en una lista (PRODUCTS_DATA) que no existía	Se reescribió para pedir el producto a la API por su ID
Agregar dos veces al carrito rompía la app	El botón "Agregar" estaba dentro de la tarjeta que abre el detalle, que estaba roto	Se separó el botón de la tarjeta y se corrigió la lógica del carrito
"Finalizar compra" no hacía nada	El botón no tenía ninguna acción asociada	Se agregó un cartel de "¡Compra realizada con éxito!" con número de pedido y total
Aparecían productos que no eran ropa (auriculares, etc.)	La API mezcla todo tipo de artículos	Se filtran por nombre y solo se muestra ropa
Categorías incorrectas (una gorra en "Jeans")	Género y categoría se asignaban al azar por posición	La categoría ahora se deduce del nombre del producto
Código duplicado en types/index.ts	Tipos declarados dos veces	Se dejó una única definición limpia
Mejoras de diseño (estilo e-commerce)
Nueva identidad: nombre URBAN STORE y paleta de colores propia (negro, rosa de acento, fondo gris claro).
Encabezado oscuro con ícono de carrito y contador de unidades.
Banner de bienvenida con envío gratis y cuotas.
Categorías como botones deslizables.
Productos en grilla de tarjetas (2, 3 o 4 columnas según el tamaño de pantalla).
Precio con formato argentino y cuotas sin interés.
Aviso "✓ Agregado al carrito" con acceso directo al carrito.
Pantallas de carga y de error con botón "Reintentar".
Pantalla de detalle del producto (nueva)
Imagen grande con miniaturas.
Categoría, precio, cuotas, stock y descripción.
Información de envío gratis.
Botón fijo "Agregar al carrito" con confirmación y control de stock máximo.
Indica cuántas unidades del producto ya están en el carrito.
Carrito y compra
Cantidades con botones + y −, límite de stock y botón para eliminar.
Cálculo automático de subtotal, IVA (21%), envío y total.
Aviso de cuánto falta para el envío gratis.
Pantalla de carrito vacío con botón para volver a la tienda.
Cartel de compra exitosa que vacía el carrito al terminar.
El carrito se guarda en el dispositivo y no se pierde al cerrar la app.
Cambios en el código

Archivos modificados

src/types/index.ts
src/context/CartContext.tsx
src/screens/HomeScreen.tsx
src/app/product/[id].tsx
src/app/cart.tsx

Archivos nuevos

src/constants/store.ts: nombre de la tienda, colores, costos de envío y formato de precios.
src/services/products.ts: conexión con la API, filtrado de ropa y detección de categorías.
Decisiones tomadas
Se eliminó el filtro Hombre/Mujer porque la API no trae ese dato y no se quiso inventar.
Los precios salen de la API (multiplicados por 1000, con mínimo de $15.000).
La compra es simulada: no se cobra ni se guarda ningún pedido.
Pendientes / ideas a futuro
Selector de talles (S, M, L, XL).
Favoritos ❤️.
Ordenar por precio.
Pantalla de datos de envío antes de pagar.
Nombre y colores de la marca real.