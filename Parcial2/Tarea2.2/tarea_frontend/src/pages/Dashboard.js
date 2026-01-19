 import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import { obtenerDashboard, obtenerActividades } from '../services/apiService';
import { obtenerEstudiantes } from '../services/estudianteService';
import { obtenerDocentes } from '../services/docenteService';
import { obtenerAsignaturas } from '../services/asignaturaService';

function Dashboard({ usuario }) {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [totales, setTotales] = useState({ estudiantes: 0, docentes: 0, asignaturas: 0 });

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      const response = await obtenerDashboard();
      // El backend ahora devuelve directamente { actividades, notificaciones, eventos }
      setData(response);
      // Si no vienen actividades desde el endpoint principal, intentar obtenerlas directamente
      if (!response?.actividades || !Array.isArray(response.actividades) || response.actividades.length === 0) {
        try {
          const acts = await obtenerActividades(5);
          setData(prev => ({ ...(prev || {}), actividades: Array.isArray(acts) ? acts : [] }));
        } catch (err) {
          console.error('Error al obtener actividades (fallback):', err);
        }
      }
      // Obtener totales básicos
      try {
        const [ests, docs, asigs] = await Promise.all([
          obtenerEstudiantes('', ''), // pasar estado vacío para obtener todos
          obtenerDocentes(),
          obtenerAsignaturas()
        ]);
        setTotales({ estudiantes: Array.isArray(ests) ? ests.length : 0, docentes: Array.isArray(docs) ? docs.length : 0, asignaturas: Array.isArray(asigs) ? asigs.length : 0 });
      } catch (err) {
        console.error('Error al cargar totales:', err);
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      setData({ actividades: [], notificaciones: [], eventos: [] });
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4">
        <i className="bi bi-house-door me-2"></i>
        Panel de Inicio
      </h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card border-primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Estudiantes</h6>
                  <h3 className="mb-0">{totales.estudiantes}</h3>
                </div>
                <div className="text-primary">
                  <i className="bi bi-people" style={{ fontSize: '2.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="dashboard-card border-success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Docentes</h6>
                  <h3 className="mb-0">{totales.docentes}</h3>
                </div>
                <div className="text-success">
                  <i className="bi bi-person-badge" style={{ fontSize: '2.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="dashboard-card border-warning">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Materias</h6>
                  <h3 className="mb-0">{totales.asignaturas}</h3>
                </div>
                <div className="text-warning">
                  <i className="bi bi-journal-text" style={{ fontSize: '2.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <i className="bi bi-clock-history me-2"></i>
              Últimas Actividades
            </Card.Header>
            <Card.Body>
              {data?.actividades && data.actividades.length > 0 ? (
                <div className="list-group list-group-flush">
                  {data.actividades.map((actividad, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">
                          <i className={`bi bi-${getTipoIcon(actividad.tipo)} me-2`}></i>
                          {actividad.descripcion}
                        </h6>
                        <small className="text-muted">
                          {formatearFecha(actividad.fecha)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No hay actividades recientes</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <i className="bi bi-bell me-2"></i>
              Notificaciones Recientes
            </Card.Header>
            <Card.Body>
              {data?.notificaciones && data.notificaciones.length > 0 ? (
                <div className="list-group list-group-flush">
                  {data.notificaciones.map((notif, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex align-items-start">
                        <span className={`badge bg-${notif.tipo} me-2`}>
                          {notif.tipo}
                        </span>
                        <div>
                          <h6 className="mb-1">{notif.titulo}</h6>
                          <p className="mb-0 small text-muted">{notif.mensaje}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No hay notificaciones</p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <i className="bi bi-calendar-event me-2"></i>
              Próximos Eventos
            </Card.Header>
            <Card.Body>
              {data?.eventos && data.eventos.length > 0 ? (
                <div className="list-group list-group-flush">
                  {data.eventos.map((evento, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <div>
                          <h6 className="mb-1">{evento.titulo}</h6>
                          <p className="mb-0 small text-muted">{evento.descripcion}</p>
                        </div>
                        <small className="text-primary">
                          {formatearFecha(evento.fecha_inicio)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No hay eventos próximos</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function getTipoIcon(tipo) {
  const icons = {
    'registro': 'plus-circle',
    'actualizacion': 'pencil-square',
    'nota': 'journal-check',
    'login': 'box-arrow-in-right',
    'eliminacion': 'trash'
  };
  return icons[tipo] || 'circle';
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export default Dashboard;
