import {DataTypes} from 'sequelize';
import {sequelize} from "../config/database.js";

export const Evento = sequelize.define('Evento', 
{

    id_evento:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    nombre:{type:DataTypes.STRING,allowNull:false},
    precioPersona:{type:DataTypes.FLOAT,allowNull:false}

},
{
    tableName:'eventos'
}
);