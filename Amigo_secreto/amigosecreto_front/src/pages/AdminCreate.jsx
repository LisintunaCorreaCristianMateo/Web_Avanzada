import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminCreate() {
  // bloquear creación si venimos de la vista de invitado en la misma sesión
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('guestView')) {
    alert('Acceso administrativo no permitido desde vista de invitado en esta sesión.');
    window.location.href = '/';
    return null;
  }
  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState('')
  const [participants, setParticipants] = useState([{ Nombre: '', restrictions: [] }])
  const navigate = useNavigate()

  function addParticipant() {
    setParticipants(prev => [...prev, { Nombre: '', restrictions: [] }])
  }

  function removeParticipant(idx) {
    setParticipants(prev => prev.filter((_, i) => i !== idx))
  }

  function setName(idx, value) {
    setParticipants(prev => prev.map((p, i) => i === idx ? { ...p, Nombre: value } : p))
  }

  function toggleRestriction(idx, targetName) {
    setParticipants(prev => prev.map((p, i) => {
      if (i !== idx) return p
      const exists = p.restrictions.includes(targetName)
      return { ...p, restrictions: exists ? p.restrictions.filter(r => r !== targetName) : [...p.restrictions, targetName] }
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const cleaned = participants
      .map(p => ({ Nombre: (p.Nombre || '').trim(), restrictions: p.restrictions || [] }))
      .filter(p => p.Nombre)
    if (cleaned.length < 2) return alert('Agrega al menos 2 participantes con nombre')

    const payload = { titulo, fecha, participantes: cleaned }
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    let data = {}
    try {
      data = await res.json()
    } catch (err) {
      // response not JSON or empty
      data = { error: `HTTP ${res.status}` }
    }
    if (res.ok) {
      const id = data.eventId
      navigate(`/admin/event/${id}`)
    } else {
      alert(data.error || `Error creando evento (status ${res.status})`)
    }
  }

  return (
    <div className="container">
      <h2>Crear Evento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
        </div>
        <div>
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />
        </div>

        <div>
          <label>Participantes</label>
          {participants.map((p, idx) => (
            <div key={idx} style={{ marginBottom: 12, borderBottom: '1px solid #f1f3f5', paddingBottom: 8 }}>
              <input placeholder={`Nombre ${idx + 1}`} value={p.Nombre} onChange={e => setName(idx, e.target.value)} required style={{ width: '70%', marginRight: 8 }} />
              <button type="button" onClick={() => removeParticipant(idx)} style={{ marginLeft: 4 }}>Eliminar</button>

              <div style={{ marginTop: 8, textAlign: 'left' }}>
                <div className="small">Restricciones (elige participantes que NO pueden ser su amigo):</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                  {participants.map((op, j) => j !== idx && (
                    <label key={j} style={{ fontSize: 14, color: '#374151' }}>
                      <input type="checkbox" checked={p.restrictions.includes(op.Nombre)} onChange={() => toggleRestriction(idx, op.Nombre)} /> {op.Nombre || '(sin nombre)'}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="actions">
            <button type="button" className="btn" onClick={addParticipant}>Añadir participante</button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn" type="submit">Crear evento</button>
        </div>
      </form>
    </div>
  )
}
