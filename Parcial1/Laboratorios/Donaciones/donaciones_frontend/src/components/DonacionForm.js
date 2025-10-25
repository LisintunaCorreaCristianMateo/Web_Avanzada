import React, { useState, useEffect } from "react";

function DonacionForm({ onGuardar, editDonacion, onCancelEdit }) {
  const [form, setForm] = useState({ euros: "", dolares: "", reales: "" });

  useEffect(() => {
    if (editDonacion) setForm(editDonacion);
  }, [editDonacion]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => v < 0)) {
      alert(" Los valores deben ser positivos");
      return;
    }
    onGuardar({
      euros: Number(form.euros),
      dolares: Number(form.dolares),
      reales: Number(form.reales),
    });
    setForm({ euros: "", dolares: "", reales: "" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <h2>{editDonacion ? " Editar Donación" : " Nueva Donación"}</h2>
      <input
        type="number"
        name="euros"
        placeholder="Euros"
        value={form.euros}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="dolares"
        placeholder="Dólares"
        value={form.dolares}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="reales"
        placeholder="Reales"
        value={form.reales}
        onChange={handleChange}
        required
      />
      <button type="submit">
        {editDonacion ? "Actualizar" : "Guardar"}
      </button>
      {editDonacion && (
        <button
          type="button"
          onClick={onCancelEdit}
          style={{ marginLeft: "10px" }}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

export default DonacionForm;
