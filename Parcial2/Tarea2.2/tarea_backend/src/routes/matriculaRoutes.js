import express from 'express';
import * as matriculaController from '../controllers/matriculaController.js';

const router = express.Router();

// Crear una nueva matrícula
router.post('/', matriculaController.crearMatricula);

// Obtener todas las matrículas
router.get('/', matriculaController.obtenerTodasMatriculas);

// Obtener matrículas por estudiante
router.get('/estudiante/:estudianteId', matriculaController.obtenerMatriculasPorEstudiante);

// Actualizar estado de matrícula
// Eliminar matrícula
router.delete('/:id', matriculaController.eliminarMatricula);

export default router;
