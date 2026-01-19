import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { dbConnection } from './src/config/database.js';
import { Usuario } from './src/models/usuarioModel.js';

async function crearAdmin() {
  try {
    // Conectar a la base de datos
    await dbConnection();

    // Verificar si ya existe el usuario admin
    const adminExistente = await Usuario.findOne({ where: { username: 'admin' } });
    
    if (adminExistente) {
      console.log('❌ El usuario admin ya existe');
      process.exit(0);
    }

    // Crear el hash de la contraseña
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario admin
    const admin = await Usuario.create({
      username: 'admin',
      password: hashedPassword,
      activo: true
    });

    console.log('✅ Usuario admin creado exitosamente');
    console.log('📧 Username: admin');
    console.log('🔑 Password: admin123');
    console.log(`🆔 ID: ${admin.id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    process.exit(1);
  }
}

crearAdmin();
