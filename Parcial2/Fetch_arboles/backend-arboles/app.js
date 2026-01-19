// app.js

const express = require("express");
const cors = require("cors");
const arbolesRoutes = require("./src/routes/arboles.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Para leer JSON en req.body

// Rutas base
app.use("/api/arboles", arbolesRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Criadero de Árboles funcionando");
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
