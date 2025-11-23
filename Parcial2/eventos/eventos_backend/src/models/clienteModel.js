import {DataTypes} from 'sequelize';
import {sequelize} from "../config/database.js";

export const Cliente = sequelize.define('Cliente', {
    id_cliente:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
   nombre:{type:DataTypes.STRING,allowNull:false},
   cedula:{type:DataTypes.STRING,allowNull:false,unique:true}
},
{
    tableName:'clientes'
}
);





