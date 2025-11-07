import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Estudiante = sequelize.define(
    "Estudiante",
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        nombre: {type: DataTypes.STRING(60), allowNull: false},
        carrera: {type: DataTypes.STRING(60), allowNull: false},
    },
    {
        tableName: "estudiantes", timestamps: false,
    }
)