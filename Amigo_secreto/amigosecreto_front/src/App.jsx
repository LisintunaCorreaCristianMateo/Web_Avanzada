import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import AdminCreate from './pages/AdminCreate'
import AdminEvent from './pages/AdminEvent'
import AdminDashboard from './pages/AdminDashboard'
import GuestSelect from './pages/GuestSelect'
import GuestReveal from './pages/GuestReveal'
import './App.css'

export default function App() {
  const isGuest = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('guestView')

  return (
    <div className="App">
      <nav className="nav">
        <Link to="/">Home</Link>
        {!isGuest && <Link to="/admin/create">Admin - Crear Evento</Link>}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/create" element={<AdminCreate />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/event/:id" element={<AdminEvent />} />
          <Route path="/guest/:id" element={<GuestSelect />} />
          <Route path="/guest/:id/reveal/:pid" element={<GuestReveal />} />
        </Routes>
      </main>
    </div>
  )
}
