import express from "express";
import DonacionController from "../controllers/donacionController.js";
import DonacionModel, { Donacion } from "../models/donacionModel.js"; // correcto
const router = express.Router();
// Ruta de cálculo
router.post("/calcular", (req, res) => {
  try {
    const { euros, dolares, reales } = req.body;

    if ([euros, dolares, reales].some((v) => v == null || v < 0)) {
      return res
        .status(400)
        .json({ mensaje: "Los valores deben ser positivos y no nulos." });
    }

    const temp = new Donacion(0, euros, dolares, reales);
    const resultado = temp.calcularDistribucion();

    return res.status(200).json({
      mensaje: "Distribución calculada con éxito",
      resultado,
    });
  } catch (error) {
    console.error(" Error en /calcular:", error);
    res.status(500).json({ mensaje: "Error interno al calcular la donación" });
  }
});

// CRUD completo
router.post("/", DonacionController.crear);
router.get("/", DonacionController.obtenerTodas);
router.get("/:id", DonacionController.obtenerPorId);
router.put("/:id", DonacionController.actualizar);
router.delete("/:id", DonacionController.eliminar);

export default router;
