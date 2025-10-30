//librerias

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// importaciones de configuracion y rutas
import { dbConnection } from "./config/database.js";
import estudianteRoutes from "./routes/estudianteRoutes.js";

//crear el servidor o inicializar express

const app = express();
app.use(cors());
app.use(express.json());

//conexion a la base de datos o rutas

app.use("/api/estudiantes", estudianteRoutes);

//puerto de escucha del servidor
const PORT = process.env.PORT || 3000;
await dbConnection();
// iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto" ${PORT}`);
});