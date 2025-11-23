import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    
        {
            host:process.env.DB_IP,
            port:process.env.DB_PORT,
            dialect:process.env.DB_DIALECT
        }
);  

export const dbConnection = async()=>{
    try{
        await sequelize.authenticate();
        console.log("conexion a sql exitosa");
    }
    catch(error){
        console.log("error de conexion a DB")
    }
}