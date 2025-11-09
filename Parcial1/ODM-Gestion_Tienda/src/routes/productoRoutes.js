import { Router } from 'express';
import {
    crearProducto,
   listarProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
} from '../controlles/productoController.js';

export const router = Router();

// Ruta para crear un nuevo producto
router.post('/', crearProducto);
router.get('/',listarProductos);
router.get('/:id', obtenerProductoPorId);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);