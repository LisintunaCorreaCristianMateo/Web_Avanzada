import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import ConfirmModal from '../components/ConfirmModal';
import {obtenerErrorCedula } from '../utils/validaciones';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/Estudiantes.css';
import { 
  obtenerEstudiantes, 
  crearEstudiante, 
  actualizarEstudiante, 
  eliminarEstudiante 
} from '../services/estudianteService';
import { obtenerAsignaturas } from '../services/asignaturaService';
import { crearMatricula, obtenerMatriculasPorEstudiante, eliminarMatricula } from '../services/matriculaService';

function Estudiantes({ usuario }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('activo');
  const [alert, setAlert] = useState({ type: '', message: '' });
  
  // Modal de formulario
  const [showModal, setShowModal] = useState(false);
  const [estudianteEdit, setEstudianteEdit] = useState(null);
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    email: '',
    estado: 'activo'
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [errorCedula, setErrorCedula] = useState('');
  
  // Modal de detalles
  const [showDetalles, setShowDetalles] = useState(false);
  const [estudianteDetalle, setEstudianteDetalle] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEdicion, setDatosEdicion] = useState({});
  const [fotoEdicion, setFotoEdicion] = useState(null);
  const [fotoPreviewDetalle, setFotoPreviewDetalle] = useState(null);
  
  // Matrícula
  const [mostrarAsignacion, setMostrarAsignacion] = useState(false);
  const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);
  const [matriculasEstudiante, setMatriculasEstudiante] = useState([]);
  
  // Modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [estudianteDelete, setEstudianteDelete] = useState(null);
  // Confirmación para eliminar matrícula
  const [showConfirmMatricula, setShowConfirmMatricula] = useState(false);
  const [matriculaDelete, setMatriculaDelete] = useState(null);

  const cargarDatos = useCallback(async () => {
    console.log('Estudiantes mounted - llamando a cargarDatos');
    try {
      const [estudiantesData, asignaturasData] = await Promise.all([
        obtenerEstudiantes('', filtroEstado),
        obtenerAsignaturas()
      ]);
      console.log('API obtenerEstudiantes ->', estudiantesData);
      console.log('API obtenerAsignaturas ->', asignaturasData);
      setEstudiantes(Array.isArray(estudiantesData) ? estudiantesData : []);
      setAsignaturas(Array.isArray(asignaturasData) ? asignaturasData : []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      mostrarAlert('danger', 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  }, [filtroEstado]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (busqueda.trim()) {
        try {
          setCargando(true);
          const response = await obtenerEstudiantes(busqueda, filtroEstado);
          setEstudiantes(Array.isArray(response) ? response : []);
        } catch (error) {
          console.error('Error al buscar:', error);
          mostrarAlert('danger', 'Error al buscar estudiantes');
        } finally {
          setCargando(false);
        }
      } else {
        cargarDatos();
      }
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    return () => clearTimeout(delayDebounce);
  }, [busqueda, filtroEstado, cargarDatos]);

  const handleNuevo = () => {
    setEstudianteEdit(null);
    setFormData({
      cedula: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      direccion: '',
      telefono: '',
      email: '',
      estado: 'activo'
    });
    setFotoFile(null);
    setFotoPreview(null);
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
        if (formData[key]) {
          // Manejar fecha correctamente para evitar problemas de zona horaria
          if (key === 'fecha_nacimiento') {
            data.append(key, formData[key] + 'T12:00:00');
          } else {
            data.append(key, formData[key]);
          }
        }
      });
      if (fotoFile) {
        data.append('foto', fotoFile);
      }

      if (estudianteEdit) {
        await actualizarEstudiante(estudianteEdit.id, data);
      } else {
        await crearEstudiante(data);
      }

      mostrarAlert('success', estudianteEdit ? 'Estudiante actualizado exitosamente' : 'Estudiante creado exitosamente');
      setShowModal(false);
      setErrorCedula('');
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarAlert('danger', error.response?.data?.error || 'Error al guardar estudiante');
    }
  };

  const handleVerDetalles = async (estudiante) => {
    setEstudianteDetalle(estudiante);
    
    // Formatear fecha correctamente para el input date (evitar problemas de zona horaria)
    let fechaFormateada = '';
    if (estudiante.fecha_nacimiento) {
      // Extraer solo la parte de la fecha (YYYY-MM-DD) sin conversión de zona horaria
      fechaFormateada = estudiante.fecha_nacimiento.split('T')[0];
    }
    
    setDatosEdicion({
      nombres: estudiante.nombres || '',
      apellidos: estudiante.apellidos || '',
      cedula: estudiante.cedula || '',
      fecha_nacimiento: fechaFormateada,
      email: estudiante.email || '',
      telefono: estudiante.telefono || '',
      direccion: estudiante.direccion || '',
      estado: estudiante.estado || 'activo'
    });
    setFotoEdicion(null);
    setFotoPreviewDetalle(null);
    setModoEdicion(false);
    setShowDetalles(true);
    
    // Cargar matrículas del estudiante
    try {
      const matriculas = await obtenerMatriculasPorEstudiante(estudiante.id);
      setMatriculasEstudiante(Array.isArray(matriculas) ? matriculas : []);
    } catch (error) {
      console.error('Error al cargar matrículas:', error);
      setMatriculasEstudiante([]);
    }
  };

  const handleGuardarDesdeDetalles = async () => {
    try {
      // Validar cédula si se está cambiando
      const cedulaActual = datosEdicion.cedula || estudianteDetalle.cedula;
      if (datosEdicion.cedula && datosEdicion.cedula !== estudianteDetalle.cedula) {
        const errorValidacion = obtenerErrorCedula(cedulaActual);
        if (errorValidacion) {
          mostrarAlert('danger', errorValidacion);
          return;
        }
      }
      
      const data = new FormData();
      
      // Agregar todos los campos editados
      data.append('nombres', datosEdicion.nombres || estudianteDetalle.nombres);
      data.append('apellidos', datosEdicion.apellidos || estudianteDetalle.apellidos);
      data.append('cedula', cedulaActual);
      
      // Manejar fecha correctamente para evitar problemas de zona horaria
      const fechaNacimiento = datosEdicion.fecha_nacimiento || estudianteDetalle.fecha_nacimiento;
      if (fechaNacimiento) {
        // Agregar la hora del mediodía para evitar cambios por zona horaria
        data.append('fecha_nacimiento', fechaNacimiento + 'T12:00:00');
      }
      
      data.append('email', datosEdicion.email || estudianteDetalle.email || '');
      data.append('telefono', datosEdicion.telefono || estudianteDetalle.telefono || '');
      data.append('direccion', datosEdicion.direccion || estudianteDetalle.direccion || '');
      data.append('estado', datosEdicion.estado || estudianteDetalle.estado);
      
      if (fotoEdicion) {
        data.append('foto', fotoEdicion);
      }

      const resultado = await actualizarEstudiante(estudianteDetalle.id, data);
      
      // Formatear fecha correctamente para el estado (evitar problemas de zona horaria)
      let fechaFormateada = '';
      if (resultado.fecha_nacimiento) {
        // Extraer solo la parte de la fecha (YYYY-MM-DD) sin conversión de zona horaria
        fechaFormateada = resultado.fecha_nacimiento.split('T')[0];
      }
      
      // Actualizar el estado local inmediatamente con la respuesta del servidor
      setEstudianteDetalle(resultado);
      setDatosEdicion({
        nombres: resultado.nombres || '',
        apellidos: resultado.apellidos || '',
        cedula: resultado.cedula || '',
        fecha_nacimiento: fechaFormateada,
        email: resultado.email || '',
        telefono: resultado.telefono || '',
        direccion: resultado.direccion || '',
        estado: resultado.estado || 'activo'
      });
      
      setModoEdicion(false);
      setFotoEdicion(null);
      setFotoPreviewDetalle(null);
      
      mostrarAlert('success', 'Estudiante actualizado exitosamente');
      
      // Recargar la lista completa
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarAlert('danger', error.response?.data?.error || 'Error al guardar estudiante');
    }
  };

  const handleFotoChangeDetalle = (e) => {
    const file = e.target.files[0];
    setFotoEdicion(file);
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        mostrarAlert('danger', 'Solo se permiten archivos de imagen');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        mostrarAlert('danger', 'El archivo debe ser menor a 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreviewDetalle(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFotoPreviewDetalle(null);
    }
  };

  const handleEliminar = (estudiante) => {
    setEstudianteDelete(estudiante);
    setShowConfirm(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarEstudiante(estudianteDelete.id);
      
      // Actualizar estado local inmediatamente
      setEstudiantes(prevEstudiantes => 
        prevEstudiantes.map(est => 
          est.id === estudianteDelete.id 
            ? { ...est, estado: 'inactivo' } 
            : est
        ).filter(est => filtroEstado === 'todos' || est.estado === filtroEstado)
      );
      
      mostrarAlert('success', 'Estudiante cambiado a inactivo exitosamente');
      setShowConfirm(false);
      
      // Recargar datos del servidor para asegurar sincronización
      setTimeout(() => cargarDatos(), 100);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      mostrarAlert('danger', 'Error al cambiar estado del estudiante');
    }
  };

  const handleEliminarMatricula = (matricula) => {
    setMatriculaDelete(matricula);
    setShowConfirmMatricula(true);
  };

  const confirmarEliminarMatricula = async () => {
    if (!matriculaDelete) return;
    try {
      await eliminarMatricula(matriculaDelete.id);
      // Quitarla del estado local
      setMatriculasEstudiante(prev => prev.filter(m => m.id !== matriculaDelete.id));
      mostrarAlert('success', 'Matrícula eliminada exitosamente');
      setShowConfirmMatricula(false);
      setMatriculaDelete(null);
      // Recargar lista general por si aplica
      setTimeout(() => cargarDatos(), 100);
    } catch (error) {
      console.error('Error al eliminar matrícula:', error);
      mostrarAlert('danger', 'Error al eliminar matrícula');
      setShowConfirmMatricula(false);
    }
  };

  const mostrarAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const descargarMatriculaPDF = async () => {
    if (!estudianteDetalle) return;

    try {
      // Crear nuevo documento PDF
      const doc = new jsPDF();
      
      // Configurar fuentes
      doc.setFont("helvetica");
      
      // Encabezado
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('CERTIFICADO DE MATRÍCULA', 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text('Sistema de Gestión Académica', 105, 25, { align: 'center' });
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 32, { align: 'center' });
      
      // Información del estudiante
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('DATOS DEL ESTUDIANTE', 20, 50);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      let yPos = 60;
      const lineHeight = 8;
      
      doc.setFont("helvetica", "bold");
      doc.text('Nombres:', 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${estudianteDetalle.nombres} ${estudianteDetalle.apellidos}`, 60, yPos);
      
      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text('Cédula:', 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(estudianteDetalle.cedula || 'N/A', 60, yPos);
      
      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text('Email:', 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(estudianteDetalle.email || 'N/A', 60, yPos);
      
      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text('Teléfono:', 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(estudianteDetalle.telefono || 'N/A', 60, yPos);
      
      yPos += lineHeight;
      doc.setFont("helvetica", "bold");
      doc.text('Estado:', 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(estudianteDetalle.estado || 'activo', 60, yPos);
      
      // Asignaturas matriculadas
      yPos += lineHeight + 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('ASIGNATURAS MATRICULADAS', 20, yPos);
      
      yPos += 5;
      
      if (matriculasEstudiante && matriculasEstudiante.length > 0) {
        const tableData = matriculasEstudiante.map((mat, index) => [
          index + 1,
          mat.asignatura?.nombre || 'N/A',
          mat.asignatura?.nrc || 'N/A',
          mat.asignatura?.creditos || 'N/A',
          mat.asignatura?.nivel || 'N/A',
          mat.estado || 'activo'
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Asignatura', 'NRC', 'Créd.', 'Nivel', 'Estado']],
          body: tableData,
          theme: 'grid',
          margin: { left: 15, right: 15 },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 9
          },
          bodyStyles: {
            halign: 'center',
            fontSize: 8
          },
          columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 75, halign: 'left' },
            2: { cellWidth: 18, halign: 'center' },
            3: { cellWidth: 15, halign: 'center' },
            4: { cellWidth: 30, halign: 'center' },
            5: { cellWidth: 22, halign: 'center' }
          }
        });
        
        // Total de créditos
        const totalCreditos = matriculasEstudiante.reduce((sum, mat) => 
          sum + (parseInt(mat.asignatura?.creditos) || 0), 0
        );
        
        // Obtener la posición Y final de la tabla
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : yPos + 10;
        yPos = finalY + 10;
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Total de Créditos: ${totalCreditos}`, 20, yPos);
        doc.text(`Total de Asignaturas: ${matriculasEstudiante.length}`, 20, yPos + 7);
      } else {
        yPos += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text('No hay asignaturas matriculadas', 20, yPos);
      }
      
      // Pie de página
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(128, 128, 128);
      doc.text('Este documento es válido solo como certificado de matrícula', 105, pageHeight - 20, { align: 'center' });
      doc.text('Sistema de Gestión Académica - ' + new Date().getFullYear(), 105, pageHeight - 15, { align: 'center' });
      
      // Línea de firma
      doc.setDrawColor(0, 0, 0);
      doc.line(130, pageHeight - 35, 190, pageHeight - 35);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text('Firma Autorizada', 160, pageHeight - 30, { align: 'center' });
      
      // Guardar el PDF
      doc.save(`Matricula_${estudianteDetalle.cedula}_${estudianteDetalle.apellidos}.pdf`);
      
      mostrarAlert('success', 'PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      mostrarAlert('danger', 'Error al generar el PDF');
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file);
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        mostrarAlert('danger', 'Solo se permiten archivos de imagen');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        mostrarAlert('danger', 'El archivo debe ser menor a 5MB');
        return;
      }
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFotoPreview(null);
    }
  };

  if (cargando) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4">
        <i className="bi bi-people me-2"></i>
        Gestión de Estudiantes
      </h2>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <Form.Control
                  type="text"
                  placeholder="Buscar por ID, cédula, nombre o apellido..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  autoFocus
                />
                {busqueda && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setBusqueda('')}
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                )}
              </div>
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
            <Col md={3} className="text-end">
              <Button variant="success" onClick={handleNuevo}>
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Estudiante
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="estudiantes-card">
        <Card.Header className="estudiantes-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5>
              <i className="bi bi-people-fill me-2"></i>
              Lista de Estudiantes
            </h5>
            <span className="badge estudiantes-badge">{estudiantes.length}</span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="estudiantes-table align-middle">
              <thead>
                <tr>
                  <th style={{width: '80px'}}>Foto</th>
                  <th>ID</th>
                  <th>Cédula</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Estado</th>
                  <th style={{width: '100px', textAlign: 'center'}}>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.length > 0 ? (
                  estudiantes.map((est) => (
                    <tr key={est.id}>
                      <td>
                        {est.foto ? (
                          <img 
                            src={`http://localhost:3001${est.foto}`}
                            alt={`${est.nombres} ${est.apellidos}`}
                            className="foto-estudiante"
                            onClick={() => handleVerDetalles(est)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            title="Ver detalles"
                          />
                        ) : null}
                        <div 
                          className="foto-placeholder"
                          style={{display: est.foto ? 'none' : 'flex'}}
                          onClick={() => handleVerDetalles(est)}
                          title="Ver detalles"
                        >
                          <i className="bi bi-person-fill"></i>
                        </div>
                      </td>
                      <td className="estudiante-id">{est.id}</td>
                      <td>{est.cedula}</td>
                      <td className="estudiante-nombre">{est.nombres}</td>
                      <td className="estudiante-nombre">{est.apellidos}</td>
                      <td>
                        <span className={`badge estado-badge ${est.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'}`}>
                          <i className={`bi ${est.estado === 'activo' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                          {est.estado}
                        </span>
                      </td>
                      <td style={{textAlign: 'center'}}>
                        {est.estado === 'activo' && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            className="btn-eliminar"
                            onClick={() => handleEliminar(est)}
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
                    <td colSpan="8" className="no-estudiantes">
                      <i className="bi bi-inbox" style={{fontSize: '3rem', display: 'block', marginBottom: '1rem'}}></i>
                      No hay estudiantes registrados
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
            {estudianteEdit ? 'Editar Estudiante' : 'Nuevo Estudiante'}
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
                    pattern="[0-9]{10}"
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
                  <Form.Label>Foto del Estudiante</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    help="Formatos permitidos: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB"
                  />
                  <Form.Text className="text-muted">
                    Formatos permitidos: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
                  </Form.Text>
                  
                  {/* Vista previa de la foto */}
                  {fotoPreview && (
                    <div className="mt-3 text-center">
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={fotoPreview}
                          alt="Vista previa"
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: '2px solid #dee2e6'
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => {
                            setFotoPreview(null);
                            setFotoFile(null);
                            // Reset file input
                            const fileInput = document.querySelector('input[type="file"]');
                            if (fileInput) fileInput.value = '';
                          }}
                        >
                          <i className="bi bi-x" style={{ fontSize: '12px' }}></i>
                        </Button>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">
                          {fotoFile ? `${fotoFile.name} (${(fotoFile.size / 1024).toFixed(1)}KB)` : 'Foto actual'}
                        </small>
                      </div>
                    </div>
                  )}
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

      {/* Modal de Detalles del Estudiante */}
      <Modal show={showDetalles} onHide={() => { setShowDetalles(false); setModoEdicion(false); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-badge me-2"></i>
            {modoEdicion ? 'Editar Estudiante' : 'Detalles del Estudiante'}
          </Modal.Title>
          {!modoEdicion && (
            <Button 
              variant="danger" 
              size="sm"
              onClick={descargarMatriculaPDF}
              className="ms-auto me-2"
              style={{ position: 'absolute', right: '45px', top: '12px' }}
            >
              <i className="bi bi-file-pdf me-1"></i>
              Descargar Matrícula PDF
            </Button>
          )}
        </Modal.Header>
        <Modal.Body>
          {alert.type && alert.message && (
            <AlertMessage 
              type={alert.type} 
              message={alert.message} 
              onClose={() => setAlert({ type: '', message: '' })}
            />
          )}
          {estudianteDetalle && (
            <Row>
              <Col md={4} className="text-center mb-3">
                {!modoEdicion ? (
                  <>
                    {(fotoPreviewDetalle || estudianteDetalle.foto) ? (
                      <img 
                        src={fotoPreviewDetalle || `http://localhost:3001${estudianteDetalle.foto}`}
                        alt={`${estudianteDetalle.nombres} ${estudianteDetalle.apellidos}`}
                        className="foto-perfil-modal"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="foto-perfil-placeholder-modal" style={{display: (fotoPreviewDetalle || estudianteDetalle.foto) ? 'none' : 'flex'}}>
                      <i className="bi bi-person"></i>
                    </div>
                  </>
                ) : (
                  <div>
                    {(fotoPreviewDetalle || estudianteDetalle.foto) ? (
                      <img 
                        src={fotoPreviewDetalle || `http://localhost:3001${estudianteDetalle.foto}`}
                        alt="Vista previa"
                        className="foto-perfil-modal"
                        style={{marginBottom: '10px'}}
                      />
                    ) : (
                      <div className="foto-perfil-placeholder-modal" style={{marginBottom: '10px'}}>
                        <i className="bi bi-person"></i>
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFotoChangeDetalle}
                      size="sm"
                    />
                    <small className="text-muted d-block mt-1">Máx. 5MB</small>
                  </div>
                )}
                <div className="mt-3">
                  <span className={`badge estado-badge ${(modoEdicion ? datosEdicion.estado : estudianteDetalle.estado) === 'activo' ? 'estado-activo' : 'estado-inactivo'} fs-6`}>
                    {(modoEdicion ? datosEdicion.estado : estudianteDetalle.estado)?.toUpperCase()}
                  </span>
                </div>
              </Col>
              <Col md={8}>
                <h4 className="mb-3">
                  {modoEdicion ? 
                    `${datosEdicion.nombres} ${datosEdicion.apellidos}` :
                    `${estudianteDetalle.nombres} ${estudianteDetalle.apellidos}`
                  }
                </h4>
                <hr />
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-hash me-2"></i>ID:</strong>
                      <div className="text-muted">{estudianteDetalle.id}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-credit-card me-2"></i>Cédula:</strong>
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
                        <div className="text-muted">{estudianteDetalle.cedula}</div>
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
                        <div className="text-muted">{estudianteDetalle.nombres}</div>
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
                        <div className="text-muted">{estudianteDetalle.apellidos}</div>
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
                        <div className="text-muted">{estudianteDetalle.email || 'No especificado'}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-telephone me-2"></i>Teléfono:</strong>
                      {modoEdicion ? (
                        <>
                          <Form.Control
                            type="tel"
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
                        <div className="text-muted">{estudianteDetalle.telefono || 'No especificado'}</div>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong><i className="bi bi-calendar me-2"></i>Fecha de Nacimiento:</strong>
                      {modoEdicion ? (
                        <Form.Control
                          type="date"
                          value={datosEdicion.fecha_nacimiento || ''}
                          onChange={(e) => setDatosEdicion({...datosEdicion, fecha_nacimiento: e.target.value})}
                          size="sm"
                          max="2010-12-31"
                        />
                      ) : (
                        <div className="text-muted">
                          {estudianteDetalle.fecha_nacimiento 
                            ? new Date(estudianteDetalle.fecha_nacimiento).toLocaleDateString('es-ES')
                            : 'No especificada'}
                        </div>
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
                          <span className={`badge estado-badge ${estudianteDetalle.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'}`}>
                            {estudianteDetalle.estado}
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
                        <div className="text-muted">{estudianteDetalle.direccion || 'No especificada'}</div>
                      )}
                    </div>
                  </Col>
                  
                  {/* Cursos Matriculados */}
                  {!modoEdicion && estudianteDetalle.estado === 'activo' && (
                    <Col md={12}>
                      <div className="mb-3 mt-3 p-3 cursos-matriculados-container">
                        <strong className="d-block mb-3 cursos-matriculados-titulo">
                          <i className="bi bi-journal-bookmark-fill me-2"></i>
                          Cursos Matriculados:
                        </strong>
                        {matriculasEstudiante.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {matriculasEstudiante.map((matricula) => (
                              <span 
                                key={matricula.id} 
                                className="badge badge-asignatura-matriculada d-flex align-items-center"
                                style={{ gap: '8px' }}
                              >
                                <i className="bi bi-check-circle me-2"></i>
                                <span>{matricula.asignatura?.nrc} - {matricula.asignatura?.nombre}</span>
                                <Button 
                                  size="sm"
                                  variant="link"
                                  className="p-0 ms-2 text-danger"
                                  onClick={() => { setMatriculaDelete(matricula); setShowConfirmMatricula(true); }}
                                  title="Eliminar matrícula"
                                >
                                  <i className="bi bi-trash-fill"></i>
                                </Button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted fst-italic sin-asignacion">
                            <i className="bi bi-inbox me-2"></i>
                            Sin asignación
                          </div>
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!modoEdicion && mostrarAsignacion && (
            <div className="w-100 mb-3">
              <Form.Group>
                <Form.Label><strong>Seleccionar Asignaturas:</strong></Form.Label>
                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '0.375rem',
                  padding: '0.75rem'
                }}>
                  {asignaturas.length === 0 ? (
                    <p className="text-muted mb-0">No hay asignaturas disponibles</p>
                  ) : (
                    asignaturas.map(asig => (
                      <Form.Check 
                        key={asig.id}
                        type="checkbox"
                        id={`asignatura-${asig.id}`}
                        label={`${asig.nrc} - ${asig.nombre}`}
                        checked={asignaturasSeleccionadas.includes(asig.id.toString())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAsignaturasSeleccionadas([...asignaturasSeleccionadas, asig.id.toString()]);
                          } else {
                            setAsignaturasSeleccionadas(asignaturasSeleccionadas.filter(id => id !== asig.id.toString()));
                          }
                        }}
                        className="mb-2"
                      />
                    ))
                  )}
                </div>
                <Form.Text className="text-muted">
                  Selecciona una o más asignaturas para matricular al estudiante
                </Form.Text>
                <div className="mt-2">
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={async () => {
                      if (asignaturasSeleccionadas.length > 0) {
                        try {
                          // Crear matrículas para cada asignatura seleccionada
                          const promesas = asignaturasSeleccionadas.map(asignaturaId => 
                            crearMatricula({
                              estudiante_id: estudianteDetalle.id,
                              asignatura_id: asignaturaId,
                              estado: 'activo'
                            })
                          );
                          await Promise.all(promesas);
                          mostrarAlert('success', `Estudiante matriculado en ${asignaturasSeleccionadas.length} asignatura(s) exitosamente`);
                          setMostrarAsignacion(false);
                          setAsignaturasSeleccionadas([]);
                          
                          // Recargar matrículas para actualizar la lista
                          const matriculas = await obtenerMatriculasPorEstudiante(estudianteDetalle.id);
                          setMatriculasEstudiante(Array.isArray(matriculas) ? matriculas : []);
                        } catch (error) {
                          console.error('Error al matricular:', error);
                          mostrarAlert('danger', 'Error al matricular estudiante');
                        }
                      } else {
                        mostrarAlert('warning', 'Seleccione al menos una asignatura');
                      }
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar Matrícula
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="ms-2"
                    onClick={() => {
                      setMostrarAsignacion(false);
                      setAsignaturasSeleccionadas([]);
                    }}
                  >
                    <i className="bi bi-x me-2"></i>
                    Cancelar
                  </Button>
                </div>
              </Form.Group>
            </div>
          )}
          <Button variant="secondary" onClick={() => { 
            setShowDetalles(false); 
            setModoEdicion(false);
            setFotoPreviewDetalle(null);
            setFotoEdicion(null);
            setMostrarAsignacion(false);
            setAsignaturasSeleccionadas([]);
          }}>
            <i className="bi bi-x-circle me-2"></i>
            Cerrar
          </Button>
          {!modoEdicion ? (
            <>
              {estudianteDetalle?.estado === 'activo' && (
                <Button 
                  className="btn-asignar-curso"
                  onClick={() => setMostrarAsignacion(!mostrarAsignacion)}
                >
                  <i className="bi bi-book-half me-2"></i>
                  {mostrarAsignacion ? 'Ocultar Asignación' : 'Asignar Curso'}
                </Button>
              )}
              <Button variant="warning" onClick={() => setModoEdicion(true)}>
                <i className="bi bi-pencil me-2"></i>
                Editar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline-secondary" onClick={() => {
                setModoEdicion(false);
                setFotoPreviewDetalle(null);
                setFotoEdicion(null);
                setDatosEdicion({
                  nombres: estudianteDetalle.nombres || '',
                  apellidos: estudianteDetalle.apellidos || '',
                  cedula: estudianteDetalle.cedula || '',
                  fecha_nacimiento: estudianteDetalle.fecha_nacimiento || '',
                  email: estudianteDetalle.email || '',
                  telefono: estudianteDetalle.telefono || '',
                  direccion: estudianteDetalle.direccion || '',
                  estado: estudianteDetalle.estado || 'activo'
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

      {/* Modal de Confirmación */}
      <ConfirmModal
        show={showConfirmMatricula}
        onHide={() => setShowConfirmMatricula(false)}
        onConfirm={confirmarEliminarMatricula}
        title="Eliminar Matrícula"
        message={matriculaDelete ? `¿Eliminar la matrícula en ${matriculaDelete.asignatura?.nombre}? Esta acción eliminará la inscripción definitivamente.` : '¿Eliminar la matrícula?'}
      />
      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmarEliminar}
        title="Cambiar Estado del Estudiante"
        message={`¿Está seguro que desea cambiar a INACTIVO al estudiante ${estudianteDelete?.nombres} ${estudianteDelete?.apellidos}?`}
      />
    </div>
  );
}

export default Estudiantes;
