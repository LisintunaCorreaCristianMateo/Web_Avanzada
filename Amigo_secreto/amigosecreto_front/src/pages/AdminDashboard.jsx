import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load() {
      try {
        const res = await fetch('/api/events')
        if (!res.ok) throw new Error('No se pudo obtener eventos')
        const data = await res.json()
        setItems(data)
      } catch(e) {
        try {
          const stored = JSON.parse(localStorage.getItem('adminEvents') || '[]')
          setItems(stored.map(s => ({ id: s.id, titulo: s.titulo, fecha: s.fecha })))
        } catch(err) { setItems([]) }
      } finally {
        setLoading(false)
      }
    }
    load()
  },[])

  if (loading) return <div className="container">Cargando eventos...</div>

  if (items.length === 0) return (
    <div className="container">
      <h2>Panel Admin</h2>
      <p className="muted">No hay eventos registrados.</p>
    </div>
  )

  return (
    <div className="container">
      <h2>Panel Admin</h2>
      <ul>
        {items.map(it => (
          <li key={it.id} style={{ marginBottom: 8 }}>
            <strong>{it.titulo || it.id}</strong> — {new Date(it.fecha).toLocaleString()}
            <div style={{ marginTop:6 }}>
              <Link to={`/admin/event/${it.id}`}>Ver detalle</Link>
              <span style={{ marginLeft: 12 }}>
                Enlace invitado: <a href={`/guest/${it.id}`}>{window.location.origin}/guest/{it.id}</a>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
