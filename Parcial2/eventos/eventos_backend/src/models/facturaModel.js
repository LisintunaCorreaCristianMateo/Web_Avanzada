import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

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