import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Actividad = sequelize.define('Actividad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'actividades',
  timestamps: true,
  createdAt: 'fecha',
  updatedAt: false
});

export const Notificacion = sequelize.define('Notificacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notificaciones',
  timestamps: true,
  createdAt: 'fecha',
  updatedAt: false
});

export const Evento = sequelize.define('Evento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'eventos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});
