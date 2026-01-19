/**
 * Archivo central para definir relaciones entre modelos
 * y exportarlos de manera unificada
 */
import { Usuario } from './usuarioModel.js';
import { Estudiante } from './estudianteModel.js';
import { Docente } from './docenteModel.js';
import { Asignatura } from './asignaturaModel.js';
import { Matricula } from './matriculaModel.js';
import { Evaluacion } from './evaluacionModel.js';
import { Actividad, Notificacion, Evento } from './actividadModel.js';

// ===== RELACIONES ENTRE MODELOS =====

// Docente ↔ Asignatura (1 a 1)
Docente.hasOne(Asignatura, {
  foreignKey: 'docente_id',
  as: 'asignatura'
});

Asignatura.belongsTo(Docente, {
  foreignKey: 'docente_id',
  as: 'docente'
});

// Estudiante ↔ Matricula (Muchos a Muchos a través de Matricula)
Estudiante.hasMany(Matricula, {
  foreignKey: 'estudiante_id',
  as: 'matriculas'
});

Matricula.belongsTo(Estudiante, {
  foreignKey: 'estudiante_id',
  as: 'estudiante'
});

// Asignatura ↔ Matricula
Asignatura.hasMany(Matricula, {
  foreignKey: 'asignatura_id',
  as: 'matriculas'
});

Matricula.belongsTo(Asignatura, {
  foreignKey: 'asignatura_id',
  as: 'asignatura'
});

// Matricula ↔ Evaluacion (Una matrícula puede tener muchas evaluaciones)
Matricula.hasMany(Evaluacion, {
  foreignKey: 'matricula_id',
  as: 'evaluaciones'
});

Evaluacion.belongsTo(Matricula, {
  foreignKey: 'matricula_id',
  as: 'matricula'
});



// Exportar todos los modelos
export {
  Usuario,
  Estudiante,
  Docente,
  Asignatura,
  Matricula,
  Evaluacion,
  Actividad,
  Notificacion,
  Evento
};
