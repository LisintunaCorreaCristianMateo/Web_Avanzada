import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>Amigo Secreto</h1>
      <p>Admin: crea un evento y comparte el enlace con los invitados.</p>
      <p>
        <Link to="/admin/create" style={{ marginRight: 12 }}>Crear evento</Link>
        <Link to="/admin">Ver eventos</Link>
      </p>
    </div>
  )
}
