//conexion de sequelize a la base de datos
//Pruebas de autenticacion
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || "mysql",
        logging: false

    }

);

//probar conexion
export const dbConnection = async () => {
    try{
        await sequelize.authenticate();
        console.log("Conexion a MYSQL exitosa");
    }catch(err){
        console.error("No se pudo conectar a MYSQL:", err.message);
    }
}