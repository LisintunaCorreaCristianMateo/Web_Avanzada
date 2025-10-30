import React, { useState, useEffect } from "react";
import ObreroForm from "./components/ObreroForm";
import ObrerosList from "./components/ObrerosList";
import SalarioDetalle from "./components/SalarioDetalle";
import * as obreroService from "./services/obrero";

function App() {
  const [obreros, setObreros] = useState([]);
  const [editObrero, setEditObrero] = useState(null);
  const [detalleSalario, setDetalleSalario] = useState(null);

  // Obtener todos los obreros del backend usando la capa de servicio
  const obtenerObreros = async () => {
    try {
      const data = await obreroService.obtenerTodosLosObreros();
      setObreros(data);
    } catch (error) {
      console.error("Error al obtener obreros:", error);
    }
  };

  useEffect(() => {
    obtenerObreros();
  }, []);

  // Crear o actualizar obrero usando la capa de servicio
  const guardarObrero = async (obrero) => {
    try {
      if (editObrero) {
        await obreroService.actualizarObrero(editObrero.id, obrero);
        alert("Obrero actualizado correctamente");
      } else {
        await obreroService.crearObrero(obrero);
        alert("Obrero registrado correctamente");
      }
      
      obtenerObreros();
      setEditObrero(null);
      setDetalleSalario(null);
    } catch (error) {
      console.error("Error al guardar obrero:", error);
      alert("Error al guardar el obrero");
    }
  };

  // Eliminar obrero usando la capa de servicio
  const eliminarObrero = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este obrero?")) return;
    try {
      await obreroService.eliminarObrero(id);
      obtenerObreros();
      setDetalleSalario(null);
      alert("Obrero eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar obrero:", error);
      alert("Error al eliminar el obrero");
    }
  };

  // Ver salario calculado usando la capa de servicio
  const verSalario = async (obrero) => {
    try {
      const data = await obreroService.calcularSalarioObrero(obrero.id);
      
      setDetalleSalario({
        id: data.id,
        nombre: data.nombre,
        horasTrabajadas: data.horasTrabajadas,
        pagoNormal: data.pagoNormal,
        pagoExtra: data.pagoExtra,
        total: data.total,
      });
    } catch (error) {
      console.error("Error al calcular salario:", error);
      alert("No se pudo obtener el cálculo del salario.");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center text-primary mb-4">
        <i className="bi bi-cash-stack"></i> Sistema de Gestión de Salarios de Obreros
      </h1>

      <ObreroForm
        onGuardar={guardarObrero}
        editObrero={editObrero}
        onCancelEdit={() => setEditObrero(null)}
      />

      <hr className="my-4" />

      <ObrerosList
        obreros={obreros}
        onEliminar={eliminarObrero}
        onEditar={setEditObrero}
        onVerSalario={verSalario}
      />

      {/* Mostrar detalle del salario solo si existe */}
      {detalleSalario && <SalarioDetalle detalle={detalleSalario} />}
    </div>
  );
}

export default App;
