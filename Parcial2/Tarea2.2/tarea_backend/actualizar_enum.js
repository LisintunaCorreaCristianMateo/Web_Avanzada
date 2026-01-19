import { sequelize } from './src/config/database.js';

async function actualizarEnum() {
  try {
    console.log('🔄 Actualizando tipo ENUM de tipo_evaluacion...');
    
    // Paso 1: Verificar valores actuales
    const [results] = await sequelize.query(`
      SELECT DISTINCT tipo_evaluacion FROM evaluaciones;
    `);
    console.log('📊 Valores actuales en la tabla:', results);
    
    // Paso 2: Cambiar temporalmente la columna a VARCHAR para poder hacer las actualizaciones
    await sequelize.query(`
      ALTER TABLE evaluaciones MODIFY COLUMN tipo_evaluacion VARCHAR(50) NOT NULL;
    `);
    console.log('✅ Columna convertida temporalmente a VARCHAR');
    
    // Paso 3: Actualizar todos los valores a minúsculas
    await sequelize.query(`UPDATE evaluaciones SET tipo_evaluacion = 'tarea' WHERE UPPER(tipo_evaluacion) = 'TAREA1';`);
    await sequelize.query(`UPDATE evaluaciones SET tipo_evaluacion = 'tarea' WHERE UPPER(tipo_evaluacion) = 'TAREA';`);
    await sequelize.query(`UPDATE evaluaciones SET tipo_evaluacion = 'informe' WHERE UPPER(tipo_evaluacion) = 'INFORME';`);
    await sequelize.query(`UPDATE evaluaciones SET tipo_evaluacion = 'leccion' WHERE UPPER(tipo_evaluacion) = 'LECCION';`);
    await sequelize.query(`UPDATE evaluaciones SET tipo_evaluacion = 'examen' WHERE UPPER(tipo_evaluacion) = 'EXAMEN';`);
    console.log('✅ Valores convertidos a minúsculas');
    
    // Paso 4: Aplicar el nuevo ENUM
    await sequelize.query(`
      ALTER TABLE evaluaciones 
      MODIFY COLUMN tipo_evaluacion ENUM('tarea','informe','leccion','examen') NOT NULL;
    `);
    
    console.log('✅ ENUM actualizado correctamente');
    console.log('   Valores permitidos: tarea, informe, leccion, examen');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar ENUM:', error.message);
    process.exit(1);
  }
}

actualizarEnum();
