import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import ConfirmModal from '../components/ConfirmModal';
import { validarCedulaEcuatoriana, obtenerErrorCedula } from '../utils/validaciones';
import { 
  obtenerDocentes,
  obtenerDocentePorId,
  buscarDocentes, 
  crearDocente, 
  actualizarDocente, 
  eliminarDocente 
} from '../services/docenteService';
import '../styles/Docentes.css';

function Docentes({ usuario }) {
  const [docentes, setDocentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('activo');
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  const [showModal, setShowModal] = useState(false);
  const [docenteEdit, setDocenteEdit] = useState(null);
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    email: '',
    especialidad: '',
    titulo: '',
    carga_horaria: 0,
    estado: 'activo'
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [errorCedula, setErrorCedula] = useState('');
  
  // Modal de detalles
  const [showDetalles, setShowDetalles] = useState(false);
  const [docenteDetalle, setDocenteDetalle] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEdicion, setDatosEdicion] = useState({});
  const [fotoEdicion, setFotoEdicion] = useState(null);
  const [fotoPreviewDetalle, setFotoPreviewDetalle] = useState(null);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [docenteDelete, setDocenteDelete] = useState(null);

  useEffect(() => {
    cargarDocentes();
  }, [filtroEstado]);

  const cargarDocentes = async () => {
    try {
      const response = await obtenerDocentes();
      const docentesArray = Array.isArray(response) ? response : [];
      // Filtrar por estado
      const docentesFiltrados = filtroEstado === 'todos' 
        ? docentesArray 
        : docentesArray.filter(d => d.estado === filtroEstado);
      setDocentes(docentesFiltrados);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
      mostrarAlert('danger', 'Error al cargar docentes');
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      cargarDocentes();
      return;
    }

    try {
      const response = await buscarDocentes(busqueda);
      setDocentes(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al buscar:', error);
      mostrarAlert('danger', 'Error al buscar docentes');
    }
  };

  const handleVerDetalles = (docente) => {
    setDocenteDetalle(docente);
    
    // Formatear fecha correctamente para el input date (evitar problemas de zona horaria)
    let fechaFormateada = '';
    if (docente.fecha_nacimiento) {
      // Extraer solo la parte de la fecha (YYYY-MM-DD) sin conversión de zona horaria
      fechaFormateada = docente.fecha_nacimiento.split('T')[0];
    }
    
    setDatosEdicion({
      cedula: docente.cedula || '',
      nombres: docente.nombres || '',
      apellidos: docente.apellidos || '',
      fecha_nacimiento: fechaFormateada,
      direccion: docente.direccion || '',
      telefono: docente.telefono || '',
      email: docente.email || '',
      especialidad: docente.especialidad || '',
      titulo: docente.titulo || '',
      carga_horaria: docente.carga_horaria !== undefined ? docente.carga_horaria : 0,
      estado: docente.estado || 'activo'
    });
    setFotoEdicion(null);
    setFotoPreviewDetalle(null);
    setModoEdicion(false);
    setShowDetalles(true);
  };

  const handleNuevo = () => {
    setDocenteEdit(null);
    setFormData({
      cedula: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      direccion: '',
      telefono: '',
      email: '',
      especialidad: '',
      titulo: '',
      carga_horaria: 0,
      estado: 'activo'
    });
    setFotoFile(null);
    setShowModal(true);
  };

  const handleEditar = (docente) => {
    setDocenteEdit(docente);
    setFormData({
      cedula: docente.cedula || '',
      nombres: docente.nombres || '',
      apellidos: docente.apellidos || '',
      fecha_nacimiento: docente.fecha_nacimiento || '',
      direccion: docente.direccion || '',
      telefono: docente.telefono || '',
      email: docente.email || '',
      especialidad: docente.especialidad || '',
      titulo: docente.titulo || '',
      carga_horaria: docente.carga_horaria || 0,
      estado: docente.estado || 'activo'
    });
    setFotoFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar cédula ecuatoriana
    const errorValidacion = obtenerErrorCedula(formData.cedula);
    if (errorValidacion) {
      mostrarAlert('danger', errorValidacion);
      setErrorCedula(errorValidacion);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') data.append(key, formData[key]);
      });
      if (fotoFile) {
        data.append('foto', fotoFile);
      }

      let response;
      if (docenteEdit) {
        response = await actualizarDocente(docenteEdit.id, data);
      } else {
        response = await crearDocente(data);
      }

      mostrarAlert('success', docenteEdit ? 'Docente actualizado exitosamente' : 'Docente creado exitosamente');
      setShowModal(false);
      cargarDocentes();
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarAlert('danger', error.response?.data?.error || 'Error al guardar docente');
    }
  };

  const handleGuardarDesdeDetalles = async () => {
    try {
      // Validar cédula si se está cambiando
      const cedulaActual = datosEdicion.cedula || docenteDetalle.cedula;
      if (datosEdicion.cedula && datosEdicion.cedula !== docenteDetalle.cedula) {
        const errorValidacion = obtenerErrorCedula(cedulaActual);
        if (errorValidacion) {
          mostrarAlert('danger', errorValidacion);
          return;
        }
      }
      
      const data = new FormData();
      
      // Agregar todos los campos, combinando ediciones con valores originales
      data.append('nombres', datosEdicion.nombres || docenteDetalle.nombres);
      data.append('apellidos', datosEdicion.apellidos || docenteDetalle.apellidos);
      data.append('cedula', cedulaActual);
      
      // Manejar fecha correctamente
      const fechaNacimiento = datosEdicion.fecha_nacimiento || docenteDetalle.fecha_nacimiento;
      if (fechaNacimiento) {
        // Si la fecha ya tiene formato completo (con T), usarla tal cual, si no, agregar T12:00:00
        const fechaFormateada = fechaNacimiento.includes('T') 
          ? fechaNacimiento 
          : fechaNacimiento + 'T12:00:00';
        data.append('fecha_nacimiento', fechaFormateada);
      }
      
      data.append('email', datosEdicion.email || docenteDetalle.email || '');
      data.append('telefono', datosEdicion.telefono || docenteDetalle.telefono || '');
      data.append('direccion', datosEdicion.direccion || docenteDetalle.direccion || '');
      data.append('especialidad', datosEdicion.especialidad || docenteDetalle.especialidad || '');
      data.append('titulo', datosEdicion.titulo || docenteDetalle.titulo || '');
      data.append('carga_horaria', datosEdicion.carga_horaria !== undefined ? datosEdicion.carga_horaria : (docenteDetalle.carga_horaria || 0));
      data.append('estado', datosEdicion.estado || docenteDetalle.estado);
      
      if (fotoEdicion) {
        data.append('foto', fotoEdicion);
      }

      const resultado = await actualizarDocente(docenteDetalle.id, data);
      
      // Actualizar el estado local inmediatamente con la respuesta del servidor
      setDocenteDetalle(resultado);
      setDatosEdicion({
        nombres: resultado.nombres || '',
        apellidos: resultado.apellidos || '',
        cedula: resultado.cedula || '',
        fecha_nacimiento: resultado.fecha_nacimiento ? resultado.fecha_nacimiento.split('T')[0] : '',
        email: resultado.email || '',
        telefono: resultado.telefono || '',
        direccion: resultado.direccion || '',
        especialidad: resultado.especialidad || '',
        titulo: resultado.titulo || '',
        carga_horaria: resultado.carga_horaria !== undefined ? resultado.carga_horaria : 0,
        estado: resultado.estado || 'activo'
      });
      
      setModoEdicion(false);
      setFotoEdicion(null);
      setFotoPreviewDetalle(null);
      
      mostrarAlert('success', 'Docente actualizado exitosamente');
      
      // Recargar la lista completa
      cargarDocentes();
    } catch (error) {
      console.error('Error al actualizar:', error);
      mostrarAlert('danger', 'Error al actualizar docente');
    }
  };

  const handleEliminar = (docente) => {
    setDocenteDelete(docente);
    setShowConfirm(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarDocente(docenteDelete.id);
      
      // Cerrar modal inmediatamente
      setShowConfirm(false);
      
      // Actualizar estado local inmediatamente
      setDocentes(prevDocentes => {
        const updated = prevDocentes.map(doc => 
          doc.id === docenteDelete.id 
            ? { ...doc, estado: 'inactivo' } 
            : doc
        );
        
        // Aplicar filtro
        if (filtroEstado === 'activo') {
          return updated.filter(doc => doc.estado === 'activo');
        } else if (filtroEstado === 'inactivo') {
          return updated.filter(doc => doc.estado === 'inactivo');
        }
        return updated; // 'todos'
      });
      
      mostrarAlert('success', 'Docente cambiado a inactivo exitosamente');
      
      // Recargar datos del servidor para asegurar sincronización
      setTimeout(() => cargarDocentes(), 100);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      mostrarAlert('danger', 'Error al cambiar estado del docente');
      setShowConfirm(false);
    }
  };

  const mostrarAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  if (cargando) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4">
        <i className="bi bi-person-badge me-2"></i>
        Gestión de Docentes
      </h2>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={5}>
              <Form onSubmit={handleBuscar}>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre, ID o especialidad..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    Buscar
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => { setBusqueda(''); cargarDocentes(); }}
                  >
                    Limpiar
                  </Button>
                </div>
              </Form>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
                <option value="todos">Todos</option>
              </Form.Select>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="success" onClick={handleNuevo}>
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Docente
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <i className="bi bi-list-ul me-2"></i>
          Lista de Docentes ({docentes.length})
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped hover className="mb-0 docentes-table">
              <thead>
                <tr>
                  <th style={{width: '80px'}}>Foto</th>
                  <th>ID</th>
                  <th>Cédula</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Especialidad</th>
                  <th>Estado</th>
                  <th style={{width: '100px', textAlign: 'center'}}>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {docentes.length > 0 ? (
                  docentes.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        {doc.foto ? (
                          <img 
                            src={`http://localhost:3001${doc.foto}`}
                            alt={`${doc.nombres} ${doc.apellidos}`}
                            className="docente-foto"
                            onClick={() => handleVerDetalles(doc)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            title="Ver detalles"
                          />
                        ) : null}
                        <div 
                          className="foto-placeholder"
                          style={{display: doc.foto ? 'none' : 'flex'}}
                          onClick={() => handleVerDetalles(doc)}
                          title="Ver detalles"
                        >
                          <i className="bi bi-person-fill"></i>
                        </div>
                      </td>
                      <td>{doc.id}</td>
                      <td>{doc.cedula}</td>
                      <td className="docente-nombre">{doc.nombres}</td>
                      <td className="docente-nombre">{doc.apellidos}</td>
                      <td className="docente-especialidad">{doc.especialidad || '-'}</td>
                      <td>
                        <span className={`badge estado-badge ${doc.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'}`}>
                          <i className={`bi ${doc.estado === 'activo' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                          {doc.estado}
                        </span>
                      </td>
                      <td style={{textAlign: 'center'}}>
                        {doc.estado === 'activo' && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            className="btn-eliminar"
                            onClick={() => handleEliminar(doc)}
                            title="Cambiar a inactivo"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No hay docentes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de Formulario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {docenteEdit ? 'Editar Docente' : 'Nuevo Docente'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {alert.type && alert.message && (
              <AlertMessage 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert({ type: '', message: '' })}
              />
            )}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cédula *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cedula}
                    onChange={(e) => {
                      const cedula = e.target.value.replace(/\D/g, '');
                      setFormData({...formData, cedula});
                      // Validar en tiempo real
                      if (cedula.length === 10) {
                        const error = obtenerErrorCedula(cedula);
                        setErrorCedula(error || '');
                      } else {
                        setErrorCedula('');
                      }
                    }}
                    required
                    maxLength="10"
                    isInvalid={!!errorCedula && formData.cedula.length === 10}
                    isValid={formData.cedula.length === 10 && !errorCedula}
                  />
                  {errorCedula && formData.cedula.length === 10 && (
                    <Form.Control.Feedback type="invalid">
                      {errorCedula}
                    </Form.Control.Feedback>
                  )}
                  {!errorCedula && formData.cedula.length === 10 && (
                    <Form.Control.Feedback type="valid">
                      Cédula válida
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    Cédula ecuatoriana de 10 dígitos
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nombres}
                    onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                    max="2010-12-31"
                  />
                  <Form.Text className="text-muted">
                    Fecha máxima: 31/12/2010
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\D/g, '');
                      if (valor.length <= 10) {
                        setFormData({...formData, telefono: valor});
                      }
                    }}
                    maxLength="10"
                    pattern="[0-9]{10}"
                    isInvalid={formData.telefono && formData.telefono.length !== 10 && formData.telefono.length > 0}
                    isValid={formData.telefono && formData.telefono.length === 10}
                  />
                  {formData.telefono && formData.telefono.length !== 10 && formData.telefono.length > 0 && (
                    <Form.Control.Feedback type="invalid">
                      Debe ingresar exactamente 10 dígitos
                    </Form.Control.Feedback>
                  )}
                  {formData.telefono && formData.telefono.length === 10 && (
                    <Form.Control.Feedback type="valid">
                      Teléfono válido
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    10 dígitos numéricos
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Especialidad</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.especialidad}
                    onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Carga Horaria</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.carga_horaria}
                    onChange={(e) => setFormData({...formData, carga_horaria: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                   
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Foto</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFotoFile(e.target.files[0])}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              <i className="bi bi-save me-2"></i>
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de Detalles */}
      <Modal show={showDetalles} onHide={() => { setShowDetalles(false); setModoEdicion(false); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Docente</Modal.Title>
        </Modal.Header>
        {docenteDetalle && (
          <Modal.Body>
            {alert.type && alert.message && (
              <AlertMessage 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert({ type: '', message: '' })}
              />
            )}
            <Row>
              <Col md={4} className="text-center mb-3">
                {!modoEdicion ? (
                  <>
                    {(fotoPreviewDetalle || docenteDetalle.foto) ? (
                      <img 
                        src={fotoPreviewDetalle || `http://localhost:3001${docenteDetalle.foto}`}
                        alt={`${docenteDetalle.nombres} ${docenteDetalle.apellidos}`}
                        className="foto-perfil-modal"
                      />
                    ) : (
                      <div className="foto-perfil-placeholder-modal">
                        <i className="bi bi-person"></i>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <img 
                      src={fotoPreviewDetalle || `http://localhost:3001${docenteDetalle.foto}`}
                      alt="Vista previa"
                      className="foto-perfil-modal"
                      style={{ marginBottom: '10px' }}
                    />
                    <Form.Control
                      type="file"
                      accept="image/*"
                      size="sm"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFotoEdicion(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFotoPreviewDetalle(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-hash me-2"></i>ID:</strong>
                      <div className="text-muted">{docenteDetalle.id}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-card-text me-2"></i>Cédula:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="text"
                          value={datosEdicion.cedula}
                          onChange={(e) => {
                            const cedula = e.target.value.replace(/\D/g, '');
                            setDatosEdicion({...datosEdicion, cedula});
                          }}
                          size="sm"
                          maxLength="10"
                        />
                      ) : (
                        <div className="text-muted">{docenteDetalle.cedula}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-person me-2"></i>Nombres:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="text"
                          value={datosEdicion.nombres}
                          onChange={(e) => setDatosEdicion({...datosEdicion, nombres: e.target.value})}
                          size="sm"
                        />
                      ) : (
                        <div className="text-muted">{docenteDetalle.nombres}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-person me-2"></i>Apellidos:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="text"
                          value={datosEdicion.apellidos}
                          onChange={(e) => setDatosEdicion({...datosEdicion, apellidos: e.target.value})}
                          size="sm"
                        />
                      ) : (
                        <div className="text-muted">{docenteDetalle.apellidos}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-envelope me-2"></i>Email:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="email"
                          value={datosEdicion.email}
                          onChange={(e) => setDatosEdicion({...datosEdicion, email: e.target.value})}
                          size="sm"
                        />
                      ) : (
                        <div className="text-muted">{docenteDetalle.email || 'No especificado'}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-telephone me-2"></i>Teléfono:</strong>
                      {modoEdicion ? (
                        <>
                          <Form.Control
                            type="text"
                            value={datosEdicion.telefono}
                            onChange={(e) => {
                              const valor = e.target.value.replace(/\D/g, '');
                              if (valor.length <= 10) {
                                setDatosEdicion({...datosEdicion, telefono: valor});
                              }
                            }}
                            size="sm"
                            maxLength="10"
                            pattern="[0-9]{10}"
                            isInvalid={datosEdicion.telefono && datosEdicion.telefono.length !== 10 && datosEdicion.telefono.length > 0}
                            isValid={datosEdicion.telefono && datosEdicion.telefono.length === 10}
                          />
                          {datosEdicion.telefono && datosEdicion.telefono.length !== 10 && datosEdicion.telefono.length > 0 && (
                            <Form.Control.Feedback type="invalid">
                              Debe ingresar exactamente 10 dígitos
                            </Form.Control.Feedback>
                          )}
                        </>
                      ) : (
                        <div className="text-muted">{docenteDetalle.telefono || 'No especificado'}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-calendar me-2"></i>Fecha de Nacimiento:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="date"
                          value={datosEdicion.fecha_nacimiento}
                          onChange={(e) => setDatosEdicion({...datosEdicion, fecha_nacimiento: e.target.value})}
                          size="sm"
                          max="2010-12-31"
                        />
                      ) : (
                        <div className="text-muted">
                          {docenteDetalle.fecha_nacimiento 
                            ? new Date(docenteDetalle.fecha_nacimiento).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'No especificada'}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-bookmark-fill me-2"></i>Especialidad:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="text"
                          value={datosEdicion.especialidad}
                          onChange={(e) => setDatosEdicion({...datosEdicion, especialidad: e.target.value})}
                          size="sm"
                        />
                      ) : (
                        <div className="text-muted">{docenteDetalle.especialidad || 'No especificada'}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-award me-2"></i>Título:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="text"
                          value={datosEdicion.titulo}
                          onChange={(e) => setDatosEdicion({...datosEdicion, titulo: e.target.value})}
                          size="sm"
                        />
                      ) : (
                        <div className="text-muted">{docenteDetalle.titulo || 'No especificado'}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-clock me-2"></i>Carga Horaria:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="number"
                          min="0"
                          value={datosEdicion.carga_horaria}
                          onChange={(e) => setDatosEdicion({...datosEdicion, carga_horaria: e.target.value})}
                          size="sm"
                        />
                      ) : (
                        <div className="text-muted">{docenteDetalle.carga_horaria || 0} horas</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-toggle-on me-2"></i>Estado:</strong>
                      {modoEdicion ? (
                        <Form.Select
                          value={datosEdicion.estado || 'activo'}
                          onChange={(e) => setDatosEdicion({...datosEdicion, estado: e.target.value})}
                          size="sm"
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </Form.Select>
                      ) : (
                        <div className="text-muted">
                          <span className={`badge estado-badge ${docenteDetalle.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'}`}>
                            {docenteDetalle.estado}
                          </span>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="mb-3">
                      <strong><i className="bi bi-geo-alt me-2"></i>Dirección:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={datosEdicion.direccion}
                          onChange={(e) => setDatosEdicion({...datosEdicion, direccion: e.target.value})}
                          size="sm"
                        />
                      ) : (
                        <div className="text-muted">{docenteDetalle.direccion || 'No especificada'}</div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { 
            setShowDetalles(false); 
            setModoEdicion(false);
            setFotoPreviewDetalle(null);
            setFotoEdicion(null);
          }}>
            Cerrar
          </Button>
          {!modoEdicion ? (
            <Button variant="warning" onClick={() => setModoEdicion(true)}>
              <i className="bi bi-pencil me-2"></i>
              Editar
            </Button>
          ) : (
            <>
              <Button variant="outline-secondary" onClick={() => {
                setModoEdicion(false);
                setFotoPreviewDetalle(null);
                setFotoEdicion(null);
                setDatosEdicion({
                  cedula: docenteDetalle.cedula || '',
                  nombres: docenteDetalle.nombres || '',
                  apellidos: docenteDetalle.apellidos || '',
                  fecha_nacimiento: docenteDetalle.fecha_nacimiento ? docenteDetalle.fecha_nacimiento.split('T')[0] : '',
                  direccion: docenteDetalle.direccion || '',
                  telefono: docenteDetalle.telefono || '',
                  email: docenteDetalle.email || '',
                  especialidad: docenteDetalle.especialidad || '',
                  titulo: docenteDetalle.titulo || '',
                  carga_horaria: docenteDetalle.carga_horaria !== undefined ? docenteDetalle.carga_horaria : 0,
                  estado: docenteDetalle.estado || 'activo'
                });
              }}>
                <i className="bi bi-x me-2"></i>
                Cancelar
              </Button>
              <Button variant="success" onClick={handleGuardarDesdeDetalles}>
                <i className="bi bi-save me-2"></i>
                Guardar
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmarEliminar}
        title="Cambiar Estado del Docente"
        message={`¿Está seguro que desea cambiar a INACTIVO al docente ${docenteDelete?.nombres} ${docenteDelete?.apellidos}?`}
      />
    </div>
  );
}

export default Docentes;
