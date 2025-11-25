import {useState} from 'react';

export function OperacionForm(props){
    const[valor1,setValor1]=useState("");
    const[valor2,setValor2]=useState("");

    function manejoSuma(){
        props.onSumar(Number(valor1),Number(valor2));
    }
    function manejoResta(){
        props.onRestar(Number(valor1),Number(valor2));
    }
    function manejoMultiplicacion(){
        props.onMultiplicar(Number(valor1),Number(valor2));
    }
    function manejoDivision(){
        props.onDividir(Number(valor1),Number(valor2));
    }
    return(
        <>
        <h2>Calculadora</h2>
        <p>
        valor1: 
        <input 
        class ="form-control"
        type="number"
        value={valor1} 
        onChange={(e)=>setValor1(e.target.value)}
        
        />

        </p>

        <p>
        valor2: 
        <input 
        class ="form-control"
        type="number"
        value={valor2} 
        onChange={(e)=>setValor2(e.target.value)}   
        />
        </p>
        <button className="btn btn-info" onClick={manejoSuma}>Sumar</button>
        <button className="btn btn-info" onClick={manejoResta}>Restar</button>
        <button className="btn btn-info" onClick={manejoMultiplicacion}>Multiplicar</button>
        <button className="btn btn-info" onClick={manejoDivision}>Dividir</button>
        
        
        </>
    )
}