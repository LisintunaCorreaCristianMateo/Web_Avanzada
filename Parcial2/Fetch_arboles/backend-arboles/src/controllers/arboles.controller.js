// src/controllers/arboles.controller.js

const { preciosArboles, calcularTotalCompra } = require("../models/arboles.model");

// GET /api/arboles/precios
function obtenerPrecios(req, res) {
  res.json({
    ok: true,
    data: preciosArboles
  });
}

// POST /api/arboles/calcular
function calcularTotal(req, res) {
  try {
    const { paltos = 0, limones = 0, chirimoyos = 0 } = req.body;

    // Validaciones simples
    if (paltos < 0 || limones < 0 || chirimoyos < 0) {
      return res.status(400).json({
        ok: false,
        message: "Las cantidades no pueden ser negativas."
      });
    }

    const resultado = calcularTotalCompra({ paltos, limones, chirimoyos });

    res.json({
      ok: true,
      data: resultado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor.",
      error: error.message
    });
  }
}

// GET /api/arboles/descargar (opcional - si se quiere hacer desde el backend)
function descargarJSON(req, res) {
  try {
    const { paltos = 0, limones = 0, chirimoyos = 0 } = req.query;

    if (paltos < 0 || limones < 0 || chirimoyos < 0) {
      return res.status(400).json({
        ok: false,
        message: "Las cantidades no pueden ser negativas."
      });
    }

    const resultado = calcularTotalCompra({ paltos, limones, chirimoyos });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="calculo-arboles-${Date.now()}.json"`);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error al generar el archivo.",
      error: error.message
    });
  }
}

module.exports = {
  obtenerPrecios,
  calcularTotal,
  descargarJSON
};
