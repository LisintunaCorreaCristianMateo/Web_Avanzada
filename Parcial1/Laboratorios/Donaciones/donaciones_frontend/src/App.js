import React, { useState, useEffect } from "react";
import DonacionForm from "./components/DonacionForm";
import DonacionesList from "./components/DonacionesList";
import DonacionDetalle from "./components/DonacionDetalle";

function App() {
  const [donaciones, setDonaciones] = useState([]);
  const [editDonacion, setEditDonacion] = useState(null);
  const [detalle, setDetalle] = useState(null);

  // Obtener todas las donaciones del backend
  const obtenerDonaciones = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/donaciones");
      const data = await res.json();
      setDonaciones(data);
    } catch (error) {
      console.error("Error al obtener donaciones:", error);
    }
  };

  useEffect(() => {
    obtenerDonaciones();
  }, []);

  // Crear o actualizar donación
  const guardarDonacion = async (donacion) => {
    const metodo = editDonacion ? "PUT" : "POST";
    const url = editDonacion
      ? `http://localhost:3000/api/donaciones/${editDonacion.id}`
      : "http://localhost:3000/api/donaciones";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donacion),
      });

      if (res.ok) {
        obtenerDonaciones();
        setEditDonacion(null);
        setDetalle(null); // Limpia detalle
      }
    } catch (error) {
      console.error("Error al guardar donación:", error);
    }
  };

  // Eliminar donación
  const eliminarDonacion = async (id) => {
    if (!window.confirm("¿Eliminar esta donación?")) return;
    try {
      await fetch(`http://localhost:3000/api/donaciones/${id}`, {
        method: "DELETE",
      });
      obtenerDonaciones();
      setDetalle(null); // Limpia detalle
    } catch (error) {
      console.error("Error al eliminar donación:", error);
    }
  };

  // Ver detalle (solicita al backend la conversión y distribución)
  const verDetalle = async (donacion) => {
    try {
      const res = await fetch("http://localhost:3000/api/donaciones/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          euros: donacion.euros,
          dolares: donacion.dolares,
          reales: donacion.reales,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.resultado) {
        alert("Error al obtener detalle");
        return;
      }

      // Asignar detalle
      setDetalle({
        id: donacion.id,
        ...data.resultado,
      });
    } catch (error) {
      console.error("Error al ver detalle:", error);
      alert(" No se pudo obtener el detalle de la donación.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1> Sistema de Donaciones</h1>

      <DonacionForm
        onGuardar={guardarDonacion}
        editDonacion={editDonacion}
        onCancelEdit={() => setEditDonacion(null)}
      />

      <hr />

      <DonacionesList
        donaciones={donaciones}
        onEliminar={eliminarDonacion}
        onEditar={setEditDonacion}
        onVer={verDetalle}
      />

      {/* Mostrar detalle solo si existe */}
      {detalle && detalle.totalPesos && <DonacionDetalle detalle={detalle} />}
    </div>
  );
}

export default App;
