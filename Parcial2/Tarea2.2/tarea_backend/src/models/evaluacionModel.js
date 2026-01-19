import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Evaluacion = sequelize.define('Evaluacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricula_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'matriculas',
      key: 'id'
    },
    comment: 'Relación con la matrícula del estudiante en la asignatura'
  },
  parcial: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 3
    },
    comment: 'Número de parcial (1, 2 o 3). Cada parcial vale 14 puntos'
  },
  tipo_evaluacion: {
    type: DataTypes.ENUM('tarea','informe','leccion','examen'),
    allowNull: false
  },
  nota: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 20
    },
    comment: 'Nota de 0 a 20 puntos'
  },
  porcentaje: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    },
    comment: 'Porcentaje de peso de esta evaluación dentro del parcial'
  },
  nota_ponderada: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Nota multiplicada por el porcentaje (calculada automáticamente)'
  },
  fecha_evaluacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'evaluaciones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeSave: async (evaluacion) => {
      // Calcular nota ponderada automáticamente
      if (evaluacion.nota !== null && evaluacion.porcentaje !== null) {
        evaluacion.nota_ponderada = (evaluacion.nota * evaluacion.porcentaje) / 100;
      }
    }
  }
});

// Las relaciones se definen en src/models/index.js
