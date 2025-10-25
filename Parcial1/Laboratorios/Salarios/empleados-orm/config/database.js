//Configurar el Sequelize prar conectar mysql
import { Sequelize } from "sequelize";//para mysql
import dotenv from "dotenv";//trabaja coon las variables de entorno

//cargar variables de .env

dotenv.config();
//crear conexion con db

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false,
        timezone: "-05:00", // Zona horaria de Ecuador (UTC-5)
        dialectOptions: {
            timezone: "-05:00"
        }
    }
);
