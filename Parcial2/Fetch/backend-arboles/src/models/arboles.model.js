// src/models/arboles.model.js

// Datos estáticos (simulan una base de datos)
const preciosArboles = {
  paltos:   { precio: 1200, descuento100: 0.10,  descuento300: 0.18 },
  limones:  { precio: 1000, descuento100: 0.125, descuento300: 0.20 },
  chirimoyos: { precio: 980, descuento100: 0.145, descuento300: 0.19 }
};

// Función de apoyo para calcular subtotal con descuentos
function calcularSubtotal(cantidad, tipo) {
  if (!preciosArboles[tipo]) {
    throw new Error(`Tipo de árbol no válido: ${tipo}`);
  }

  const precioUnit = preciosArboles[tipo].precio;
  let descuento = 0;

  if (cantidad >= 100 && cantidad <= 300) {
    descuento = preciosArboles[tipo].descuento100;
  } else if (cantidad > 300) {
    descuento = preciosArboles[tipo].descuento300;
  }

  const subtotalBruto = cantidad * precioUnit;
  const rebaja = subtotalBruto * descuento;
  const subtotalNeto = subtotalBruto - rebaja;

  return {
    cantidad,
    precioUnit,
    descuentoAplicado: descuento,
    subtotalBruto,
    rebaja,
    subtotalNeto
  };
}

// Función principal de negocio para calcular total de la compra
function calcularTotalCompra({ paltos = 0, limones = 0, chirimoyos = 0 }) {
  const IVA = 0.15;

  const detallePaltos     = calcularSubtotal(paltos, "paltos");
  const detalleLimones    = calcularSubtotal(limones, "limones");
  const detalleChirimoyos = calcularSubtotal(chirimoyos, "chirimoyos");

  const totalArboles = paltos + limones + chirimoyos;

  let subtotalTotal =
    detallePaltos.subtotalNeto +
    detalleLimones.subtotalNeto +
    detalleChirimoyos.subtotalNeto;

  let rebajaAdicional = 0;
  if (totalArboles > 1000) {
    rebajaAdicional = subtotalTotal * 0.15; // 15% adicional
    subtotalTotal = subtotalTotal - rebajaAdicional;
  }

  const ivaCalculado = subtotalTotal * IVA;
  const totalPagar = subtotalTotal + ivaCalculado;

  return {
    preciosArboles,
    totalArboles,
    detalle: {
      paltos: detallePaltos,
      limones: detalleLimones,
      chirimoyos: detalleChirimoyos
    },
    rebajaAdicional,
    subtotalConDescuentos: subtotalTotal,
    iva: ivaCalculado,
    totalPagar
  };
}

// Exportar funciones que usará el controlador
module.exports = {
  preciosArboles,
  calcularTotalCompra
};
