import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import {Cliente} from "./clienteModel.js";
import {Evento} from "./eventoModel.js";

export const Factura = sequelize.define("Factura", 
    {
        id_factura:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
        fecha:{type:DataTypes.DATE,allowNull:false},
        Npersonas:{type:DataTypes.INTEGER,allowNull:false},
        total:{type:DataTypes.FLOAT,allowNull:false}

    },
    {tableName:'facturas'

    }
);

// Relaciones

//cliente(1)<-->(m)Factura(m)<---->(1)evento

Cliente.hasMany(Factura, { foreignKey: "clienteId", onDelete: "CASCADE" });
Factura.belongsTo(Cliente, { foreignKey: "clienteId" });

Evento.hasMany(Factura, { foreignKey: "eventoId", onDelete: "CASCADE" });
Factura.belongsTo(Evento, { foreignKey: "eventoId" });