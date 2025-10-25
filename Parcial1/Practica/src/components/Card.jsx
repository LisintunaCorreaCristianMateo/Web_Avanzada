import {Fragment} from "react"

// Recibe el prop "body" que será el contenido a mostrar dentro de la tarjeta
export function Card({body}) {
   
    const width ={
      width: "350px"
    }
  return (
    <div className="card" style={width}>
      <div className="card-body">  {body} <CardBody/></div>
    </div>
  );
}

// Recibe dos props: "titulo" y "texto" para personalizar el contenido
export function CardBody({titulo,texto}) {
  return (
    <Fragment>

        <h5 className="card-title">{titulo}</h5>
        <p className="card-text">
          {texto}
        </p>
      
    </Fragment>
  );
}


export function Card2({children}) {
   
    const width ={
      width: "350px"
    }
  return (
    <div className="card" style={width}>
      <div className="card-body">  {children} </div>
    </div>
  );
}