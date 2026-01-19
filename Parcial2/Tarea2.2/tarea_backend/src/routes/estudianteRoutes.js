import express from 'express';
import path from 'path';
import multer from 'multer';
import { EstudianteController } from '../controllers/estudianteController.js';

const router = express.Router();

// Configurar multer para uploads de fotos
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = path.join(process.cwd(), 'uploads');
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname).toLowerCase();
		const name = `estudiante-${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
		cb(null, name);
	}
});

// Filtro para validar tipo de archivo
const fileFilter = (req, file, cb) => {
	console.log('Archivo recibido:', {
		fieldname: file.fieldname,
		originalname: file.originalname,
		mimetype: file.mimetype,
		size: file.size
	});
	
	const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
	
	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		console.error('Tipo MIME rechazado:', file.mimetype);
		cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)`), false);
	}
};

const upload = multer({ 
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB máximo
		files: 1 // Solo un archivo
	}
});

/**
 * @route GET /api/estudiantes
 * @desc Obtiene todos los estudiantes
 * @query buscar - término de búsqueda (opcional)
 */
router.get('/', EstudianteController.obtenerTodos);

/**
 * @route GET /api/estudiantes/buscar
 * @desc Busca estudiantes por diferentes criterios
 * @query q - término de búsqueda (requerido)
 * @query tipo - tipo de búsqueda: 'cedula', 'nombre', 'id' o 'general' (opcional)
 */
router.get('/buscar', EstudianteController.buscar);

/**
 * @route GET /api/estudiantes/:id
 * @desc Obtiene un estudiante por ID
 */
router.get('/:id', EstudianteController.obtenerPorId);

/**
 * @route POST /api/estudiantes
 * @desc Crea un nuevo estudiante
 */
router.post('/', (req, res, next) => {
	upload.single('foto')(req, res, (err) => {
		if (err) {
			console.error('Error en multer (POST):', err);
			if (err instanceof multer.MulterError) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB.' });
				}
				return res.status(400).json({ error: `Error de multer: ${err.message}` });
			}
			return res.status(400).json({ error: err.message });
		}
		console.log('Multer procesado correctamente para POST');
		next();
	});
}, EstudianteController.crear);

/**
 * @route PUT /api/estudiantes/:id
 * @desc Actualiza un estudiante
 */
router.put('/:id', (req, res, next) => {
	upload.single('foto')(req, res, (err) => {
		if (err) {
			console.error('Error en multer (PUT):', err);
			if (err instanceof multer.MulterError) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB.' });
				}
				return res.status(400).json({ error: `Error de multer: ${err.message}` });
			}
			return res.status(400).json({ error: err.message });
		}
		console.log('Multer procesado correctamente para PUT');
		next();
	});
}, EstudianteController.actualizar);

/**
 * @route DELETE /api/estudiantes/:id
 * @desc Elimina un estudiante
 */
router.delete('/:id', EstudianteController.eliminar);

export default router;
