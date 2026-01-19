import express from 'express';
import { productos } from '../models/productoModel.js';

const router = express.Router();

// CRUD básico para productos (lógica implementada aquí)
router.get('/', (req, res) => {
	res.status(200).json(productos);
});

router.get('/:id', (req, res) => {
	const id = Number(req.params.id);
	const product = productos.find((p) => p.id === id);
	if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
	res.status(200).json(product);
});

router.post('/', (req, res) => {
	const data = req.body || {};
	const nextId = productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
	const newProduct = { id: nextId, ...data };
	productos.push(newProduct);
	res.status(201).json({ message: 'Producto creado', resource: newProduct });
});

router.delete('/:id', (req, res) => {
	const id = Number(req.params.id);
	const idx = productos.findIndex((p) => p.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
	productos.splice(idx, 1);
	res.status(204).send();
});

// Rutas de estado para pruebas (devuelven los códigos del tablero)
router.get('/status/200', (req, res) => {
	res.status(200).json({ message: 'OK' });
});

router.post('/status/201', (req, res) => {
	const created = { id: 999, ...req.body };
	res.status(201).json({ message: 'Created', resource: created });
});

router.delete('/status/204', (req, res) => {
	// Simula borrado exitoso sin contenido
	res.status(204).send();
});

router.get('/status/301', (req, res) => {
	// Redirige a la ruta 200 dentro de este router
	res.redirect(301, '/api/productos/status/200');
});

router.get('/status/401', (req, res) => {
	res.status(401).json({ error: 'Unauthorized' });
});

router.get('/status/403', (req, res) => {
	res.status(403).json({ error: 'Forbidden' });
});

router.get('/status/503', (req, res) => {
	res.status(503).json({ error: 'Service Unavailable' });
});

// Error de servidor 5xx para pruebas
router.get('/status/500', (req, res) => {
	res.status(500).json({ error: 'Internal Server Error' });
});

export default router;
