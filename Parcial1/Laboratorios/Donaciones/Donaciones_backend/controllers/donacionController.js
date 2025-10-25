import DonacionModel from "../models/donacionModel.js";

class DonacionController {
  // Crear donación
  static crear(req, res) {
    const { euros, dolares, reales } = req.body;
    if ([euros, dolares, reales].some(v => v < 0)) {
      return res.status(400).json({ mensaje: "Los valores deben ser positivos." });
    }
    const nueva = DonacionModel.crear(euros, dolares, reales);
    res.status(201).json({ mensaje: "Donación creada correctamente", donacion: nueva });
  }

  // Obtener todas
  static obtenerTodas(req, res) {
    const donaciones = DonacionModel.obtenerTodas();
    res.json(donaciones);
  }

  // Obtener por ID
  static obtenerPorId(req, res) {
    const donacion = DonacionModel.obtenerPorId(req.params.id);
    if (!donacion) {
      return res.status(404).json({ mensaje: "Donación no encontrada" });
    }
    res.json(donacion);
  }

  // Actualizar
  static actualizar(req, res) {
    const donacion = DonacionModel.actualizar(req.params.id, req.body);
    if (!donacion) {
      return res.status(404).json({ mensaje: "Donación no encontrada" });
    }
    res.json({ mensaje: "Donación actualizada", donacion });
  }

  // Eliminar
  static eliminar(req, res) {
    const eliminada = DonacionModel.eliminar(req.params.id);
    if (!eliminada) {
      return res.status(404).json({ mensaje: "Donación no encontrada" });
    }
    res.json({ mensaje: "Donación eliminada", eliminada });
  }
}

export default DonacionController;
