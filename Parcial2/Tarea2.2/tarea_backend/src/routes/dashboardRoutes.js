import express from 'express';
import { DashboardController } from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * @route GET /api/dashboard
 * @desc Obtiene todos los datos del dashboard
 */
router.get('/', DashboardController.obtenerDatos);

/**
 * @route GET /api/dashboard/actividades
 * @desc Obtiene solo actividades
 */
router.get('/actividades', DashboardController.obtenerActividades);

/**
 * @route GET /api/dashboard/notificaciones
 * @desc Obtiene solo notificaciones
 */
router.get('/notificaciones', DashboardController.obtenerNotificaciones);

/**
 * @route GET /api/dashboard/eventos
 * @desc Obtiene solo eventos
 */
router.get('/eventos', DashboardController.obtenerEventos);

export default router;
