import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';

export const Estudiante = sequelize.define(
    'Estudiante', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        carrera: {
            type: DataTypes.STRING(100),
            allowNull: false,

    }
 },
    {
        tableName: 'estudiantes',
        timestamps: false,
    }

);