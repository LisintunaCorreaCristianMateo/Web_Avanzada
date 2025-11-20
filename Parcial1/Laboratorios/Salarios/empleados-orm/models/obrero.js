import {DataTypes,Model} from "sequelize"
import {sequelize} from "../config/database.js";

//crear clase base

export class Obrero extends Model{
    //metodo para calcular salaraio del obrero
    calcularSalario(){
        const horas = this.horasTrabajadas;
        //si trabajaa 40 horas o menos vale 20
        const horasNormales = Math.min(horas, 40);

        //si pasa de 40 horas, las extras valen 25
        const horasExtras = Math.max(horas - 40, 0);

        //calcular salario
        const pagoNormal = horasNormales * 20;
        const pagoExtra = horasExtras * 25;

        const total = pagoNormal + pagoExtra;
        return {total,pagoNormal,pagoExtra};
    }
}
//definir el modelo{ESTRUCTURA DE LA TABLA
Obrero.init(
{    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    nombre:{type:DataTypes.STRING(80),allowNull:false},
    horasTrabajadas:{type:DataTypes.INTEGER,allowNull:false},
},
{   sequelize,// para la conexion  a db
    modelName:"Obrero", //nombre del modelo
    timestamps:true //ver cuando se creo o actualizo
}

    
+
);