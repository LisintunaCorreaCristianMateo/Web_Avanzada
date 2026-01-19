import { Docente } from '../models/docenteModel.js';
import { Usuario } from '../models/usuarioModel.js';
import { ActividadService } from '../services/actividadService.js';
import { AuthService } from '../services/authService.js';
import { Op } from 'sequelize';

/**
 * Controlador de docentes
 */
export class DocenteController {

  /**
   * Obtiene todos los docentes
   */
  static async obtenerTodos(req, res) {
    try {
      const { buscar } = req.query;

      const where = {};
      
      if (buscar) {
        const isNumeric = !isNaN(buscar);
        
        if (isNumeric) {
          // Si es numérico, buscar por ID
          where.id = parseInt(buscar);
        } else {
          // Si es texto, buscar por nombres, apellidos o especialidad
          where[Op.or] = [
            { nombres: { [Op.like]: `%${buscar}%` } },
            { apellidos: { [Op.like]: `%${buscar}%` } },
            { especialidad: { [Op.like]: `%${buscar}%` } }
          ];
        }
      }

      const docentes = await Docente.findAll({
        where,
        order: [['apellidos', 'ASC'], ['nombres', 'ASC']]
      });

      res.json(docentes);
    } catch (error) {
      console.error('Error al obtener docentes:', error);
      res.status(500).json({ error: 'Error al obtener docentes' });
    }
  }

  /**
   * Obtiene un docente por ID
   */
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      const docente = await Docente.findOne({
        where: { id }
      });

      if (!docente) {
        return res.status(404).json({ error: 'Docente no encontrado' });
      }

      res.json(docente);
    } catch (error) {
      console.error('Error al obtener docente:', error);
      res.status(500).json({ error: 'Error al obtener docente' });
    }
  }

  /**
   * Crea un nuevo docente
   */
  static async crear(req, res) {
    try {
      const {
        cedula,
        nombres,
        apellidos,
        especialidad,
        email,
        telefono,
        direccion,
        fecha_nacimiento,
        titulo,
        carga_horaria
      } = req.body;

      const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

      // Validaciones
      if (!cedula || !nombres || !apellidos) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      // Verificar que no exista ya
      const existente = await Docente.findOne({ 
        where: { cedula, estado: 'activo' } 
      });
      
      if (existente) {
        return res.status(400).json({ error: 'Ya existe un docente con esa cédula' });
      }

      // Crear docente
      const docente = await Docente.create({
        cedula,
        nombres,
        apellidos,
        especialidad,
        email,
        telefono,
        direccion,
        fecha_nacimiento,
        titulo,
        carga_horaria: carga_horaria ? parseInt(carga_horaria) : 0,
        foto: fotoPath
      });

      // Crear usuario para el docente
      if (email) {
        try {
          await AuthService.crearUsuario({
            username: cedula,
            password: cedula, // Password inicial igual a la cédula
            rol: 'docente',
            referencia_id: docente.id
          });
        } catch (error) {
          console.error('Error al crear usuario del docente:', error);
        }
      }

      // Registrar actividad (opcional, no bloquea si falla)
      try {
        await ActividadService.registrarActividad(
          'registro',
          `Se registró docente: ${nombres} ${apellidos}`,
          req.usuario?.id || null
        );
      } catch (actError) {
        console.warn('No se pudo registrar la actividad:', actError.message);
      }

      res.status(201).json(docente);
    } catch (error) {
      console.error('Error al crear docente:', error);
      res.status(500).json({ error: 'Error al crear docente' });
    }
  }

  /**
   * Actualiza un docente
   */
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        nombres,
        apellidos,
        especialidad,
        email,
        telefono,
        direccion,
        fecha_nacimiento,
        titulo,
        cedula,
        estado,
        carga_horaria
      } = req.body;

      const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

      const docente = await Docente.findByPk(id);

      if (!docente) {
        return res.status(404).json({ error: 'Docente no encontrado' });
      }

      // Actualizar campos
      if (nombres) docente.nombres = nombres;
      if (apellidos) docente.apellidos = apellidos;
      if (cedula) docente.cedula = cedula;
      if (especialidad) docente.especialidad = especialidad;
      if (email) docente.email = email;
      if (telefono) docente.telefono = telefono;
      if (direccion) docente.direccion = direccion;
      if (fecha_nacimiento) docente.fecha_nacimiento = fecha_nacimiento;
      if (titulo) docente.titulo = titulo;
      if (estado) docente.estado = estado;
      if (carga_horaria !== undefined) docente.carga_horaria = parseInt(carga_horaria);
      if (fotoPath) docente.foto = fotoPath;

      await docente.save();

      // Registrar actividad (opcional, no bloquea si falla)
      try {
        await ActividadService.registrarActividad(
          'actualizacion',
          `Se actualizó docente: ${docente.nombres} ${docente.apellidos}`,
          req.usuario?.id || null
        );
      } catch (actError) {
        console.warn('No se pudo registrar la actividad:', actError.message);
      }

      res.json(docente);
    } catch (error) {
      console.error('Error al actualizar docente:', error);
      res.status(500).json({ error: 'Error al actualizar docente' });
    }
  }

  /**
   * Elimina (desactiva) un docente
   */
  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      const docente = await Docente.findByPk(id);

      if (!docente) {
        return res.status(404).json({ error: 'Docente no encontrado' });
      }

      docente.estado = 'inactivo';
      await docente.save();

      // Desactivar usuario asociado (opcional, no bloquea si falla)
      try {
        const usuario = await Usuario.findOne({
          where: { rol: 'docente', referencia_id: id }
        });

        if (usuario) {
          usuario.activo = false;
          await usuario.save();
        }
      } catch (userError) {
        console.warn('No se pudo desactivar el usuario asociado:', userError.message);
      }

      // Registrar actividad (opcional, no bloquea si falla)
      try {
        await ActividadService.registrarActividad(
          'eliminacion',
          `Se eliminó docente: ${docente.nombres} ${docente.apellidos}`,
          req.usuario?.id || null
        );
      } catch (actError) {
        console.warn('No se pudo registrar la actividad:', actError.message);
      }

      res.json({ mensaje: 'Docente eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar docente:', error);
      res.status(500).json({ error: 'Error al eliminar docente' });
    }
  }
}
