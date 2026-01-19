//servicio api
const BASE_URL = "https://dummyjson.com/products";

//get
export  const obtenerProductos=async()=> {
  try {
    const resp = await fetch(BASE_URL);
    const data = await resp.json();
    return data.products; // la api me retorna un objeto con la propiedad products
  } catch (error) {
    console.log("Error fetching products:", error);
    throw error;
  }
}

//post
export const crearProducto=async(product)=> {
  try {
    const resp = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    
    return await resp.json();
  } catch (error) {
    console.log("Error fetching products:", error);
    throw error;
  }
}

//put - actualizar
export const actualizarProducto = async (id, product) => {
  try {
    const resp = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    return await resp.json();
  } catch (error) {
    console.log("Error al actualizar producto:", error);
    throw error;
  }
}

//delete - eliminar
export const eliminarProducto = async (id) => {
  try {
    const resp = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return await resp.json();
  } catch (error) {
    console.log("Error al eliminar producto:", error);
    throw error;
  }
}