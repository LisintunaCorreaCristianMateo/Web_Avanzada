import express from "express";
import cors from "cors"; // Importa CORS
import donacionRoutes from "./routes/donacionRoutes.js";

const app = express();

app.use(cors()); // Permite peticiones desde React
app.use(express.json());

// Prefijo de rutas
app.use("/api/donaciones", donacionRoutes);

// Ruta raíz informativa
app.get("/", (req, res) => {
  res.send(" API Donaciones activa. Usa /api/donaciones en Postman.");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en puerto ${PORT}`));
