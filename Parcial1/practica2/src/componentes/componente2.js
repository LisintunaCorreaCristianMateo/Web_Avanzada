import React from 'react'

export const Componente2 = () => {

  const lenguajes=[
    'Javascript',
    'PHP',
    'Python',
    'Java',
    'C#'];

  return (
    <>
    <h1>Lenguajes de Programacion</h1>
    <ul>
      {
        lenguajes.map((lenguaje,indice)=>(
          <li key={indice}>
            {lenguaje}
          </li>

        ))
      }

    </ul>
    
    </>
  )
}
