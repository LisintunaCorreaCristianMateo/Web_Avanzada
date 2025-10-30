import {Titulo} from './Boton';
import {Card} from './card';
import { Componente1 } from './componentes/Componente1';
import { Componente2 } from './componentes/componente2';

export function App(){
  return (
    <div className="bg-dark text-center">

    <p className="text-color text-ling">BIENVENIDOS</p>
     <Titulo/>
    </div>
  );
 
  

}
export function Contenido(){
  return (
    <>
    <Componente1/>
    <Componente2/>
    <Card/>
    
    </>
  );
}