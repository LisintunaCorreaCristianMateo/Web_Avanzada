import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Docente = sequelize.define('Docente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cedula: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  foto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  carga_horaria: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'licencia'),
    defaultValue: 'activo'
  }
}, {
  tableName: 'docentes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
