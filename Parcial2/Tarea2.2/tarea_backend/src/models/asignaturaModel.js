import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Asignatura = sequelize.define('Asignatura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nrc: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  creditos: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  nivel: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  docente_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'docentes',
      key: 'id'
    }
  }
}, {
  tableName: 'asignaturas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
