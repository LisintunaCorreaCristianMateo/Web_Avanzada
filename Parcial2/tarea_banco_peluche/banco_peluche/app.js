import express from "express";
import cors from "cors";
import clienteRoutes from "./routes/cliente.routes.js"
import connectDB from "./config/database.js"
import ClienteController from "./controllers/cliente.controller.js";
import dotenv from "dotenv";
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
//ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor Banco peluche funcionando correctamente");
});

// Rutas base
app.use('/api/clientes', clienteRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor Banco peluche escuchando en http://localhost:${PORT}`);
});
