import express from 'express';
import { listatProductos, mostarProductoIndividual, agregarProducto, elimanrProducto, mostrarFormularioEdicion, procesarEdicion } from '../controllers/productoController.js';
import { vistaNuevoProducto } from './productoView.js';

// inicializar express
const app = express();
// puerto del servidor
const Port = 3000;

// middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));//lee nombres de formularios

// rutas
app.get('/',(req,res)=>res.redirect ("/productos"));//redirige a /productos


// Forma extendida
//app.get('/', function(req, res) {
//    res.redirect("/productos");
//});


app.get('/productos', listatProductos);
app.get('/producto/:id', mostarProductoIndividual);


// formulario para crear nuevo producto
app.get('/nuevo', (req, res) => {
    res.type('html').send(vistaNuevoProducto());
});

// manejar envío del formulario
app.post('/nuevo', agregarProducto);
app.post('/producto/:id/eliminar', elimanrProducto);

// Rutas para editar productos
app.get('/producto/:id/editar', mostrarFormularioEdicion);  // Controlador 1: Mostrar formulario
app.post('/producto/:id/editar', procesarEdicion);          // Controlador 2: Procesar cambios


// iniciar servidor
app.listen(Port, () => {
	
});
console.log(`Servidor escuchando en http://localhost:${Port}`);
export default app;