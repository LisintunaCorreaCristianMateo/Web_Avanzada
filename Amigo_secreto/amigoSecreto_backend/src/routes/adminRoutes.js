import { Router } from 'express';
import { getEventAdmin } from '../controllers/eventController.js';

const router = Router();

// ruta para que el admin obtenga detalles de un evento (requiere adminToken en query o header)
router.get('/events/:id', getEventAdmin);

export default router;
