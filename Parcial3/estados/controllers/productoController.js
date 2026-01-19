import { productos } from '../models/productoModel.js';

export function getAll(req, res) {
  return res.status(200).json(productos);
}

export function getById(req, res) {
  const id = Number(req.params.id);
  const product = productos.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  return res.status(200).json(product);
}

export function createProduct(req, res) {
  const data = req.body || {};
  const nextId = productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
  const newProduct = { id: nextId, ...data };
  productos.push(newProduct);
  return res.status(201).json({ message: 'Producto creado', resource: newProduct });
}

export function deleteById(req, res) {
  const id = Number(req.params.id);
  const idx = productos.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  productos.splice(idx, 1);
  return res.status(204).send();
}
