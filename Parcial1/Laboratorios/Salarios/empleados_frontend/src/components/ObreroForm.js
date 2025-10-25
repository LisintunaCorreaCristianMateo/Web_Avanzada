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
    <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>{editObrero ? " Editar Obrero" : " Registrar Nuevo Obrero"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            <strong>Nombre:</strong>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del obrero"
              style={{ marginLeft: "1rem", padding: "0.5rem", width: "300px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <strong>Horas Trabajadas:</strong>
            <input
              type="number"
              value={horasTrabajadas}
              onChange={(e) => setHorasTrabajadas(e.target.value)}
              placeholder="Horas trabajadas en la semana"
              min="0"
              style={{ marginLeft: "1rem", padding: "0.5rem", width: "300px" }}
            />
          </label>
        </div>

        <button type="+6" style={{ padding: "0.5rem 1.5rem", marginRight: "0.5rem", cursor: "pointer" }}>
          {editObrero ? "Actualizar" : "Guardar"}
        </button>

        {editObrero && (
          <button
            type="button"
            onClick={handleCancel}
            style={{ padding: "0.5rem 1.5rem", cursor: "pointer", backgroundColor: "#ccc" }}
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}

export default ObreroForm;
