import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

function Header({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };

  return (
    <Navbar bg="white" className="border-bottom">
      <Container fluid>
        <Navbar.Brand>
          Bienvenido, {usuario?.username}
        </Navbar.Brand>
        <div>
          <Button variant="outline-danger" size="sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar Sesión
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
