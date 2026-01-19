// src/App.js
import { useEffect, useState } from "react";
import ProductForm from "./components/productFrom";
import ProductList from "./components/productList";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "./services/productServices";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [siguienteId, setSiguienteId] = useState(1000); // IDs locales empiezan en 1000

  // Filtrar productos según la búsqueda (por título o ID)
  const productosFiltrados = productos.filter(p => 
    p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.id.toString().includes(busqueda)
  );

  // useEffect: se ejecuta una sola vez al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []); // [] → solo una vez (como componentDidMount)

  //  Evento que viene del hijo ProductForm
  async function handleCrear(productoNuevo) {
    try {
      // Crear producto local con ID temporal
      const productoLocal = {
        ...productoNuevo,
        id: siguienteId,
        isLocal: true // Marcador para identificar productos locales
      };

      // Agregar el producto local al inicio de la lista
      setProductos([productoLocal, ...productos]);
      setSiguienteId(siguienteId + 1);

      // Opcional: intentar crear en la API en segundo plano (no afecta el flujo)
      try {
        await crearProducto(productoNuevo);
      } catch (error) {
        console.log("La API no persistió el producto (es normal con DummyJSON)");
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  }

  // Actualizar producto
  async function handleActualizar(id, productoActualizado) {
    try {
      // Encontrar el producto
      const producto = productos.find(p => p.id === id);

      if (producto && producto.isLocal) {
        // Si es un producto local, actualizar solo en el estado
        setProductos(productos.map(p => 
          p.id === id ? { ...p, ...productoActualizado } : p
        ));
      } else {
        // Si es de la API, intentar actualizar en la API
        const actualizado = await actualizarProducto(id, productoActualizado);
        
        // Actualizar en el estado
        setProductos(productos.map(p => 
          p.id === id ? actualizado : p
        ));
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      // Si falla la API, actualizar localmente de todas formas
      setProductos(productos.map(p => 
        p.id === id ? { ...p, ...productoActualizado } : p
      ));
    }
  }

  // Eliminar producto
  async function handleEliminar(id) {
    try {
      const producto = productos.find(p => p.id === id);

      if (producto && !producto.isLocal) {
        // Solo intentar eliminar de la API si no es local
        await eliminarProducto(id);
      }
      
      // Eliminar del estado (siempre)
      setProductos(productos.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      // Eliminar localmente aunque falle la API
      setProductos(productos.filter(p => p.id !== id));
    }
  }

  return (
    <div className="appContainer">
      <h1 className="appTitle">React + DummyJSON</h1>

      {/* HIJO que genera evento */}
      <ProductForm onCrear={handleCrear} />

      {/* Buscador */}
      <div className="searchContainer">
        <input 
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="searchInput"
        />
        {busqueda && (
          <span className="searchResults">
            {productosFiltrados.length} resultado(s)
          </span>
        )}
      </div>

      {cargando ? (
        <p className="loadingMessage">Cargando productos...</p>
      ) : (
        <ProductList 
          productos={productosFiltrados}
          onActualizar={handleActualizar}
          onEliminar={handleEliminar}
        />
      )}
    </div>
  );
}

export default App;