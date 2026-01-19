import { Router } from 'express';
import { createIntegrante, getIntegrantes, assign, reset, toggleEstado } from '../controllers/integranteController.js';

const router = Router();

router.post('/', createIntegrante);
router.get('/', getIntegrantes);
router.post('/asignar', assign);
router.post('/reset', reset);
router.patch('/:id/toggle', toggleEstado);

export default router;
