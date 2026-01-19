import { Estudiante } from '../models/estudianteModel.js';
import { Usuario } from '../models/usuarioModel.js';
import { ActividadService } from '../services/actividadService.js';
import { AuthService } from '../services/authService.js';
import { validarCedulaEcuatoriana, obtenerErrorCedula } from '../utils/validaciones.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

/**
 * Controlador de estudiantes
 */
export class EstudianteController {

  /**
   * Obtiene todos los estudiantes
   */
  static async obtenerTodos(req, res) {
    try {
      const { buscar, estado } = req.query;

      const where = {};
      
      // Filtrar por estado si se especifica
      if (estado && estado !== 'todos') {
        where.estado = estado;
      }
      
      if (buscar && buscar.trim()) {
        const terminoBusqueda = buscar.trim();
        const isNumeric = !isNaN(terminoBusqueda);
        
        // Buscar por ID, cédula o nombre
        where[Op.or] = [
          // Buscar por nombres (que contenga el término)
          {
            nombres: {
              [Op.like]: `%${terminoBusqueda}%`
            }
          },
          // Buscar por apellidos (que contenga el término)
          {
            apellidos: {
              [Op.like]: `%${terminoBusqueda}%`
            }
          },
          // Buscar por cédula (que contenga el término)
          {
            cedula: {
              [Op.like]: `%${terminoBusqueda}%`
            }
          }
        ];

        // Si es numérico, también buscar por ID exacto
        if (isNumeric) {
          where[Op.or].push({
            id: parseInt(terminoBusqueda)
          });
        }
      }

      const estudiantes = await Estudiante.findAll({
        where,
        order: [['apellidos', 'ASC'], ['nombres', 'ASC']]
      });

      // Transformar los datos (sin curso ya que se eliminó esa tabla)
      const estudiantesTransformados = estudiantes.map(est => {
        const estudiante = est.toJSON();
        return {
          ...estudiante,
          curso_nombre: null,
          paralelo: null,
          nivel: null
        };
      });

      res.json(estudiantesTransformados);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
  }

  /**
   * Obtiene un estudiante por ID
   */
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      const estudiante = await Estudiante.findOne({
        where: { id, estado: 'activo' }
      });

      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }

      res.json(estudiante);
    } catch (error) {
      console.error('Error al obtener estudiante:', error);
      res.status(500).json({ error: 'Error al obtener estudiante' });
    }
  }

  /**
   * Busca estudiantes por diferentes criterios
   */
  static async buscar(req, res) {
    try {
      const { q, tipo } = req.query;

      if (!q || q.trim().length < 1) {
        return res.status(400).json({ error: 'Término de búsqueda requerido' });
      }

      const terminoBusqueda = q.trim();
      let where = { estado: 'activo' };

      switch (tipo) {
        case 'cedula':
          where.cedula = { [Op.like]: `%${terminoBusqueda}%` };
          break;
        case 'nombre':
          where[Op.or] = [
            { nombres: { [Op.like]: `%${terminoBusqueda}%` } },
            { apellidos: { [Op.like]: `%${terminoBusqueda}%` } }
          ];
          break;
        case 'id':
          if (!isNaN(terminoBusqueda)) {
            where.id = parseInt(terminoBusqueda);
          } else {
            return res.status(400).json({ error: 'ID debe ser un número' });
          }
          break;
        default:
          // Búsqueda general
          const isNumeric = !isNaN(terminoBusqueda);
          where[Op.or] = [
            { nombres: { [Op.like]: `%${terminoBusqueda}%` } },
            { apellidos: { [Op.like]: `%${terminoBusqueda}%` } },
            { cedula: { [Op.like]: `%${terminoBusqueda}%` } }
          ];
          
          if (isNumeric) {
            where[Op.or].push({ id: parseInt(terminoBusqueda) });
          }
      }

      const estudiantes = await Estudiante.findAll({
        where,
        order: [['apellidos', 'ASC'], ['nombres', 'ASC']],
        limit: 50 // Limitar resultados para mejorar rendimiento
      });

      res.json({
        total: estudiantes.length,
        estudiantes
      });
    } catch (error) {
      console.error('Error al buscar estudiantes:', error);
      res.status(500).json({ error: 'Error al buscar estudiantes' });
    }
  }

  /**
   * Crea un nuevo estudiante
   */
  static async crear(req, res) {
    try {
      const {
        cedula,
        nombres,
        apellidos,
        fecha_nacimiento,
        direccion,
        telefono,
        email
      } = req.body;

      // Validaciones básicas
      if (!cedula || !nombres || !apellidos) {
        return res.status(400).json({ error: 'Faltan campos requeridos: cedula, nombres, apellidos' });
      }

      // Validar cédula ecuatoriana
      const errorCedula = obtenerErrorCedula(cedula);
      if (errorCedula) {
        // Si hay foto subida pero la cédula es inválida, eliminar la foto
        if (req.file) {
          try {
            fs.unlinkSync(path.join(process.cwd(), 'uploads', req.file.filename));
          } catch (err) {
            console.error('Error al eliminar foto:', err);
          }
        }
        return res.status(400).json({ error: errorCedula });
      }

      // Validar email si se proporciona
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
      }

      // Si se subió archivo, construir ruta pública
      const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

      // Verificar que no exista ya un estudiante con esa cédula
      const existente = await Estudiante.findOne({ 
        where: { cedula, estado: 'activo' } 
      });
      
      if (existente) {
        // Si hay foto subida pero ya existe el estudiante, eliminar la foto
        if (req.file) {
          try {
            fs.unlinkSync(path.join(process.cwd(), 'uploads', req.file.filename));
          } catch (err) {
            console.error('Error al eliminar foto:', err);
          }
        }
        return res.status(400).json({ error: 'Ya existe un estudiante con esa cédula' });
      }

      // Crear estudiante
      const estudiante = await Estudiante.create({
        cedula,
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        fecha_nacimiento,
        direccion: direccion?.trim(),
        telefono: telefono?.trim(),
        email: email?.trim().toLowerCase(),
        foto: fotoPath
      });

      // Crear usuario para el estudiante si tiene email
      if (email) {
        try {
          await AuthService.crearUsuario({
            username: cedula,
            password: cedula, // Password inicial igual a la cédula
            referencia_id: estudiante.id
          });
        } catch (error) {
          console.error('Error al crear usuario del estudiante:', error);
        }
      }

      // Registrar actividad (opcional, no bloquea si falla)
      try {
        await ActividadService.registrarActividad(
          'registro',
          `Se registró estudiante: ${nombres} ${apellidos} (${cedula})`,
          null
        );
      } catch (errorActividad) {
        console.warn('No se pudo registrar actividad:', errorActividad);
      }

      res.status(201).json(estudiante);
    } catch (error) {
      // Si hay error y se subió una foto, eliminarla
      if (req.file) {
        try {
          fs.unlinkSync(path.join(process.cwd(), 'uploads', req.file.filename));
        } catch (err) {
          console.error('Error al eliminar foto tras error:', err);
        }
      }
      
      console.error('Error al crear estudiante:', error);
      res.status(500).json({ error: 'Error al crear estudiante' });
    }
  }

  /**
   * Actualiza un estudiante
   */
  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        cedula,
        nombres,
        apellidos,
        fecha_nacimiento,
        direccion,
        telefono,
        email,
        estado
      } = req.body;

      console.log('Actualizando estudiante ID:', id);
      console.log('Datos recibidos:', { cedula, nombres, apellidos, fecha_nacimiento, email, telefono });
      console.log('Archivo recibido:', req.file ? req.file.filename : 'Sin archivo');

      const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

      const estudiante = await Estudiante.findByPk(id);

      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }

      // Validar cédula ecuatoriana si se está cambiando
      if (cedula && cedula !== estudiante.cedula) {
        const errorCedula = obtenerErrorCedula(cedula);
        if (errorCedula) {
          // Si hay foto subida pero la cédula es inválida, eliminar la foto
          if (req.file) {
            try {
              fs.unlinkSync(path.join(process.cwd(), 'uploads', req.file.filename));
            } catch (err) {
              console.error('Error al eliminar foto:', err);
            }
          }
          return res.status(400).json({ error: errorCedula });
        }

        // Verificar si la cédula ya existe en otro estudiante
        const existente = await Estudiante.findOne({ 
          where: { 
            cedula,
            id: { [Op.ne]: id } // Excluir el estudiante actual
          } 
        });
        
        if (existente) {
          console.log('Cédula duplicada:', cedula);
          // Si se subió una foto nueva pero hay error, eliminarla
          if (req.file) {
            try {
              fs.unlinkSync(path.join(process.cwd(), 'uploads', req.file.filename));
            } catch (err) {
              console.error('Error al eliminar foto:', err);
            }
          }
          return res.status(400).json({ error: 'Ya existe un estudiante con esa cédula' });
        }
        // Si pasa la validación, actualizar la cédula
        estudiante.cedula = cedula;
      }

      // Actualizar campos (permitir valores vacíos para limpiar campos opcionales)
      if (nombres) estudiante.nombres = nombres;
      if (apellidos) estudiante.apellidos = apellidos;
      if (fecha_nacimiento) estudiante.fecha_nacimiento = fecha_nacimiento;
      estudiante.direccion = direccion !== undefined ? direccion : estudiante.direccion;
      estudiante.telefono = telefono !== undefined ? telefono : estudiante.telefono;
      estudiante.email = email !== undefined ? email : estudiante.email;
      if (estado) estudiante.estado = estado;
      
      if (fotoPath) {
        // Si hay nueva foto, eliminar la anterior
        if (estudiante.foto) {
          try {
            const oldPhotoPath = path.join(process.cwd(), estudiante.foto.replace('/uploads/', 'uploads/'));
            if (fs.existsSync(oldPhotoPath)) {
              fs.unlinkSync(oldPhotoPath);
            }
          } catch (err) {
            console.warn('Error al eliminar foto anterior:', err);
          }
        }
        estudiante.foto = fotoPath;
      }

      await estudiante.save();

      // Registrar actividad (opcional, no bloquea si falla)
      try {
        await ActividadService.registrarActividad(
          'actualizacion',
          `Se actualizó estudiante: ${estudiante.nombres} ${estudiante.apellidos}`,
          null
        );
      } catch (errorActividad) {
        console.warn('No se pudo registrar actividad:', errorActividad);
      }

      res.json(estudiante);
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      console.error('Stack trace:', error.stack);
      
      // Si hay foto subida y error, eliminarla
      if (req.file) {
        try {
          fs.unlinkSync(path.join(process.cwd(), 'uploads', req.file.filename));
        } catch (err) {
          console.error('Error al eliminar foto tras error:', err);
        }
      }
      
      res.status(500).json({ 
        error: 'Error al actualizar estudiante',
        detalle: error.message,
        tipo: error.name
      });
    }
  }

  /**
   * Elimina (desactiva) un estudiante
   */
  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      const estudiante = await Estudiante.findByPk(id);

      if (!estudiante) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }

      estudiante.estado = 'inactivo';
      await estudiante.save();

      // Desactivar usuario asociado si existe
      try {
        const usuario = await Usuario.findOne({
          where: { referencia_id: id }
        });

        if (usuario) {
          usuario.activo = false;
          await usuario.save();
        }
      } catch (errorUsuario) {
        console.warn('No se pudo desactivar usuario asociado:', errorUsuario);
      }

      // Registrar actividad (opcional, no bloquea si falla)
      try {
        await ActividadService.registrarActividad(
          'eliminacion',
          `Se cambió a inactivo estudiante: ${estudiante.nombres} ${estudiante.apellidos}`,
          null
        );
      } catch (errorActividad) {
        console.warn('No se pudo registrar actividad:', errorActividad);
      }

      res.json({ 
        mensaje: 'Estudiante cambiado a inactivo correctamente',
        estudiante: {
          id: estudiante.id,
          estado: estudiante.estado
        }
      });
    } catch (error) {
      console.error('Error al cambiar estado del estudiante:', error);
      res.status(500).json({ 
        error: 'Error al cambiar estado del estudiante',
        detalle: error.message
      });
    }
  }
}
