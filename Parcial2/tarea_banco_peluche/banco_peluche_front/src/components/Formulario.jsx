import { useState } from 'react';
import '../styles/Formulario.css';

const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    edad: '',
    saldoAnterior: '',
    montoCompras: '',
    pagoRealizado: ''
  });
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/clientes/calcular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          edad: Number(formData.edad),
          saldoAnterior: Number(formData.saldoAnterior),
          montoCompras: Number(formData.montoCompras),
          pagoRealizado: Number(formData.pagoRealizado)
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setResultado(data.data);
        // Limpiar formulario
        setFormData({
          nombre: '',
          dni: '',
          edad: '',
          saldoAnterior: '',
          montoCompras: '',
          pagoRealizado: ''
        });
      } else {
        alert(data.msg || 'Error al calcular');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h2>Calcular Crédito del Cliente</h2>
      
      <form onSubmit={handleSubmit} className="formulario">
        <div className="form-seccion">
          <h3>Datos Personales</h3>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dni">DNI:</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edad">Edad:</label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              min="18"
              required
            />
          </div>
        </div>

        <div className="form-seccion">
          <h3>Datos Financieros</h3>
          <div className="form-group">
            <label htmlFor="saldoAnterior">Saldo Anterior:</label>
            <input
              type="number"
              id="saldoAnterior"
              name="saldoAnterior"
              value={formData.saldoAnterior}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="montoCompras">Monto de Compras:</label>
            <input
              type="number"
              id="montoCompras"
              name="montoCompras"
              value={formData.montoCompras}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pagoRealizado">Pago Realizado:</label>
            <input
              type="number"
              id="pagoRealizado"
              name="pagoRealizado"
              value={formData.pagoRealizado}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-calcular" disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>

      {resultado && (
        <div className="resultado-calculo">
          <h3>✅ Resultado del Cálculo</h3>
          <div className="resultado-info">
            <p><strong>Cliente:</strong> {resultado.nombre}</p>
            <p><strong>DNI:</strong> {resultado.dni}</p>
          </div>
          <div className="resultado-grid">
            <div className="resultado-item">
              <span className="label">Saldo Base:</span>
              <span className="valor">${resultado.saldoBase?.toFixed(2)}</span>
            </div>
            <div className="resultado-item">
              <span className="label">Saldo Actual:</span>
              <span className="valor destacado">${resultado.saldoActual?.toFixed(2)}</span>
            </div>
            <div className="resultado-item">
              <span className="label">Pago Mínimo:</span>
              <span className="valor">${resultado.pagoMinimo?.toFixed(2)}</span>
            </div>
            <div className="resultado-item">
              <span className="label">Pago sin Intereses:</span>
              <span className="valor">${resultado.pagoNoIntereses?.toFixed(2)}</span>
            </div>
            <div className="resultado-item">
              <span className="label">Interés:</span>
              <span className="valor">${resultado.interes?.toFixed(2)}</span>
            </div>
            <div className="resultado-item">
              <span className="label">Multa:</span>
              <span className="valor">${resultado.multa?.toFixed(2)}</span>
            </div>
            <div className={`resultado-item estado ${resultado.esMoroso ? 'moroso' : 'al-dia'}`}>
              <span className="label">Estado:</span>
              <span className="valor">{resultado.esMoroso ? '⚠️ MOROSO' : '✅ AL DÍA'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Formulario;
