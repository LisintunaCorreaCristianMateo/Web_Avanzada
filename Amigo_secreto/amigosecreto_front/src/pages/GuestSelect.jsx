import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function GuestSelect(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState('')

  useEffect(()=>{
    fetch(`/api/events/${id}/participants`).then(r=>r.json()).then(setData)
    // marcar sesión como vista de invitado para evitar acceso admin accidental
    sessionStorage.setItem('guestView', '1')
  },[id])

  if(!data) return <div>Loading...</div>

  async function handleGo(){
    if(!selected) return alert('Seleccione su nombre')
    // navigate to reveal
    window.location.href = `/guest/${id}/reveal/${selected}`
  }

  return (
    <div>
      <h2>{data.titulo}</h2>
      <p>Fecha: {new Date(data.fecha).toLocaleString()}</p>
      <p>Selecciona tu nombre:</p>
      <select value={selected} onChange={e=>setSelected(e.target.value)}>
        <option value="">-- seleccione --</option>
        {data.participantes.map(p=> (
          <option key={p.id} value={p.id}>{p.Nombre}</option>
        ))}
      </select>
      <button onClick={handleGo}>Ver mi amigo</button>
      <p>If admin? <Link to={`/admin/event/${id}`}>Ver administración</Link></p>
    </div>
  )
}
