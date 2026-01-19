import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Estudiantes from './pages/Estudiantes';
import Docentes from './pages/Docentes';
import Asignaturas from './pages/Asignaturas';
import Notas from './pages/Notas';
import Ayuda from './pages/Ayuda';
import Layout from './components/Layout';
import { getUsuario } from './services/authService';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioGuardado = getUsuario();
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
    setCargando(false);
  }, []);

  const handleLogin = (usuarioData) => {
    setUsuario(usuarioData);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          usuario ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
        }
      />
      <Route
        path="/"
        element={
          usuario ? (
            <Layout usuario={usuario} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard usuario={usuario} />} />
        <Route path="estudiantes" element={<Estudiantes usuario={usuario} />} />
        <Route path="docentes" element={<Docentes usuario={usuario} />} />
        <Route path="asignaturas" element={<Asignaturas usuario={usuario} />} />
        <Route path="notas" element={<Notas usuario={usuario} />} />
        <Route path="ayuda" element={<Ayuda />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
