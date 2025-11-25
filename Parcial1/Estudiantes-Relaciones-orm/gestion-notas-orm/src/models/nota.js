import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Estudiante } from "./estudiante.js";

export const Nota = sequelize.define("Nota", {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        asignatura: { type: DataTypes.STRING(100), allowNull: false },
        nota1: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0, max: 20 } },
        nota2: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0, max: 20 } },
        nota3: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0, max: 20 } },
        promedio: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0, max: 20 },
        categoria: { type: DataTypes.STRING(30), allowNull: false }
    }
},
{
    tableName: "notas",
    timestamps: false
}
);

//relaciones: un estudiante puede tener muchas notas
Estudiante.hasMany(Nota, { foreignKey: "estudianteId", onDelete: "CASCADE" });
Nota.Estudiante = Nota.belongsTo(Estudiante, { foreignKey: "estudianteId" });//belongsto para clave foranea que apunte a estudiante
