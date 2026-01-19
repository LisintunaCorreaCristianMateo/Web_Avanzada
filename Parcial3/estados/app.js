import express from "express";
import cors from "cors";
import productoRoutes from "./routers/productoRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Montar routers
app.use('/api/productos', productoRoutes);

// Ruta raíz informativa
app.get("/", (req, res) => {
  res.send("API de prueba de estados HTTP. Usa /status/* y /api/productos en Postman.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en puerto ${PORT}`));
