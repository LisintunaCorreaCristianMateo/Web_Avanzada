import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { login } from '../services/authService';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const response = await login(username, password);
      console.log('Respuesta de login:', response);
      
      if (response.usuario) {
        onLogin(response.usuario);
      } else if (response.error) {
        setError(response.error);
      } else {
        setError('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.error || error.message || 'Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center" 
      style={{ background: '#ffffff' }}>
      <Row className="w-100 justify-content-center">
        <Col md={5} lg={4}>
          <Card className="shadow-lg border-0" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <i className="bi bi-mortarboard-fill text-primary" style={{ fontSize: '4rem' }}></i>
                <h2 className="mt-3">Sistema Escolar</h2>
                <p className="text-muted">Inicia sesión para continuar</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Ingresa tu usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </Form>

              <div className="mt-4 text-center">
         
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
