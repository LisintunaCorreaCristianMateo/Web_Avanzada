import { Router } from 'express';
import { createEvent, getEventAdmin, assignEvent, listParticipants, revealForParticipant, listEvents } from '../controllers/eventController.js';

const router = Router();

// Admin crea evento con lista de nombres y fecha
router.post('/', createEvent);
// Admin lista todos los eventos (id, titulo, fecha, assigned)
router.get('/', listEvents);
// Admin ve detalles del evento (incluye participantes y asignaciones)
router.get('/:id', getEventAdmin);
// Admin dispara la asignación (shuffle)
router.post('/:id/assign', assignEvent);

// Invitados: obtienen lista de participantes para seleccionar su nombre
router.get('/:id/participants', listParticipants);
// Invitado pide revelar su amigo (solo su propio id)
router.get('/:id/participants/:pid/reveal', revealForParticipant);

export default router;
