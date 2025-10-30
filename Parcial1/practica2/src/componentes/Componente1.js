import React from 'react'

export const Componente1 = () => {
    let nombre = "Cristian";
    let web= "crisWeb.reac";
    let cursos =[
        "React",
        "Vue",
        "Angular"
    ]
  return (
    <>
    <div>Componente1</div>
    <p> mi nombre es: {nombre} </p>
    <p>MI web es: {web}</p>
    <ul>
        {
            cursos.map((cursos,indice) =>{
                return (
                    <li key={indice}> 
                        {cursos}
                    </li>
                );
                })
        }
    </ul>
    </>
  );
}
