import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar configuración de base de datos
import { dbConnection } from './src/config/database.js';

// Importar rutas
import authRoutes from './src/routes/authRoutes.js';
import estudianteRoutes from './src/routes/estudianteRoutes.js';
import docenteRoutes from './src/routes/docenteRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import asignaturaRoutes from './src/routes/asignaturaRoutes.js';
import evaluacionRoutes from './src/routes/evaluacionRoutes.js';
import matriculaRoutes from './src/routes/matriculaRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (para las fotos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/asignaturas', asignaturaRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);
app.use('/api/matriculas', matriculaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API Sistema de Gestión Académica',
    version: '2.0.0 - ORM',
    endpoints: {
      auth: '/api/auth',
      estudiantes: '/api/estudiantes',
      docentes: '/api/docentes',
      dashboard: '/api/dashboard',
      asignaturas: '/api/asignaturas',
      evaluaciones: '/api/evaluaciones',
      matriculas: '/api/matriculas'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor y conectar a la base de datos
const iniciarServidor = async () => {
  try {
    // Conectar a la base de datos
    await dbConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📝 API lista para recibir peticiones`);
      console.log(`💾 Base de datos conectada con Sequelize ORM`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();

