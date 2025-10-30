import React,{useState} from "react";
export function Titulo() {
    //let nombre="Samantha";
    const [nombre,setNombre]=useState("Samantha");

    const cambiarNombre=(nuevoNombre)=>{
        setNombre(nuevoNombre);

    }
  return (
    <>
    <h2 className="text-white">Hola buenas noches {nombre}</h2>

    <button
      type="button"
      className="btn btn-danger"
      style={{ padding: "2rem", margin: "2rem" }}
      onClick ={e=>cambiarNombre("Domenica")}
    >
      Presioname por fa
    </button>
    </>
  );
}
