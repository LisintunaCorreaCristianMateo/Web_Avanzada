import { Actividad, Notificacion, Evento } from '../models/actividadModel.js';
import { Op } from 'sequelize';

/**
 * Servicio para gestionar actividades, notificaciones y eventos
 */
export class ActividadService {
  
  /**
   * Registra una nueva actividad en el sistema
   * @param {string} tipo - Tipo de actividad (registro, actualizacion, etc)
   * @param {string} descripcion - Descripción de la actividad
   * @param {number} usuario_id - ID del usuario que realizó la acción
   */
  static async registrarActividad(tipo, descripcion, usuario_id = null) {
    try {
      await Actividad.create({
        tipo,
        descripcion,
        usuario_id
      });
    } catch (error) {
      console.error('Error al registrar actividad:', error);
      // No lanzamos error para no interrumpir el flujo principal
    }
  }

  /**
   * Obtiene las actividades más recientes
   * @param {number} limit - Número máximo de actividades a retornar
   * @returns {Array} Actividades recientes
   */
  static async obtenerActividadesRecientes(limit = 10) {
    try {
      const actividades = await Actividad.findAll({
        limit,
        order: [['fecha', 'DESC']]
      });
      return actividades;
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      throw error;
    }
  }

  /**
   * Crea una notificación
   * @param {string} titulo 
   * @param {string} mensaje 
   * @param {string} tipo - info, warning, success, danger
   */
  static async crearNotificacion(titulo, mensaje, tipo = 'info') {
    try {
      await Notificacion.create({
        titulo,
        mensaje,
        tipo
      });
    } catch (error) {
      console.error('Error al crear notificación:', error);
    }
  }

  /**
   * Obtiene notificaciones recientes
   * @param {number} limit 
   * @returns {Array}
   */
  static async obtenerNotificaciones(limit = 5) {
    try {
      const notificaciones = await Notificacion.findAll({
        limit,
        order: [['fecha', 'DESC']]
      });
      return notificaciones;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  /**
   * Obtiene eventos próximos
   * @param {number} limit 
   * @returns {Array}
   */
  static async obtenerEventosProximos(limit = 5) {
    try {
      const eventos = await Evento.findAll({
        where: {
          fecha_inicio: {
            [Op.gte]: new Date()
          }
        },
        limit,
        order: [['fecha_inicio', 'ASC']]
      });
      return eventos;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los datos para el dashboard
   * @returns {Object} Datos del dashboard
   */
  static async obtenerDatosDashboard() {
    try {
      const [actividades, notificaciones, eventos] = await Promise.all([
        this.obtenerActividadesRecientes(10),
        this.obtenerNotificaciones(5),
        this.obtenerEventosProximos(5)
      ]);

      return {
        actividades,
        notificaciones,
        eventos
      };
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
      throw error;
    }
  }
}
