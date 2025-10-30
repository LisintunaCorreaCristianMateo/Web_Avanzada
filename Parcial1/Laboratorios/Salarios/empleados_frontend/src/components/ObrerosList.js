import React from "react";

function ObrerosList({ obreros, onEliminar, onEditar, onVerSalario }) {
  if (obreros.length === 0) {
    return (
      <div className="alert alert-info text-center" role="alert">
        No hay obreros registrados
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3">📋 Lista de Obreros</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Horas Trabajadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obreros.map((obrero) => (
              <tr key={obrero.id}>
                <td>{obrero.id}</td>
                <td>{obrero.nombre}</td>
                <td>{obrero.horasTrabajadas} hrs</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      onClick={() => onVerSalario(obrero)}
                      className="btn btn-info btn-sm"
                      title="Ver Salario"
                    >
                      💵 Ver Salario
                    </button>
                    <button
                      onClick={() => onEditar(obrero)}
                      className="btn btn-warning btn-sm"
                      title="Editar"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => onEliminar(obrero.id)}
                      className="btn btn-danger btn-sm"
                      title="Eliminar"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ObrerosList;
