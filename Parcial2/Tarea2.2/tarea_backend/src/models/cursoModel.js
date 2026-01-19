import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Curso = sequelize.define('Curso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  paralelo: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  nivel: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cursos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
