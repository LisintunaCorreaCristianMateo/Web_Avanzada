import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import ConfirmModal from '../components/ConfirmModal';
import {
  obtenerAsignaturas,
  buscarAsignaturas,
  crearAsignatura,
  actualizarAsignatura,
  eliminarAsignatura
} from '../services/asignaturaService';
import { obtenerDocentes } from '../services/docenteService';
import '../styles/Asignaturas.css';

function Asignaturas({ usuario }) {
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  const [showModal, setShowModal] = useState(false);
  const [asignaturaEdit, setAsignaturaEdit] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    nrc: '',
    descripcion: '',
    creditos: '',
    nivel: '',
    docente_id: ''
  });
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [asignaturaDelete, setAsignaturaDelete] = useState(null);

  useEffect(() => {
    cargarAsignaturas();
    cargarDocentes();
  }, []);

  const cargarAsignaturas = async () => {
    try {
      const response = await obtenerAsignaturas();
      setAsignaturas(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
      mostrarAlert('danger', 'Error al cargar asignaturas');
    } finally {
      setCargando(false);
    }
  };

  const cargarDocentes = async () => {
    try {
      const response = await obtenerDocentes();
      setDocentes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
      mostrarAlert('danger', 'Error al cargar docentes');
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      cargarAsignaturas();
      return;
    }

    try {
      const response = await buscarAsignaturas(busqueda);
      setAsignaturas(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al buscar:', error);
      mostrarAlert('danger', 'Error al buscar asignaturas');
    }
  };

  const handleNuevo = () => {
    setAsignaturaEdit(null);
    setFormData({
      nombre: '',
      nrc: '',
      descripcion: '',
      creditos: '',
      nivel: '',
      docente_id: ''
    });
    setShowModal(true);
  };

  const handleEditar = (asignatura) => {
    setAsignaturaEdit(asignatura);
    setFormData({
      nombre: asignatura.nombre || '',
      nrc: asignatura.nrc || '',
      descripcion: asignatura.descripcion || '',
      creditos: asignatura.creditos || '',
      nivel: asignatura.nivel || '',
      docente_id: asignatura.docente_id || ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (asignaturaEdit) {
        response = await actualizarAsignatura(asignaturaEdit.id, formData);
      } else {
        response = await crearAsignatura(formData);
      }

      mostrarAlert('success', asignaturaEdit ? 'Asignatura actualizada exitosamente' : 'Asignatura creada exitosamente');
      setShowModal(false);
      cargarAsignaturas();
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarAlert('danger', error.response?.data?.error || 'Error al guardar asignatura');
    }
  };

  const handleEliminar = (asignatura) => {
    setAsignaturaDelete(asignatura);
    setShowConfirm(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarAsignatura(asignaturaDelete.id);
      mostrarAlert('success', 'Asignatura eliminada exitosamente');
      setShowConfirm(false);
      cargarAsignaturas();
    } catch (error) {
      console.error('Error al eliminar:', error);
      mostrarAlert('danger', 'Error al eliminar asignatura');
    }
  };

  const mostrarAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  if (cargando) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-fluid">
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Asignaturas</h2>
        </Col>
      </Row>

      <AlertMessage type={alert.type} message={alert.message} />

      <Row className="mb-3">
        <Col md={8}>
          <Form onSubmit={handleBuscar}>
            <div className="input-group">
              <Form.Control
                type="text"
                placeholder="Buscar asignaturas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Button variant="primary" type="submit">
                Buscar
              </Button>
              {busqueda && (
                <Button variant="secondary" onClick={() => { setBusqueda(''); cargarAsignaturas(); }}>
                  Limpiar
                </Button>
              )}
            </div>
          </Form>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="success" onClick={handleNuevo}>
            + Nueva Asignatura
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive className="asignaturas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NRC</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Créditos</th>
                <th>Docente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaturas.length > 0 ? (
                asignaturas.map((asignatura) => (
                  <tr key={asignatura.id}>
                    <td>{asignatura.id}</td>
                    <td>{asignatura.nrc}</td>
                    <td>{asignatura.nombre}</td>
                    <td>{asignatura.descripcion}</td>
                    <td>{asignatura.creditos}</td>
                    <td>
                      {asignatura.docente ? (
                        <>
                          {asignatura.docente.nombres} {asignatura.docente.apellidos}
                          {asignatura.docente.especialidad && (
                            <div className="text-muted small">
                              <i className="bi bi-bookmark-fill me-1"></i>
                              {asignatura.docente.especialidad}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-muted">Sin asignar</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditar(asignatura)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleEliminar(asignatura)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No se encontraron asignaturas
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal de formulario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{asignaturaEdit ? 'Editar Asignatura' : 'Nueva Asignatura'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>NRC *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nrc"
                    value={formData.nrc}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Créditos *</Form.Label>
                  <Form.Control
                    type="number"
                    name="creditos"
                    value={formData.creditos}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nivel</Form.Label>
                  <Form.Control
                    type="text"
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleChange}
                    placeholder="Ej: Primer Nivel, Segundo Nivel..."
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Docente</Form.Label>
                  <Form.Select
                    name="docente_id"
                    value={formData.docente_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Seleccione un docente --</option>
                    {docentes.filter(d => d.estado === 'activo').map(docente => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nombres} {docente.apellidos}
                        {docente.especialidad && ` - ${docente.especialidad}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {asignaturaEdit ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de confirmación */}
      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmarEliminar}
        title="Confirmar eliminación"
        message={`¿Está seguro de eliminar la asignatura ${asignaturaDelete?.nombre}?`}
      />
    </div>
  );
}

export default Asignaturas;
