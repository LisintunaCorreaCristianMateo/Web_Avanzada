const Cliente = require('../models/Cliente');
const clienteService = require('../services/cliente.service');
class ClienteController {
  static calcular(req, res) {
    try {
      const { saldoAnterior, montoCompras, pagoRealizado } = req.body;

      const cliente = new Cliente(saldoAnterior, montoCompras, pagoRealizado);

      const resultado = clienteService.calcularCliente(cliente);

      res.json({
        ok: true,
        data: resultado
      });

    } catch (err) {
      console.error("Error calcular:", err);
      res.status(500).json({
        ok: false,
        msg: "Error interno al calcular datos del cliente"
      });
    }
  }
}

module.exports = ClienteController;
