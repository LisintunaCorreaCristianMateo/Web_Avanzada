import express from 'express';
import {
  obtenerAsignaturas,
  obtenerAsignaturaPorId,
  buscarAsignaturas,
  crearAsignatura,
  actualizarAsignatura,
  eliminarAsignatura
} from '../controllers/asignaturaController.js';

const router = express.Router();

router.get('/', obtenerAsignaturas);
router.get('/buscar', buscarAsignaturas);
router.get('/:id', obtenerAsignaturaPorId);
router.post('/', crearAsignatura);
router.put('/:id', actualizarAsignatura);
router.delete('/:id', eliminarAsignatura);

export default router;
