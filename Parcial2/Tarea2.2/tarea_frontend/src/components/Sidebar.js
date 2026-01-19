import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Sidebar({ usuario }) {
  return (
    <div className="sidebar" style={{ width: '250px' }}>
      <div className="p-4">
        <h4 className="text-white mb-4">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Sistema Escolar
        </h4>
        <Nav className="flex-column">
          <NavLink to="/dashboard" className="nav-link">
            <i className="bi bi-house-door me-2"></i>
            Inicio
          </NavLink>
          
          <NavLink to="/estudiantes" className="nav-link">
            <i className="bi bi-people me-2"></i>
            Estudiantes
          </NavLink>
          
          <NavLink to="/docentes" className="nav-link">
            <i className="bi bi-person-badge me-2"></i>
            Docentes
          </NavLink>
          
          <NavLink to="/asignaturas" className="nav-link">
            <i className="bi bi-journals me-2"></i>
            Asignaturas
          </NavLink>
          
          <NavLink to="/notas" className="nav-link">
            <i className="bi bi-journal-text me-2"></i>
            Notas
          </NavLink>
          
          <NavLink to="/ayuda" className="nav-link">
            <i className="bi bi-question-circle me-2"></i>
            Ayuda
          </NavLink>
        </Nav>
      </div>
      
      <div className="mt-auto p-4">
        <div className="text-white-50 small">
          <div className="mb-2">
            <i className="bi bi-person-circle me-2"></i>
            {usuario?.username}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
