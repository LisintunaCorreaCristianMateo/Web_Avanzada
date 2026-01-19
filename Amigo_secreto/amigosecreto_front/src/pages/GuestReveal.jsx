import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function GuestReveal(){
  const { id, pid } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{
    fetch(`/api/events/${id}/participants/${pid}/reveal`).then(r=>r.json()).then(setData)
  },[id,pid])

  if(!data) return <div className="container">Loading...</div>

  const amigo = data.amigoSecreto

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Tu amigo secreto</h2>

        {amigo ? (
          <>
            <div style={{ fontSize: 40, fontWeight: 800, margin: '12px 0' }}>{amigo.Nombre}</div>
            <p className="muted">Que este nuevo año te traiga serenidad para disfrutar el presente y alegría para celebrar el cumpleaños de Jesús.</p>
            <p style={{ marginTop: 8, fontWeight: 700 }}>Feliz Navidad 🎄❤️🎄</p>
            <div style={{ marginTop: 16 }}>
              <Link to="/" className="link-muted">Volver al inicio</Link>
            </div>
          </>
        ) : (
          <>
            <p className="muted">No hay asignación o aún no se asignó.</p>
            <div style={{ marginTop: 12 }}>
              <Link to="/" className="link-muted">Volver al inicio</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
