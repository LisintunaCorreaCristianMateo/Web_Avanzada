import { useState, useEffect } from 'react';
import '../styles/Estadisticas.css';

const Estadisticas = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clientes/estadisticas');
      const data = await response.json();
      if (data.ok) {
        setEstadisticas(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setLoading(false);
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clientes/export/pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clientes.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al descargar el PDF');
    }
  };

  const descargarExcel = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clientes/export/excel');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clientes.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar Excel:', error);
      alert('Error al descargar el Excel');
    }
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  if (!estadisticas) {
    return <div className="error">No se pudieron cargar las estadísticas</div>;
  }

  const porcentajeMorosos = estadisticas.totalClientes > 0 
    ? ((estadisticas.morosos / estadisticas.totalClientes) * 100).toFixed(1)
    : 0;

  return (
    <div className="estadisticas-container">
      <h2>Estadísticas Generales</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total de Clientes</h3>
            <p className="stat-valor">{estadisticas.totalClientes || 0}</p>
          </div>
        </div>

        <div className="stat-card morosos">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>Clientes Morosos</h3>
            <p className="stat-valor">{estadisticas.morosos || 0}</p>
            <p className="stat-porcentaje">{porcentajeMorosos}% del total</p>
          </div>
        </div>

        <div className="stat-card promedio">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>Promedio Saldo Actual</h3>
            <p className="stat-valor">
              ${estadisticas.promedioSaldoActual 
                ? estadisticas.promedioSaldoActual.toFixed(2) 
                : '0.00'}
            </p>
          </div>
        </div>

        <div className="stat-card multas">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>Total Multas</h3>
            <p className="stat-valor">
              ${estadisticas.totalmultas 
                ? estadisticas.totalmultas.toFixed(2) 
                : '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="graficos-info">
        <h3>Resumen</h3>
        <div className="barra-progreso">
          <div className="barra-label">
            <span>Clientes al día</span>
            <span>Clientes morosos</span>
          </div>
          <div className="barra">
            <div 
              className="barra-fill al-dia"
              style={{ width: `${100 - porcentajeMorosos}%` }}
            >
              {100 - porcentajeMorosos > 10 && `${(100 - porcentajeMorosos).toFixed(1)}%`}
            </div>
            <div 
              className="barra-fill morosos"
              style={{ width: `${porcentajeMorosos}%` }}
            >
              {porcentajeMorosos > 10 && `${porcentajeMorosos}%`}
            </div>
          </div>
        </div>
      </div>

      <div className="botones-descarga">
        <button className="btn-descarga pdf" onClick={descargarPDF}>
          Descargar PDF de Todos los Clientes
        </button>
        <button className="btn-descarga excel" onClick={descargarExcel}>
           Descargar Excel de Todos los Clientes
        </button>
      </div>
    </div>
  );
};

export default Estadisticas;
