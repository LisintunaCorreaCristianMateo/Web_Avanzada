import {Router} from 'express';
import {mostrarEventos,crearEvento} from '../controllers/eventoController.js';
export const eventoRouter=Router();
// Definir rutas para el evento
eventoRouter.get('/',mostrarEventos);
eventoRouter.post('/',crearEvento);