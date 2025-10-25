//crear html para listar los productos 
export function vistaProductos(producto){
// encabezado
const productos = Array.isArray(producto) ? producto : [];

let html = /*html*/`

<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Lista de Productos</title>
    <style>body{font-family: Arial, Helvetica, sans-serif; padding:20px} ul{list-style:none;padding:0} li{margin:8px 0}</style>
</head>
<style>
    .boton{
        display: inline-block;
        padding: 10px 15px;
        font-size: 14px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
    }
</style>
<!-- Ids in the navbar a-href and ids in the content should match-->

<div data-bs-spy="scroll" data-bs-target="#navId" data-bs-smooth-scroll="true">
    
    <div id="navId">
        <ul class="nav nav-tabs" role="tablist">
            
        </ul>
    </div>
    
</div>


<script>
    var scrollSpy = new bootstrap.ScrollSpy(document.body, {
      target: '#navId'
    })
</script>

<body>
    <h1>Lista de Productos</h1>
    
    <a class = "boton" href="/nuevo">Agregar Nuevo Producto</a>
    <ul>
`;

    // recorrer los productos
    productos.forEach((p) => {
        html += `    <li>
            <a href="/producto/${p.id}">${p.nombre}</a> - $${p.precio} - ${p.categoria}
        </li>\n`;
    });

    html += `  </ul>
    </body>
</html>`;
    return html;
}
//generar html del detalle del producto
//
//
export function vistaDetalleProducto(producto){
if (!producto) {
    const html = /*html*/`
    
    <!doctype html>
    <html lang="es"><head><meta charset="utf-8"><title>No encontrado</title></head><body>
        <h1>Producto no encontrado</h1>
        <a href="/">Volver a la lista</a>
    </body>
    </html>
`;

return html;

}

const html = /*html*/`

<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Detalle - ${producto.nombre}</title>
    <style>
        body{font-family: Arial, Helvetica, sans-serif; padding:20px}
        .botones{margin-top:20px}
        .btn{padding:10px 20px; margin-right:10px; text-decoration:none; border-radius:5px; border:none; cursor:pointer; font-size:14px}
        .btn-volver{background:#007bff; color:white}
        .btn-volver:hover{background:#0056b3}
        .btn-eliminar{background:#dc3545; color:white}
        .btn-eliminar:hover{background:#c82333}
        .btn-editar{background:#ffc107; color:#000}
        .btn-editar:hover{background:#e0a800}
    </style>
</head>
<body>
    <h1>Detalle del Producto</h1>
    
    <h2>${producto.nombre}</h2>
    <p><strong>ID:</strong> ${producto.id}</p>
    <p><strong>Precio:</strong> $${producto.precio}</p>
    <p><strong>Categoria:</strong> ${producto.categoria}</p>

    <div class="botones">
        <a href="/" class="btn btn-volver">Volver a la lista</a>
        <a href="/producto/${producto.id}/editar" class="btn btn-editar">✏️ Editar</a>
        <form method="post" action="/producto/${producto.id}/eliminar" style="display:inline" 
              onsubmit="return confirm('¿Estás seguro de eliminar ${producto.nombre}?');">
            <button type="submit" class="btn btn-eliminar">🗑️ Eliminar Producto</button>
        </form>
    </div>
</body>
</html>

`;

 return html;
}

//generar html del formulario de edición
export function vistaFormularioEdicion(producto){
const html = /*html*/`

<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Editar - ${producto.nombre}</title>
    <style>
        body{font-family: Arial, Helvetica, sans-serif; padding:20px}
        form{padding:20px; border-radius:8px; max-width:400px}
        label{display:block; margin:15px 0 5px; font-weight:bold}
        input{padding:8px; width:100%; border:1px solid #ccc; border-radius:4px; box-sizing:border-box}
        .botones{margin-top:20px}
        .btn{padding:10px 20px; margin-right:10px; text-decoration:none; border-radius:5px; border:none; cursor:pointer; font-size:14px}
        .btn-guardar{background:#28a745; color:white}
        .btn-guardar:hover{background:#218838}
        .btn-cancelar{background:#6c757d; color:white}
        .btn-cancelar:hover{background:#5a6268}
    </style>
</head>
<body>
    <h1>Editar Producto</h1>
    <form method="post" action="/producto/${producto.id}/editar">
        <label>ID:</label>
        <input type="text" value="${producto.id}" disabled>
        
        <label>Nombre:</label>
        <input type="text" name="nombre" value="${producto.nombre}" required>
        
        <label>Precio:</label>
        <input type="number" name="precio" step="0.01" value="${producto.precio}" required>
        
        <label>Categoría:</label>
        <input type="text" name="categoria" value="${producto.categoria}" required>
        
        <div class="botones">
            <button type="submit" class="btn btn-guardar">💾 Guardar Cambios</button>
            <a href="/producto/${producto.id}" class="btn btn-cancelar">Cancelar</a>
        </div>
    </form>
</body>
</html>

`;
    
    return html;
}
export function vistaNuevoProducto(){
    	const html = /*html*/`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Nuevo Producto</title>

    <style>
        body{font-family: Arial, Helvetica, sans-serif; padding:20px}
        .botones{margin-top:20px}
        .btn{padding:10px 20px; margin-right:10px; text-decoration:none; border-radius:5px; border:none; cursor:pointer; font-size:14px}
        .btn-volver{background:#007bff; color:white}
        .btn-volver:hover{background:#0056b3}
        .btn-eliminar{background:#dc3545; color:white}
        .btn-eliminar:hover{background:#c82333}
    </style>

</head><body>

	<h1>Agregar Nuevo Producto</h1>
	
	
	
	<form method="post" action="/nuevo">
		<label>Nombre: <input name="nombre" required></label><br>
		<label>Precio: <input name="precio" required></label><br>
		<label>Categoria: <input name="categoria" required></label><br>
		<button class="btn btn-eliminar" type="submit">Agregar</button>
	</form>
	<br>
	<a class="btn btn-volver" href="/">Volver</a>
</body></html>`;
return html;
}