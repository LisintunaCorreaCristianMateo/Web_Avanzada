const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");

const app = express();

// Para permitir JSON en peticiones
app.use(cors());
app.use(express.json());

// Rutas del backend
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Arrancar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});