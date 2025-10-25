import React from "react";

function SalarioDetalle({ detalle }) {
  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        border: "2px solid #000000ff",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ color: "#476849ff" }}> Detalle del Salario Semanal</h2>
      
      <div style={{ fontSize: "1.1rem", lineHeight: "2" }}>
        <p>
          <strong> Obrero:</strong> {detalle.nombre}
        </p>
        <p>
          <strong> Horas Trabajadas:</strong> {detalle.horasTrabajadas} horas
        </p>
        
        <hr />
        
        <p>
          <strong> Pago por horas normales :</strong> ${detalle.pagoNormal.toFixed(2)}
        </p>
        <p>
          <strong> Pago por horas extras:</strong> ${detalle.pagoExtra.toFixed(2)}
        </p>
        
  
        <p style={{ fontSize: "1.3rem",textAlign: "center" }}>
          <strong> TOTAL A PAGAR:</strong> <span style={{ fontSize: "1.5rem" }}>${detalle.total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

export default SalarioDetalle;
