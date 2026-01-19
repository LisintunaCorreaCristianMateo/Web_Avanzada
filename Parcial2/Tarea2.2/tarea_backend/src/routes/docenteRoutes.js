import express from 'express';
import path from 'path';
import multer from 'multer';
import { DocenteController } from '../controllers/docenteController.js';

const router = express.Router();

// Configurar multer para uploads de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

/**
 * @route GET /api/docentes
 * @desc Obtiene todos los docentes
 */
router.get('/', DocenteController.obtenerTodos);

/**
 * @route GET /api/docentes/:id
 * @desc Obtiene un docente por ID
 */
router.get('/:id', DocenteController.obtenerPorId);

/**
 * @route POST /api/docentes
 * @desc Crea un nuevo docente
 */
router.post('/', upload.single('foto'), DocenteController.crear);

/**
 * @route PUT /api/docentes/:id
 * @desc Actualiza un docente
 */
router.put('/:id', upload.single('foto'), DocenteController.actualizar);

/**
 * @route DELETE /api/docentes/:id
 * @desc Elimina un docente
 */
router.delete('/:id', DocenteController.eliminar);

export default router;
