import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'escuela_gestion',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || null,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a MySQL exitosa');
    
    // Importar todos los modelos y sus relaciones
    await import('../models/index.js');
    
    // Sincronizar tablas recreándolas desde cero
    await sequelize.sync({ alter: false  });
    console.log('✓ Todas las tablas sincronizadas correctamente');
    console.log('  - Usuarios');
    console.log('  - Estudiantes');
    console.log('  - Docentes');
    console.log('  - Asignaturas');
    console.log('  - Matriculas');
    console.log('  - Evaluaciones');
    console.log('  - Actividades, Notificaciones, Eventos');
  } catch (error) {
    console.error('✗ Error de conexión a DB:', error.message);
    throw error;
  }
};
