import React, { useState, useEffect } from "react";

function ObreroForm({ onGuardar, editObrero, onCancelEdit }) {
  const [nombre, setNombre] = useState("");
  const [horasTrabajadas, setHorasTrabajadas] = useState("");

  useEffect(() => {
    if (editObrero) {
      setNombre(editObrero.nombre);
      setHorasTrabajadas(editObrero.horasTrabajadas);
    }
  }, [editObrero]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !horasTrabajadas) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (horasTrabajadas < 0) {
      alert("Las horas trabajadas no pueden ser negativas");
      return;
    }

    onGuardar({ nombre, horasTrabajadas: parseInt(horasTrabajadas) });

    // Limpiar formulario
    setNombre("");
    setHorasTrabajadas("");
  };

  const handleCancel = () => {
    setNombre("");
    setHorasTrabajadas("");
    onCancelEdit();
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-3">
          {editObrero ? "✏️ Editar Obrero" : "➕ Registrar Nuevo Obrero"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label fw-bold">
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del obrero"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="horas" className="form-label fw-bold">
              Horas Trabajadas:
            </label>
            <input
              type="number"
              id="horas"
              className="form-control"
              value={horasTrabajadas}
              onChange={(e) => setHorasTrabajadas(e.target.value)}
              placeholder="Horas trabajadas en la semana"
              min="0"
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {editObrero ? "Actualizar" : "Guardar"}
            </button>

            {editObrero && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ObreroForm;
