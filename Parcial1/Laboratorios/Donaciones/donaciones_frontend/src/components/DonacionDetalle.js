import React from "react";

function DonacionDetalle({ detalle }) {
  return (
    <div style={{ marginTop: "2rem", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
      <h3> Detalle de la Donación #{detalle.id}</h3>
      <p><b>Total en Pesos Argentinos:</b> {detalle.totalPesos} ARS</p>
      <ul>
        <li> Centro de Salud (60%): {detalle.centroSalud} ARS</li>
        <li>Comedor Infantil (30%): {detalle.comedorNinos} ARS</li>
        <li> Gastos Administrativos (10%): {detalle.gastosAdministrativos} ARS</li>
      </ul>
    </div>
  );
}

export default DonacionDetalle;
