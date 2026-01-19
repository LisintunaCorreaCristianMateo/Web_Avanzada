import '../styles/Navegacion.css';

const Navegacion = ({ vistaActual, cambiarVista }) => {
  return (
    <nav className="navegacion">
      <button 
        className={vistaActual === 'calcular' ? 'activo' : ''}
        onClick={() => cambiarVista('calcular')}
      >
        Calcular
      </button>
      <button 
        className={vistaActual === 'verDatos' ? 'activo' : ''}
        onClick={() => cambiarVista('verDatos')}
      >
        Ver Datos
      </button>
      <button 
        className={vistaActual === 'estadisticas' ? 'activo' : ''}
        onClick={() => cambiarVista('estadisticas')}
      >
        Estadísticas
      </button>
    </nav>
  );
};

export default Navegacion;
