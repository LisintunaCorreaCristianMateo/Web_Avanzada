import ClienteMongo from "../models/ClienteMongo.js";

class ClienteMongoService {
  
  // Guardar cliente en la base de datos
  async guardarCliente(datosCliente) {
    try {
      const clienteGuardado = await ClienteMongo.create(datosCliente);
      return clienteGuardado;
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      throw error;
    }
  }

  // Obtener todos los clientes
  async obtenerTodos() {
    try {
      const clientes = await ClienteMongo.find().sort({ fechaRegistro: -1 });
      return clientes;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  }

  // Obtener un cliente por ID
  async obtenerPorId(id) {
    try {
      const cliente = await ClienteMongo.findById(id);
      return cliente;
    } catch (error) {
      console.error("Error al obtener cliente por ID:", error);
      throw error;
    }
  }

  // Calcular estadísticas
  async calcularEstadisticas() {
    try {
      const stats = await ClienteMongo.aggregate([
        {
          $group: {
            _id: null,
            totalClientes: { $sum: 1 },
            morosos: { $sum: { $cond: ["$esMoroso", 1, 0] } },
            promedioSaldoActual: { $avg: "$saldoActual" },
            totalmultas: { $sum: "$multa" }
          }
        }
      ]);
      return stats[0] || {};
    } catch (error) {
      console.error("Error al calcular estadísticas:", error);
      throw error;
    }
  }
}

export default new ClienteMongoService();
