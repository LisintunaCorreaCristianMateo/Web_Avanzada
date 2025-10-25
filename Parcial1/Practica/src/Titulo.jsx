export function Titulo() {
  const nombre = "Conejo";

  if (nombre) {
    return <h1> Hola {nombre}</h1>;
  }
  return <h1> Hola Mundo</h1>;
}
