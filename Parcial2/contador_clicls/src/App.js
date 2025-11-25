
import './App.css';
import logo from './imagenes/LogoEspe.png';
import {Boton} from './componentes/Boton';
import {Contador} from './componentes/contador';
import {useState} from 'react';

function App() {

  const [numClics,setNumClics]=useState(0);


  const contar =()=>setNumClics(numClics +1);
  const reiniciar =()=>setNumClics(0);
  
  return (
    <div className="App">

      <div className="logo">
        <img
          src={logo}
          class="App-logo"
          alt="logo de la espe"
        />
        
      </div>
  

     <div className="contedor_principal">
      <Contador numClics={numClics} />
      <Boton
      texto='Clic'
      esBotonClic={true}
      manejarClic={contar}
      />

      <Boton
      texto='Limpiar'
      esBotonClic={false}
      manejarClic={reiniciar}
      />


     </div>
 
    </div>
  );
}

export default App;
