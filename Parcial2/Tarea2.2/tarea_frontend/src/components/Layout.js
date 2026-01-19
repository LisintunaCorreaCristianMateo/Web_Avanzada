import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children, usuario, onLogout }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar usuario={usuario} />
      <div className="flex-grow-1">
        <Header usuario={usuario} onLogout={onLogout} />
        <Container fluid className="p-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}

export default Layout;
