import express from 'express';
import * as evaluacionController from '../controllers/evaluacionController.js';

const router = express.Router();

// Rutas de cálculos agregados (deben ir ANTES de las rutas CRUD para evitar conflictos)
router.get('/parciales', evaluacionController.obtenerResumenesParciales);
router.get('/estados', evaluacionController.obtenerEstadosSemestrales);
router.get('/resumen-parcial/:estudiante_id/:asignatura_id/:parcial', evaluacionController.calcularResumenParcial);
router.get('/estado-semestral/:estudiante_id/:asignatura_id', evaluacionController.calcularEstadoSemestral);

// Rutas CRUD
router.get('/', evaluacionController.obtenerTodas);
router.get('/:id', evaluacionController.obtenerPorId);
router.post('/', evaluacionController.crear);
router.put('/:id', evaluacionController.actualizar);
router.delete('/:id', evaluacionController.eliminar);

export default router;
