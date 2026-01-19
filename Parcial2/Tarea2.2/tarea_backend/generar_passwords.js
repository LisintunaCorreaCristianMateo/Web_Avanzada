import bcrypt from 'bcryptjs';

/**
 * Script para generar passwords hasheados para los usuarios
 */

const usuarios = [
  { username: 'maria.gonzalez', password: '1234567890' },
  { username: 'carlos.ramirez', password: '0987654321' },
  { username: 'ana.martinez', password: '1122334455' },
  { username: 'luis.torres', password: '5544332211' },
  { username: 'juan.perez', password: '1750123456' },
  { username: 'maria.lopez', password: '1750234567' },
  { username: 'carlos.sanchez', password: '1750345678' },
  { username: 'andrea.gomez', password: '1750456789' },
  { username: 'diego.morales', password: '1750567890' },
  { username: 'sofia.rodriguez', password: '1750678901' },
  { username: 'alejandro.hernandez', password: '1750789012' },
  { username: 'valentina.castro', password: '1750890123' }
];

async function generarPasswords() {
  console.log('-- PASSWORDS HASHEADOS PARA SQL --\n');
  
  for (const usuario of usuarios) {
    const hash = await bcrypt.hash(usuario.password, 10);
    console.log(`-- ${usuario.username} (password: ${usuario.password})`);
    console.log(`'${hash}',\n`);
  }
  
  console.log('\n✅ Copia estos hashes y reemplázalos en el archivo datos_prueba.sql');
  console.log('   en las líneas correspondientes de INSERT INTO usuarios');
}

generarPasswords();
