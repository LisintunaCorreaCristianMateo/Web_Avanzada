import { useState, useEffect } from 'react';
import '../styles/VerDatos.css';

const VerDatos = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clientes/listar');
      const data = await response.json();
      if (data.ok) {
        setClientes(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setLoading(false);
    }
  };

  const handleSeleccionarCliente = (e) => {
    const clienteId = e.target.value;
    if (clienteId) {
      const cliente = clientes.find(c => c._id === clienteId);
      setClienteSeleccionado(cliente);
    } else {
      setClienteSeleccionado(null);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  const descargarPDFCliente = async (cliente) => {
    try {
      const response = await fetch(`http://localhost:3000/api/clientes/export/pdf/${cliente._id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cliente_${cliente.dni}_${cliente.nombre}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar PDF del cliente:', error);
      alert('Error al descargar el PDF del cliente');
    }
  };

  const descargarExcelCliente = async (cliente) => {
    try {
      const response = await fetch(`http://localhost:3000/api/clientes/export/excel/${cliente._id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cliente_${cliente.dni}_${cliente.nombre}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar Excel del cliente:', error);
      alert('Error al descargar el Excel del cliente');
    }
  };

  if (loading) {
    return <div className="loading">Cargando clientes...</div>;
  }

  return (
    <div className="ver-datos-container">
      <h2>Ver Datos de Cliente</h2>
      
      <div className="selector-container">
        <label htmlFor="cliente-select">Seleccione un cliente:</label>
        <select 
          id="cliente-select"
          onChange={handleSeleccionarCliente}
          defaultValue=""
        >
          <option value="">-- Seleccione un cliente --</option>
          {clientes.map((cliente) => (
            <option key={cliente._id} value={cliente._id}>
              {cliente.nombre} 
            </option>
          ))}
        </select>
      </div>

      {clienteSeleccionado && (
        <div className="detalle-cliente">
          <h3>Información del Cliente</h3>
          
          <div className="seccion">
            <h4>Datos Personales</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Nombre:</span>
                <span className="valor">{clienteSeleccionado.nombre}</span>
              </div>
              <div className="info-item">
                <span className="label">DNI:</span>
                <span className="valor">{clienteSeleccionado.dni}</span>
              </div>
              <div className="info-item">
                <span className="label">Edad:</span>
                <span className="valor">{clienteSeleccionado.edad} años</span>
              </div>
              <div className="info-item">
                <span className="label">Fecha de Registro:</span>
                <span className="valor">{formatearFecha(clienteSeleccionado.fechaRegistro)}</span>
              </div>
            </div>
          </div>

          <div className="seccion">
            <h4>Datos Financieros</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Saldo Anterior:</span>
                <span className="valor">${clienteSeleccionado.saldoAnterior.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Monto Compras:</span>
                <span className="valor">${clienteSeleccionado.montoCompras.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Pago Realizado:</span>
                <span className="valor">${clienteSeleccionado.pagoRealizado.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Saldo Base:</span>
                <span className="valor">${clienteSeleccionado.saldoBase.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="seccion">
            <h4>Resultados del Cálculo</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Saldo Actual:</span>
                <span className="valor destacado">${clienteSeleccionado.saldoActual.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Pago Mínimo:</span>
                <span className="valor">${clienteSeleccionado.pagoMinimo.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Pago sin Intereses:</span>
                <span className="valor">${clienteSeleccionado.pagoNoIntereses.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Es Moroso:</span>
                <span className={`badge ${clienteSeleccionado.esMoroso ? 'moroso' : 'al-dia'}`}>
                  {clienteSeleccionado.esMoroso ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Interés:</span>
                <span className="valor">${clienteSeleccionado.interes.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Multa:</span>
                <span className="valor">${clienteSeleccionado.multa.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="botones-descarga-cliente">
            <button 
              className="btn-descarga-individual pdf" 
              onClick={() => descargarPDFCliente(clienteSeleccionado)}
            >
              Descargar PDF de  {clienteSeleccionado.nombre}
            </button>
            <button 
              className="btn-descarga-individual excel" 
              onClick={() => descargarExcelCliente(clienteSeleccionado)}
            >
               Descargar Excel de {clienteSeleccionado.nombre}
            </button>
          </div>
        </div>
      )}

      {!clienteSeleccionado && !loading && (
        <div className="mensaje-vacio">
          <p>Seleccione un cliente para ver sus datos completos</p>
        </div>
      )}
    </div>
  );
};

export default VerDatos;
