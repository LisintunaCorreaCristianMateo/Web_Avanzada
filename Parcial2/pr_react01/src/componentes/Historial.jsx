export default function Historial({ operaciones }) {
  return (
    <div className="mt-4">
      <h3>Historial de Operaciones</h3>
      {operaciones.length === 0 ? (
        <p className="text-muted">No hay operaciones realizadas aún</p>
      ) : (
        <ul className="list-group">
          {operaciones.map((op, index) => (
            <li key={index} className="list-group-item">
              {op}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
