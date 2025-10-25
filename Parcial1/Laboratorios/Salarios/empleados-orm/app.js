import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {sequelize} from "./config/database.js";

import obreroRoutes from "./routes/obreroRoutes.js";


dotenv.config();
const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (_req, res) => res.send("Servidor de salarios funcionando correctamente"));

// Registrar rutas
app.use("/api/obreros", obreroRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Crea tablas si no existen
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
    console.error("Detalles del error:", error);
  }
};

iniciarServidor();
