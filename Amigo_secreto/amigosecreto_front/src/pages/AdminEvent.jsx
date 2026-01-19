import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

export default function AdminEvent() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [event, setEvent] = useState(null)

  async function load() {
    const res = await fetch(`/api/events/${id}`)
    if (!res.ok) {
      const d = await res.json().catch(()=>({ error: 'Error' }))
      alert(d.error || 'Acceso denegado')
      setEvent(null)
      return
    }
    const data = await res.json()
    setEvent(data)
  }

  useEffect(() => { load() }, [id])

  async function handleAssign() {
    const res = await fetch(`/api/events/${id}/assign`, { method: 'POST' })
    const data = await res.json()
    if (res.ok) {
      alert('Asignaciones realizadas')
      load()
    } else {
      alert(data.error || 'Error al asignar')
    }
  }

  if (!event) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div className="app-header">
        <div className="brand"><div className="logo">AS</div><h1>Evento: {event.titulo}</h1></div>
        <div className="small">Fecha: {new Date(event.fecha).toLocaleString()}</div>
      </div>

      <div style={{ marginTop: 12 }} className="card">
        <h3>Participantes</h3>
        <ul className="participants-list">
          {event.participantes.map(p => (
            <li key={p._id} className="participant-item">
              <div className="avatar">{(p.Nombre||'').slice(0,1).toUpperCase()}</div>
              <div className="participant-meta">{p.Nombre}
                {p.restrictions && p.restrictions.length>0 && <span className="restriction-pill">{p.restrictions.length} restricción(es)</span>}
              </div>
              <div>{p.amigoSecreto ? <span className="small">Asignado</span> : <span className="small">No asignado</span>}</div>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 12 }} className="actions">
          <button className="btn" onClick={handleAssign} disabled={event.assigned}>Asignar amigos</button>
        </div>

        <p className="footer-note">Enlace para invitados: <a href={`/guest/${id}`}>{window.location.origin}/guest/{id}</a></p>
      </div>
    </div>
  )
}
