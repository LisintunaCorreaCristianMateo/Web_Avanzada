import './App.css';
import {useState} from 'react';
import { OperacionForm } from './componentes/operacionForm';
import {Resultado} from './componentes/resultado';
import Historial from './componentes/Historial';
import {sumar, restar, multiplicar, dividir} from './services/operaciones';




function App() {
    const [resultado, setResultado] = useState("");
    const [historial, setHistorial] = useState([]);

    const procesarSuma = (a, b) => {
      const r = sumar(a, b);
      const mensaje = `${a} + ${b} = ${r}`;
      setResultado('La suma es ' + r);
      setHistorial([...historial, mensaje]);
    }
    const procesarResta = (a, b) => {
      const r = restar(a, b);
      const mensaje = `${a} - ${b} = ${r}`;
      setResultado('La resta es ' + r);
      setHistorial([...historial, mensaje]);
    }
    const procesarMultiplicacion = (a, b) => {
      const r = multiplicar(a, b);
      const mensaje = `${a} × ${b} = ${r}`;
      setResultado('La multiplicación es ' + r);
      setHistorial([...historial, mensaje]);
    }
    const procesarDivision = (a, b) => {
      const r = dividir(a, b);
      const mensaje = `${a} ÷ ${b} = ${r}`;
      setResultado('La división es ' + r);
      setHistorial([...historial, mensaje]);
    }
  return (
    <div className="App">
      <header className="App-header">


        <h2>Calcualadora con React!</h2>
        <OperacionForm
        onSumar={procesarSuma}
        onRestar={procesarResta}
        onMultiplicar={procesarMultiplicacion}
        onDividir={procesarDivision}
        />
        <Resultado resultado={resultado} />
        <Historial operaciones={historial} />


      </header>
    </div>
  );
}

export default App;
