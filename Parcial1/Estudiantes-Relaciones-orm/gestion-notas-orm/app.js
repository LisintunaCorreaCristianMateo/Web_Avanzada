//librerias

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// importaciones de configuracion y rutas
import { sequelize, dbConnection } from "./src/config/database.js";
import estudianteRoutes from "./src/routes/estudianteRoutes.js";
import notasRoutes from "./src/routes/notaRoutes.js";

//crear el servidor o inicializar express

const app = express();
app.use(cors());
app.use(express.json());

//conexion a la base de datos o rutas

app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/notas", notasRoutes);

//puerto de escucha del servidor
const PORT = process.env.PORT || 3000;
await dbConnection();
if (process.env.NODE_ENV !== "production") {
    try {
        await sequelize.sync({ alter: true }); // crea/ajusta tablas según los modelos
        console.log("Tablas sincronizadas con la base de datos");
    } catch (err) {
        console.error("Error al sincronizar tablas:", err.message);
    }
}
// iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});