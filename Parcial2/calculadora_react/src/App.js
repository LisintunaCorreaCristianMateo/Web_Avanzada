import './App.css';
import Boton from './componentes/boton.jsx';
import Pantalla from './componentes/pantalla.jsx';
import BotonClear from './componentes/clear.jsx';
import { useState } from 'react';
import { evaluate } from 'mathjs';
function App() {

const [imput,setInput]=useState(" ");

const agregarInput=valor=>{
  setInput(imput + valor);
}

const vaciar=()=>setInput('');

const calcularResultado=()=>{
  if(imput){
    setInput(evaluate(imput));

  }
  else{
    alert('Ingrese valores para calcular')
  }
};

  return (
    <div className="App">
    <h1>Calculadora React</h1>
    <div className="Contenedor-Calculadora">

<div className='pantalla'>
<Pantalla
input={imput}
/>
</div>

<div className='fila'>
  <Boton manejarClick={agregarInput}>1</Boton>
  <Boton manejarClick={agregarInput}>2</Boton>
  <Boton manejarClick={agregarInput}>3</Boton>
  <Boton manejarClick={agregarInput}>+</Boton>
</div>
<div className='fila'>
    <Boton manejarClick={agregarInput}>4</Boton>
    <Boton manejarClick={agregarInput}>5</Boton>
    <Boton manejarClick={agregarInput}>6</Boton>
    <Boton manejarClick={agregarInput}>-</Boton>
</div>
<div className='fila'>
     <Boton manejarClick={agregarInput}>7</Boton>
    <Boton manejarClick={agregarInput}>8</Boton>
    <Boton manejarClick={agregarInput}>9</Boton>
    <Boton manejarClick={agregarInput}>*</Boton>
</div>
<div className='fila'>
     <Boton manejarClick={calcularResultado}>=</Boton>
    <Boton manejarClick={agregarInput}>0</Boton>
    <Boton manejarClick={agregarInput}>.</Boton>
    <Boton manejarClick={agregarInput}>/</Boton>
</div>
<div className='fila'>
    <BotonClear manejarClick={vaciar}>
    Clear
    </BotonClear>
</div>

    </div>

    </div>
  );
}

export default App;
