import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Cursos.css';
import {
  obtenerCursos,
  buscarCursos,
  crearCurso,
  actualizarCurso,
  eliminarCurso
} from '../services/cursoService';

function Cursos({ usuario }) {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  const [showModal, setShowModal] = useState(false);
  const [cursoEdit, setCursoEdit] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    paralelo: '',
    nivel: '',
    activo: 1
  });
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [cursoDelete, setCursoDelete] = useState(null);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      const response = await obtenerCursos();
      setCursos(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      mostrarAlert('danger', 'Error al cargar cursos');
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      cargarCursos();
      return;
    }

    try {
      const response = await buscarCursos(busqueda);
      setCursos(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al buscar:', error);
      mostrarAlert('danger', 'Error al buscar cursos');
    }
  };

  const handleNuevo = () => {
    setCursoEdit(null);
    setFormData({
      nombre: '',
      paralelo: '',
      nivel: ''
    });
    setShowModal(true);
  };

  const handleEditar = (curso) => {
    setCursoEdit(curso);
    setFormData({
      nombre: curso.nombre || '',
      paralelo: curso.paralelo || '',
      nivel: curso.nivel || ''
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
      if (cursoEdit) {
        response = await actualizarCurso(cursoEdit.id, formData);
      } else {
        response = await crearCurso(formData);
      }

      mostrarAlert('success', cursoEdit ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente');
      setShowModal(false);
      cargarCursos();
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarAlert('danger', error.response?.data?.error || 'Error al guardar curso');
    }
  };

  const handleEliminar = (curso) => {
    setCursoDelete(curso);
    setShowConfirm(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarCurso(cursoDelete.id);
      mostrarAlert('success', 'Curso eliminado exitosamente');
      setShowConfirm(false);
      cargarCursos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      mostrarAlert('danger', 'Error al eliminar curso');
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
    <div>
      <h2 className="mb-4">
        <i className="bi bi-book me-2"></i>
        Gestión de Cursos
      </h2>

      <AlertMessage 
        type={alert.type} 
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })} 
      />

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form onSubmit={handleBuscar}>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Buscar curso..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <Button variant="primary" type="submit">
                    Buscar
                  </Button>
                  {busqueda && (
                    <Button variant="outline-secondary" onClick={() => { setBusqueda(''); cargarCursos(); }}>
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  )}
                </div>
              </Form>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="success" onClick={handleNuevo}>
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Curso
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="cursos-card">
        <Card.Header className="cursos-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5>
              <i className="bi bi-book-fill me-2"></i>
              Lista de Cursos
            </h5>
            <span className="badge cursos-badge">{cursos.length}</span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="cursos-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Paralelo</th>
                  <th>Nivel</th>
                  <th style={{width: '180px', textAlign: 'center'}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursos.length > 0 ? (
                  cursos.map((curso) => (
                    <tr key={curso.id}>
                      <td className="curso-id">{curso.id}</td>
                      <td className="curso-nombre">{curso.nombre}</td>
                      <td>{curso.paralelo}</td>
                      <td>{curso.nivel}</td>
                      <td style={{textAlign: 'center'}}>
                        <Button
                          size="sm"
                          className="btn-editar-curso me-2"
                          onClick={() => handleEditar(curso)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </Button>
                        <Button
                          size="sm"
                          className="btn-eliminar-curso"
                          onClick={() => handleEliminar(curso)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-cursos">
                      <i className="bi bi-inbox" style={{fontSize: '3rem', display: 'block', marginBottom: '1rem'}}></i>
                      No hay cursos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de formulario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{cursoEdit ? 'Editar Curso' : 'Nuevo Curso'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paralelo *</Form.Label>
                  <Form.Control
                    type="text"
                    name="paralelo"
                    value={formData.paralelo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nivel *</Form.Label>
                  <Form.Select
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Bachillerato">Bachillerato</option>
                    <option value="Básica Superior">Básica Superior</option>
                    <option value="Básica Media">Básica Media</option>
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
              {cursoEdit ? 'Actualizar' : 'Crear'}
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
        message={`¿Está seguro de eliminar el curso ${cursoDelete?.nombre} ${cursoDelete?.paralelo}?`}
      />
    </div>
  );
}

export default Cursos;
