import React from "react";

function DonacionesList({ donaciones, onEliminar, onEditar, onVer }) {
  return (
    <div>
      <h2> Donaciones Registradas</h2>
      {donaciones.length === 0 ? (
        <p>No hay donaciones registradas.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Euros</th>
              <th>Dólares</th>
              <th>Reales</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {donaciones.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.euros}</td>
                <td>{d.dolares}</td>
                <td>{d.reales}</td>
                <td>
                  <button onClick={() => onVer(d)}>Ver</button>{" "}
                  <button onClick={() => onEditar(d)}> Editar</button>{" "}
                  <button onClick={() => onEliminar(d.id)}> Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DonacionesList;
