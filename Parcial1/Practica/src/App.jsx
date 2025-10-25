import {Card,CardBody,Card2} from "./components/Card"

export function App(){
  return <div>
    <Card body="Hola mundo de react"/>
    <CardBody titulo="Mi titulo" texto="Este es el texto de mi card body"/>

  
  </div>
  
}
export function ChildrenApp(){
  return <card2>
    <CardBody titulo="Children" texto="Texto de children"/>
  </card2>
}