// Capa de servicio para las peticiones API de Obreros
const API_URL = "http://localhost:3000/api/obreros";

// Obtener todos los obreros
export const obtenerTodosLosObreros = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener los obreros");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerTodosLosObreros:", error);
    throw error;
  }
};

// Obtener un obrero por ID
export const obtenerObreroPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener el obrero");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerObreroPorId:", error);
    throw error;
  }
};

// Crear un nuevo obrero
export const crearObrero = async (obrero) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obrero),
    });
    if (!response.ok) {
      throw new Error("Error al crear el obrero");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en crearObrero:", error);
    throw error;
  }
};

// Actualizar un obrero existente
export const actualizarObrero = async (id, obrero) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obrero),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el obrero");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarObrero:", error);
    throw error;
  }
};

// Eliminar un obrero
export const eliminarObrero = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el obrero");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en eliminarObrero:", error);
    throw error;
  }
};

// Calcular salario semanal de un obrero
export const calcularSalarioObrero = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/salario`);
    if (!response.ok) {
      throw new Error("Error al calcular el salario");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en calcularSalarioObrero:", error);
    throw error;
  }
};
