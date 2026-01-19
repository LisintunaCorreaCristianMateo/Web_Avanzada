import { ActividadService } from '../services/actividadService.js';

/**
 * Controlador del dashboard
 */
export class DashboardController {

  /**
   * Obtiene todos los datos para el dashboard
   */
  static async obtenerDatos(req, res) {
    try {
      const datos = await ActividadService.obtenerDatosDashboard();

      res.json(datos);
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
      res.status(500).json({ error: 'Error al obtener datos del dashboard' });
    }
  }

  /**
   * Obtiene solo actividades
   */
  static async obtenerActividades(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const actividades = await ActividadService.obtenerActividadesRecientes(limit);

      res.json(actividades);
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      res.status(500).json({ error: 'Error al obtener actividades' });
    }
  }

  /**
   * Obtiene solo notificaciones
   */
  static async obtenerNotificaciones(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const notificaciones = await ActividadService.obtenerNotificaciones(limit);

      res.json(notificaciones);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
  }

  /**
   * Obtiene solo eventos
   */
  static async obtenerEventos(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const eventos = await ActividadService.obtenerEventosProximos(limit);

      res.json(eventos);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      res.status(500).json({ error: 'Error al obtener eventos' });
    }
  }
}
