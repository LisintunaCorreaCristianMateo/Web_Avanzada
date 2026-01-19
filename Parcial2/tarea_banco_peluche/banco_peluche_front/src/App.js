import './App.css';
import { useState } from 'react';
import Navegacion from './components/Navegacion';
import Formulario from './components/Formulario';
import VerDatos from './components/VerDatos';
import Estadisticas from './components/Estadisticas';

function App() {
  const [vistaActual, setVistaActual] = useState('calcular');

  const renderizarVista = () => {
    switch(vistaActual) {
      case 'calcular':
        return <Formulario />;
      case 'verDatos':
        return <VerDatos />;
      case 'estadisticas':
        return <Estadisticas />;
      default:
        return <Formulario />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏦 Banco Peluche</h1>
        <p>Sistema de Gestión Financiera</p>
      </header>
      
      <Navegacion vistaActual={vistaActual} cambiarVista={setVistaActual} />
      
      <main className="app-main">
        {renderizarVista()}
      </main>
    </div>
  );
}

export default App;

