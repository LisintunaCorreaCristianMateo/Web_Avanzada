import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Matricula = sequelize.define('Matricula', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estudiante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estudiantes',
      key: 'id'
    }
  },
  asignatura_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'asignaturas',
      key: 'id'
    }
  },
  fecha_matricula: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  // El campo 'estado' fue removido: las matrículas se eliminan físicamente al borrarse
}, {
  tableName: 'matriculas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
