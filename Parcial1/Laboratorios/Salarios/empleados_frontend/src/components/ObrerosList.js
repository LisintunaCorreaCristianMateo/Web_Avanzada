import React from "react";

function ObrerosList({ obreros, onEliminar, onEditar, onVerSalario }) {
  if (obreros.length === 0) {
    return <p style={{ textAlign: "center", color: "#999" }}>No hay obreros registrados</p>;
  }

  return (
    <div>
      <h2> Lista de Obreros</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr >
            <th style={{ padding: "0.8rem", border: "1px " }}>ID</th>
            <th style={{ padding: "0.8rem", border: "1px " }}>Nombre</th>
            <th style={{ padding: "0.8rem", border: "1px " }}>Horas Trabajadas</th>
            <th style={{ padding: "0.8rem", border: "1px " }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {obreros.map((obrero) => (
            <tr key={obrero.id} style={{ textAlign: "center" }}>
              <td style={{ padding: "0.8rem", border: "1px " }}>{obrero.id}</td>
              <td style={{ padding: "0.8rem", border: "1px " }}>{obrero.nombre}</td>
              <td style={{ padding: "0.8rem", border: "1px " }}>{obrero.horasTrabajadas} hrs</td>
              <td style={{ padding: "0.8rem", border: "1px " }}>
                <button onClick={() => onVerSalario(obrero)}>
                  Ver Salario
                </button>
                <button onClick={() => onEditar(obrero)}>
                  Editar
                </button>
                <button onClick={() => onEliminar(obrero.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ObrerosList;
