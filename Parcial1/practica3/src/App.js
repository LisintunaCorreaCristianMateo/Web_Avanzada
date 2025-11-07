import './App.css';
import {Testimonio} from './componentes/Testimonio.js';

function App() {
  return (
    <div className="App">
      <div className="contenedor-principal">
      <h1>Testimonio de nuestros alummnos</h1>
      <Testimonio 
      nombre="Emma Bostion"
      pais="Suecia"
      imagen ="2"
      empresa="Spotify"
      testimonio="Siempre he tenido problemas para aprender JavaScript.
       He tomado muchos cursos, pero el curso de freeCodeCamp fue el que
        se quedó. Estudiar JavaScript durante seis meses me dio las habilidades y 
        la confianza que necesitaba para conseguir un trabajo de desarrollador en 
        una empresa increíble."
      />
      
      <Testimonio 
      nombre="Shawn Wang"
      pais="Singapur"
      imagen ="1"
      empresa="Amazon"
      testimonio="freeCodeCamp fue la puerta de entrada a mi carrera como desarrollador de software.
       El plan de estudios bien estructurado llevó mis conocimientos de programación de un nivel
        de principiante total a un nivel muy seguro. Era todo lo que necesitaba para conseguir mi
         primer trabajo de desarrollador en una empresa increíble."
      />
      <Testimonio
      nombre="Saara Chima"
      pais="Niegeria"
      imagen ="3"
      empresa="ChatDesk"
      testimonio="freeCodeCamp cambió mi vida.
       He pasado de ser un desarrollador de software de nivel medio
        a trabajar en una empresa increíble. 
       El curso fue muy intenso pero valió la pena cada hora que dediqué."
      />
      </div>
    </div>
  );
}

export default App;
