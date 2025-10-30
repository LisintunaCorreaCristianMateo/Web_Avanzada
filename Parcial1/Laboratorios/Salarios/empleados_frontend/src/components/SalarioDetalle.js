import React from "react";

function SalarioDetalle({ detalle }) {
  return (
    <div className="card border-success shadow mt-4">
      <div className="card-header bg-success text-white">
        <h2 className="card-title mb-0">💰 Detalle del Salario Semanal</h2>
      </div>
      <div className="card-body">
        <div className="fs-5 lh-lg">
          <p>
            <strong>👤 Obrero:</strong> {detalle.nombre}
          </p>
          <p>
            <strong>🕒 Horas Trabajadas:</strong> {detalle.horasTrabajadas} horas
          </p>
          
          <hr className="my-3" />
          
          <p>
            <strong>💵 Pago por horas normales:</strong>{" "}
            <span className="text-primary">${detalle.pagoNormal.toFixed(2)}</span>
          </p>
          <p>
            <strong>⏰ Pago por horas extras:</strong>{" "}
            <span className="text-warning">${detalle.pagoExtra.toFixed(2)}</span>
          </p>
          
          <div className="alert alert-success mt-3 text-center fs-4">
            <strong>💰 TOTAL A PAGAR:</strong>{" "}
            <span className="fs-3 fw-bold">${detalle.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalarioDetalle;
