import React, { useState, useEffect } from 'react';
import '../styles/Notas.css';
import { Row, Col, Card, Table, Button, Form, Modal, Tab, Tabs, Badge } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import ConfirmModal from '../components/ConfirmModal';
import { 
  obtenerEvaluaciones, 
  crearEvaluacion, 
  actualizarEvaluacion, 
  eliminarEvaluacion,
  obtenerResumenEstudiante
} from '../services/notaService';
import { obtenerEstudiantes } from '../services/estudianteService';
import { obtenerAsignaturas } from '../services/asignaturaService';
import { obtenerMatriculasPorEstudiante } from '../services/matriculaService';

const TIPOS_EVALUACION = [
  { value: 'tarea', label: 'Tarea', porcentaje: 20 },
  { value: 'informe', label: 'Informe', porcentaje: 20 },
  { value: 'leccion', label: 'Lección', porcentaje: 20 },
  { value: 'examen', label: 'Examen', porcentaje: 40 }
];

function Notas({ usuario }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [agregados, setAgregados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Calcular y llenar agregados cada vez que cambian evaluaciones, estudiantes o asignaturas
  useEffect(() => {
    if (!evaluaciones.length || !estudiantes.length || !asignaturas.length) {
      setAgregados([]);
      return;
    }
    // Agrupar por estudiante y asignatura (solo estudiantes con matrícula activa)
    const agrupados = [];
    estudiantes.forEach(est => {
      if (!est.matricula_activa) return; // ignorar estudiantes sin matrícula activa
      // Obtener solo las asignaturas en las que el estudiante está matriculado
      const asignaturasMatriculadas = (est.matriculas || [])
        .map(m => m.asignatura)
        .filter(a => a != null);
      // Evitar duplicados por id
      const seen = new Set();
      const asignaturasUnicas = asignaturasMatriculadas.filter(a => {
        if (!a || !a.id) return false;
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });
      asignaturasUnicas.forEach(asig => {
        // Filtrar evaluaciones de este estudiante y asignatura
        const evals = evaluaciones.filter(ev => {
          const evEstId = ev.estudiante?.id || ev.estudiante_id;
          const evAsigId = ev.asignatura?.id || ev.asignatura_id;
          return evEstId === est.id && evAsigId === asig.id;
        });
        // SIEMPRE agregar el registro, aunque no tenga notas
        // Calcular notas por parcial
        let p1 = null, p2 = null, p3 = null, promedio = null, estadoP1 = '', estadoP2 = '', estadoP3 = '', estadoSem = '';
        [1,2,3].forEach(parcial => {
          const evalsParcial = evals.filter(ev => ev.parcial === parcial);
          if (evalsParcial.length > 0) {
            const suma = evalsParcial.reduce((sum, ev) => sum + ((parseFloat(ev.nota) * parseFloat(ev.porcentaje)) / 100), 0);
            if (parcial === 1) p1 = suma;
            if (parcial === 2) p2 = suma;
            if (parcial === 3) p3 = suma;
          }
        });
        // Promedio semestral: suma de los tres parciales dividido para 3 (aunque falte alguno)
        const parciales = [p1 ?? 0, p2 ?? 0, p3 ?? 0];
        promedio = (parciales[0] + parciales[1] + parciales[2]) / 3;
        // Estados
        estadoP1 = p1 != null ? (p1 >= 14 ? 'Aprobado parcial' : 'Reprobado parcial') : '';
        estadoP2 = p2 != null ? (p2 >= 14 ? 'Aprobado parcial' : 'Reprobado parcial') : '';
        estadoP3 = p3 != null ? (p3 >= 14 ? 'Aprobado parcial' : 'Reprobado parcial') : '';
        // Si la suma de los dos primeros parciales no supera 28, reprobó anticipado
        if ((p1 ?? 0) + (p2 ?? 0) < 28) {
          estadoSem = 'Reprobó anticipado';
        } else {
          estadoSem = promedio != null ? (promedio >= 14 ? 'Aprobado semestre' : 'Reprobado semestre') : '';
        }
        agrupados.push({
          estudiante: est,
          asignatura: asig,
          p1,
          p2,
          p3,
          promedio,
          estadoP1,
          estadoP2,
          estadoP3,
          estadoSem
        });
      });
    });
    setAgregados(agrupados);
  }, [evaluaciones, estudiantes, asignaturas]);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    estudiante_id: '',
    docente_id: '',
    asignatura_id: '',
    parcial: ''
  });

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [evaluacionEdit, setEvaluacionEdit] = useState(null);
  const [parcialFijo, setParcialFijo] = useState(false);
  const [estudianteFijo, setEstudianteFijo] = useState(false);
  const [asignaturaFijo, setAsignaturaFijo] = useState(false);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    asignatura_id: '',
    parcial: '1',
    tipo_evaluacion: 'tarea',
    nota: '',
    porcentaje: '20',
    fecha_evaluacion: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  // Confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [evaluacionDelete, setEvaluacionDelete] = useState(null);

  // Vista de estudiante
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  
  // Modal de detalle de evaluaciones
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [evaluacionesDetalle, setEvaluacionesDetalle] = useState([]);
  const [detalleInfo, setDetalleInfo] = useState(null);
  // Asignaturas disponibles por estudiante
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      try {
        const [evals, ests, asigs] = await Promise.all([
          obtenerEvaluaciones(),
          obtenerEstudiantes(),
          obtenerAsignaturas()
        ]);
        setEvaluaciones(Array.isArray(evals) ? evals : []);
        // Marcar si el estudiante tiene matrícula activa y adjuntar matrículas
        const estsArray = Array.isArray(ests) ? ests : [];
        const matriculasPromises = estsArray.map(async (est) => {
          try {
            const mats = await obtenerMatriculasPorEstudiante(est.id);
            // Como ya no existe 'estado' en la matrícula, consideramos que
            // si hay matrículas devueltas, el estudiante está matriculado
            const tieneActiva = Array.isArray(mats) && mats.length > 0;
            return { ...est, matricula_activa: !!tieneActiva, matriculas: Array.isArray(mats) ? mats : [] };
          } catch (err) {
            return { ...est, matricula_activa: false, matriculas: [] };
          }
        });
        const estudiantesConMat = await Promise.all(matriculasPromises);
        setEstudiantes(estudiantesConMat);
        setAsignaturas(Array.isArray(asigs) ? asigs : []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarAlert('danger', 'Error al cargar datos iniciales');
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const response = await obtenerEvaluaciones();
      setEvaluaciones(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error al cargar evaluaciones:', error);
      mostrarAlert('danger', 'Error al cargar evaluaciones');
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = async () => {
    try {
      const res = await obtenerEvaluaciones(filtros);
      setEvaluaciones(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Error al filtrar:', error);
      mostrarAlert('danger', 'Error al filtrar evaluaciones');
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      estudiante_id: '',
      docente_id: '',
      asignatura_id: '',
      parcial: ''
    });
    cargarDatos();
  };

  const handleNuevo = (parcialArg) => {
    setEvaluacionEdit(null);
    setFormData({
      estudiante_id: '',
      asignatura_id: '',
      parcial: parcialArg ? parcialArg.toString() : '1',
      tipo_evaluacion: 'tarea',
      nota: '',
      porcentaje: '20',
      fecha_evaluacion: new Date().toISOString().split('T')[0],
      observaciones: ''
    });
    setParcialFijo(!!parcialArg);
    setEstudianteFijo(false);
    setAsignaturaFijo(false);
    setShowModal(true);
  };

  const handleEditar = (evaluacion) => {
    setEvaluacionEdit(evaluacion);
    
    // Obtener IDs de estudiante y asignatura de manera segura
    const estudianteId = evaluacion.estudiante?.id || evaluacion.estudiante_id;
    const asignaturaId = evaluacion.asignatura?.id || evaluacion.asignatura_id;
    
    setFormData({
      estudiante_id: estudianteId,
      asignatura_id: asignaturaId,
      parcial: evaluacion.parcial.toString(),
      tipo_evaluacion: evaluacion.tipo_evaluacion,
      nota: evaluacion.nota,
      porcentaje: evaluacion.porcentaje,
      fecha_evaluacion: evaluacion.fecha_evaluacion,
      observaciones: evaluacion.observaciones || ''
    });
    
    // Cargar asignaturas disponibles si hay estudiante
    if (estudianteId) {
      obtenerMatriculasPorEstudiante(estudianteId).then(matriculas => {
        const asignaturasMatriculadas = matriculas
          .filter(m => m.estado === 'activo')
          .map(m => m.asignatura)
          .filter(a => a !== null);
        setAsignaturasDisponibles(asignaturasMatriculadas);
      }).catch(error => {
        console.error('Error al obtener matrículas:', error);
        setAsignaturasDisponibles([]);
      });
    }
    
    setShowModal(true);
    setParcialFijo(false);
    setEstudianteFijo(false);
    setAsignaturaFijo(false);
  };

  const handleAsignaturaChange = (asignaturaId) => {
    setFormData({
      ...formData,
      asignatura_id: asignaturaId
    });
  };

  const handleEstudianteChange = async (estudianteId) => {
    setFormData({
      ...formData,
      estudiante_id: estudianteId,
      asignatura_id: '' // Resetear asignatura cuando cambia el estudiante
    });

    if (estudianteId) {
      try {
        // Obtener matrículas del estudiante
        const matriculas = await obtenerMatriculasPorEstudiante(estudianteId);
        const asignaturasMatriculadas = matriculas
          .filter(m => m.estado === 'activo')
          .map(m => m.asignatura)
          .filter(a => a !== null);
        
        setAsignaturasDisponibles(asignaturasMatriculadas);
      } catch (error) {
        console.error('Error al obtener matrículas:', error);
        setAsignaturasDisponibles([]);
      }
    } else {
      setAsignaturasDisponibles([]);
    }
  };

  const handleTipoChange = (tipo) => {
    const tipoObj = TIPOS_EVALUACION.find(t => t.value === tipo);
    setFormData({
      ...formData,
      tipo_evaluacion: tipo,
      porcentaje: tipoObj ? tipoObj.porcentaje : 20
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar nota
    const nota = parseFloat(formData.nota);
    if (nota < 0 || nota > 20) {
      mostrarAlert('warning', 'La nota debe estar entre 0 y 20');
      return;
    }

    try {
      let response;
      if (evaluacionEdit) {
        response = await actualizarEvaluacion(evaluacionEdit.id, formData);
      } else {
        response = await crearEvaluacion(formData);
      }

      // El backend ahora devuelve directamente el objeto con la evaluación
      mostrarAlert('success', evaluacionEdit ? 'Evaluación actualizada exitosamente' : 'Evaluación creada exitosamente');
      setShowModal(false);
      setParcialFijo(false);
      setEstudianteFijo(false);
      setAsignaturaFijo(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarAlert('danger', error.response?.data?.error || 'Error al guardar evaluación');
    }
  };

  const handleEliminar = (evaluacion) => {
    setEvaluacionDelete(evaluacion);
    setShowConfirm(true);
  };

  const confirmarEliminar = async () => {
    try {
      console.log('ID a eliminar:', evaluacionDelete?.id, evaluacionDelete);
      await eliminarEvaluacion(evaluacionDelete.id);
      mostrarAlert('success', 'Evaluación eliminada exitosamente');
      setShowConfirm(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      mostrarAlert('danger', 'Error al eliminar evaluación');
    }
  };

  

  const mostrarAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const verDetalleEvaluaciones = async (item, parcialNum) => {
    // Filtrar evaluaciones del estudiante, asignatura y parcial específico
    const estId = item.estudiante?.id || item.estudiante_id || item.estudianteId;
    const asigId = item.asignatura?.id || item.asignatura_id || item.asignaturaId;
    
    try {
      // Obtener TODAS las evaluaciones del backend sin filtros para asegurar datos completos
      const todasLasEvaluaciones = await obtenerEvaluaciones();
      const evaluacionesArray = Array.isArray(todasLasEvaluaciones) ? todasLasEvaluaciones : [];
      
      // Filtrar solo para este estudiante, asignatura y parcial
      const evaluacionesFiltradas = evaluacionesArray.filter(ev => {
        const evEstId = ev.estudiante?.id || ev.estudiante_id;
        const evAsigId = ev.asignatura?.id || ev.asignatura_id;
        return evEstId === estId && evAsigId === asigId && (!parcialNum || ev.parcial === parcialNum);
      });
      
      console.log('Evaluaciones encontradas para detalle:', evaluacionesFiltradas);
      
      setEvaluacionesDetalle(evaluacionesFiltradas);
      setDetalleInfo({
        estudiante: item.estudiante,
        asignatura: item.asignatura,
        parcial: parcialNum,
        notaParcial: parcialNum === 1 ? item.p1 : (parcialNum === 2 ? item.p2 : item.p3)
      });
      setShowDetalleModal(true);
    } catch (error) {
      console.error('Error al cargar evaluaciones detalladas:', error);
      mostrarAlert('danger', 'Error al cargar el detalle de evaluaciones');
    }
  };

  const exportEstudianteXLS = async () => {
    const estudiante = detalleInfo?.estudiante || estudianteSeleccionado;
    if (!estudiante) {
      mostrarAlert('warning', 'No hay estudiante seleccionado para exportar');
      return;
    }

    let mats = estudiante.matriculas || [];
    if (!Array.isArray(mats) || mats.length === 0) {
      try {
        mats = await obtenerMatriculasPorEstudiante(estudiante.id);
      } catch (err) {
        console.error('Error al obtener matrículas para exportar:', err);
        mostrarAlert('danger', 'No se pudo obtener las matrículas del estudiante');
        return;
      }
    }

    const rowsHtml = mats.map(m => {
      const asig = m.asignatura || {};
      // Calcular parciales usando evaluaciones globales
      const evals = evaluaciones.filter(ev => {
        const evEstId = ev.estudiante?.id || ev.estudiante_id;
        const evAsigId = ev.asignatura?.id || ev.asignatura_id;
        return evEstId === estudiante.id && evAsigId === asig.id;
      });
      let p1 = 0, p2 = 0, p3 = 0;
      [1,2,3].forEach(par => {
        const epar = evals.filter(ev => ev.parcial === par);
        if (epar.length) {
          const suma = epar.reduce((s, ev) => s + ((parseFloat(ev.nota) * parseFloat(ev.porcentaje)) / 100), 0);
          if (par === 1) p1 = suma;
          if (par === 2) p2 = suma;
          if (par === 3) p3 = suma;
        }
      });
      const promedio = ((p1||0)+(p2||0)+(p3||0))/3;
      let estado = '';
      if (((p1||0) + (p2||0)) < 28) estado = 'Reprobó anticipado';
      else estado = promedio >= 14 ? 'Aprobado' : 'Reprobado';
      return `<tr><td>${asig.nombre||''}</td><td>${p1?parseFloat(p1).toFixed(2):''}</td><td>${p2?parseFloat(p2).toFixed(2):''}</td><td>${p3?parseFloat(p3).toFixed(2):''}</td><td>${promedio?promedio.toFixed(2):''}</td><td>${estado}</td></tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Reporte ${estudiante.nombres} ${estudiante.apellidos}</title></head><body><h2>Reporte de ${estudiante.nombres} ${estudiante.apellidos}</h2><table border="1"><thead><tr><th>Asignatura</th><th>P1</th><th>P2</th><th>P3</th><th>Promedio</th><th>Estado</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = `${(estudiante.nombres||'').split(' ').join('_')}_${(estudiante.apellidos||'').split(' ').join('_')}`;
    a.download = `reporte_${safeName}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportEstudiantePDF = async () => {
    const estudiante = detalleInfo?.estudiante || estudianteSeleccionado;
    if (!estudiante) {
      mostrarAlert('warning', 'No hay estudiante seleccionado para exportar');
      return;
    }

    let mats = estudiante.matriculas || [];
    if (!Array.isArray(mats) || mats.length === 0) {
      try {
        mats = await obtenerMatriculasPorEstudiante(estudiante.id);
      } catch (err) {
        console.error('Error al obtener matrículas para exportar:', err);
        mostrarAlert('danger', 'No se pudo obtener las matrículas del estudiante');
        return;
      }
    }

    const rowsHtml = mats.map(m => {
      const asig = m.asignatura || {};
      const evals = evaluaciones.filter(ev => {
        const evEstId = ev.estudiante?.id || ev.estudiante_id;
        const evAsigId = ev.asignatura?.id || ev.asignatura_id;
        return evEstId === estudiante.id && evAsigId === asig.id;
      });
      let p1 = 0, p2 = 0, p3 = 0;
      [1,2,3].forEach(par => {
        const epar = evals.filter(ev => ev.parcial === par);
        if (epar.length) {
          const suma = epar.reduce((s, ev) => s + ((parseFloat(ev.nota) * parseFloat(ev.porcentaje)) / 100), 0);
          if (par === 1) p1 = suma;
          if (par === 2) p2 = suma;
          if (par === 3) p3 = suma;
        }
      });
      const promedio = ((p1||0)+(p2||0)+(p3||0))/3;
      let estado = '';
      if (((p1||0) + (p2||0)) < 28) estado = 'Reprobó anticipado';
      else estado = promedio >= 14 ? 'Aprobado' : 'Reprobado';
      return `<tr><td>${asig.nombre||''}</td><td>${p1?parseFloat(p1).toFixed(2):''}</td><td>${p2?parseFloat(p2).toFixed(2):''}</td><td>${p3?parseFloat(p3).toFixed(2):''}</td><td>${promedio?promedio.toFixed(2):''}</td><td>${estado}</td></tr>`;
    }).join('');

    const style = `<style>table{width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif}th,td{border:1px solid #ccc;padding:6px;text-align:left}th{background:#f8f9fa}</style>`;
    const html = `<html><head><title>Reporte ${estudiante.nombres} ${estudiante.apellidos}</title>${style}</head><body><h2>Reporte de ${estudiante.nombres} ${estudiante.apellidos}</h2><table><thead><tr><th>Asignatura</th><th>P1</th><th>P2</th><th>P3</th><th>Promedio</th><th>Estado</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    const newWin = window.open('', '_blank');
    if (!newWin) return;
    newWin.document.open();
    newWin.document.write(html);
    newWin.document.close();
    newWin.focus();
    setTimeout(() => { newWin.print(); }, 500);
  };

  const esEstudiante = usuario?.rol === 'estudiante';

  return (
    <div>
      <h2 className="mb-4">
        <i className="bi bi-journal-text me-2"></i>
        {esEstudiante ? 'Mis Notas' : 'Gestión de Notas'}
      </h2>

      {esEstudiante ? (
        // Vista para estudiantes
        <EstudianteNotas usuario={usuario} />
      ) : (
        // Vista para admin y docentes
        <Tabs defaultActiveKey="parcial1" className="mb-3">
          <Tab eventKey="parcial1" title={
            <span>
              <i className="bi bi-1-circle me-2"></i>
              Primer Parcial
            </span>
          }>
            <TablaParcial 
              parcial={1}
              evaluaciones={evaluaciones.filter(ev => ev.parcial === 1)}
              agregados={agregados}
              vistaCompleta={false}
              estudiantes={estudiantes}
              asignaturas={asignaturas}
              filtros={filtros}
              setFiltros={setFiltros}
              aplicarFiltros={aplicarFiltros}
              limpiarFiltros={limpiarFiltros}
              handleNuevo={handleNuevo}
              handleEditar={handleEditar}
              handleEliminar={handleEliminar}
              esEstudiante={esEstudiante}
              verDetalleEvaluaciones={verDetalleEvaluaciones}
            />
          </Tab>
          
          <Tab eventKey="parcial2" title={
            <span>
              <i className="bi bi-2-circle me-2"></i>
              Segundo Parcial
            </span>
          }>
            <TablaParcial 
              parcial={2}
              evaluaciones={evaluaciones.filter(ev => ev.parcial === 2)}
              agregados={agregados}
              vistaCompleta={false}
              estudiantes={estudiantes}
              asignaturas={asignaturas}
              filtros={filtros}
              setFiltros={setFiltros}
              aplicarFiltros={aplicarFiltros}
              limpiarFiltros={limpiarFiltros}
              handleNuevo={handleNuevo}
              handleEditar={handleEditar}
              handleEliminar={handleEliminar}
              esEstudiante={esEstudiante}
              verDetalleEvaluaciones={verDetalleEvaluaciones}
            />
          </Tab>
          
          <Tab eventKey="parcial3" title={
            <span>
              <i className="bi bi-3-circle me-2"></i>
              Tercer Parcial
            </span>
          }>
            <TablaParcial 
              parcial={3}
              evaluaciones={evaluaciones.filter(ev => ev.parcial === 3)}
              agregados={agregados}
              vistaCompleta={false}
              estudiantes={estudiantes}
              asignaturas={asignaturas}
              filtros={filtros}
              setFiltros={setFiltros}
              aplicarFiltros={aplicarFiltros}
              limpiarFiltros={limpiarFiltros}
              handleNuevo={handleNuevo}
              handleEditar={handleEditar}
              handleEliminar={handleEliminar}
              esEstudiante={esEstudiante}
              verDetalleEvaluaciones={verDetalleEvaluaciones}
            />
          </Tab>
          
          <Tab eventKey="promedio" title={
            <span>
              <i className="bi bi-calculator me-2"></i>
              Promedio Semestral
            </span>
          }>
            <TablaParcial 
              parcial={null}
              evaluaciones={evaluaciones}
              agregados={agregados}
              vistaCompleta={true}
              estudiantes={estudiantes}
              asignaturas={asignaturas}
              filtros={filtros}
              setFiltros={setFiltros}
              aplicarFiltros={aplicarFiltros}
              limpiarFiltros={limpiarFiltros}
              handleNuevo={handleNuevo}
              handleEditar={handleEditar}
              handleEliminar={handleEliminar}
              esEstudiante={esEstudiante}
              verDetalleEvaluaciones={verDetalleEvaluaciones}
            />
          </Tab>
        </Tabs>
      )}

      {/* Modal de Detalle de Evaluaciones */}
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg">
        <Modal.Header closeButton className="nota-modal-header">
          <Modal.Title className="nota-modal-title">
            <i className="bi bi-list-check me-2"></i>
            Detalle de Evaluaciones
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="nota-modal-body">
          <AlertMessage 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert({ type: '', message: '' })} 
          />
          {detalleInfo && (
            <>
              <div className="mb-4 nota-detalle-box">
                <Row>
                  <Col md={3}>
                    <div className="nota-detalle-label">
                      <small>
                        Estudiante
                      </small>
                    </div>
                    <div className="nota-detalle-valor">
                      {detalleInfo.estudiante?.nombres} {detalleInfo.estudiante?.apellidos}
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="nota-detalle-label">
                      <small>
                        Asignatura
                      </small>
                    </div>
                    <div className="nota-detalle-valor">
                      {detalleInfo.asignatura?.nombre}
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="nota-detalle-label">
                      <small>
                        Parcial
                      </small>
                    </div>
                    <div className="nota-detalle-parcial">
                      {detalleInfo.parcial ? `Parcial ${detalleInfo.parcial}` : 'Todos'}
                    </div>
                  </Col>
                  <Col md={3}>
                    <div style={{ marginBottom: '8px' }}>
                      <small style={{ color: '#6c757d', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Nota Total
                      </small>
                    </div>
                    <div className={`nota-detalle-total ${detalleInfo.notaParcial >= 14 ? 'nota-detalle-total-aprobado' : 'nota-detalle-total-reprobado'}`}>
                      {detalleInfo.notaParcial != null ? detalleInfo.notaParcial.toFixed(2) : '-'}<span className="nota-fecha"> / 20</span>
                    </div>
                  </Col>
                </Row>
              </div>
              
              <div className="nota-table-box">
                <Table className="mb-0" hover>
                  <thead className="nota-table-head">
                    <tr>
                      <th className="nota-table-th">Tipo</th>
                      <th className="nota-table-th">Nota</th>
                      <th className="nota-table-th">%</th>
                      <th className="nota-table-th">Aporte</th>
                      <th className="nota-table-th">Fecha</th>
                      <th className="nota-table-th">Observaciones</th>
                      <th className="nota-table-th text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluacionesDetalle.length > 0 ? (
                      evaluacionesDetalle.map((ev) => {
                        const aporte = ((parseFloat(ev.nota) * parseFloat(ev.porcentaje)) / 100).toFixed(2);
                        return (
                          <tr key={ev.id} className="nota-table-parcial">
                            <td>
                              <span className="nota-tipo">
                                {TIPOS_EVALUACION.find(t => t.value === ev.tipo_evaluacion)?.label || ev.tipo_evaluacion}
                              </span>
                            </td>
                            <td>
                              <span className={ev.nota >= 14 ? 'nota-valor-aprobado' : 'nota-valor-reprobado'}>
                                {parseFloat(ev.nota).toFixed(2)}
                              </span>
                            </td>
                            <td className="nota-fecha">{ev.porcentaje}%</td>
                            <td>
                              <span className="nota-aporte">
                                {aporte} pts
                              </span>
                            </td>
                            <td className="nota-fecha">
                              {new Date(ev.fecha_evaluacion).toLocaleDateString()}
                            </td>
                            <td className="nota-observaciones">
                              {ev.observaciones || '-'}
                            </td>
                            <td className="text-center">
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setShowDetalleModal(false);
                                  handleEditar(ev);
                                }}
                                className="nota-btn-editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setShowDetalleModal(false);
                                  handleEliminar(ev);
                                }}
                                className="nota-btn-eliminar"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="nota-no-evaluaciones py-5">
                          <i className="bi bi-inbox" style={{ fontSize: '2.5rem', color: '#dee2e6' }}></i>
                          <p className="mt-3 mb-0">No hay evaluaciones registradas</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {evaluacionesDetalle.length > 0 && (
                    <tfoot className="nota-modal-body">
                      <tr>
                        <td colSpan="3" className="text-end" style={{ color: '#495057', fontWeight: '600', padding: '12px' }}>
                          Total Aporte al Parcial:
                        </td>
                        <td colSpan="4" style={{ padding: '12px' }}>
                          <span style={{
                            padding: '6px 14px',
                            backgroundColor: '#2c3e50',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '0.95rem',
                            fontWeight: '600'
                          }}>
                            {evaluacionesDetalle.reduce((sum, ev) => {
                              return sum + ((parseFloat(ev.nota) * parseFloat(ev.porcentaje)) / 100);
                            }, 0).toFixed(2)} / 20 puntos
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </Table>
              </div>
            </>
          )}
        </Modal.Body>
          <Modal.Footer style={{ borderTop: '2px solid #dee2e6', backgroundColor: 'white' }}>
            <Button 
              onClick={() => {
                setShowDetalleModal(false);
                setEvaluacionEdit(null);
                setFormData({
                  estudiante_id: detalleInfo?.estudiante?.id || '',
                  asignatura_id: detalleInfo?.asignatura?.id || '',
                  parcial: detalleInfo?.parcial?.toString() || '1',
                  tipo_evaluacion: 'tarea',
                  nota: '',
                  porcentaje: '20',
                  fecha_evaluacion: new Date().toISOString().split('T')[0],
                  observaciones: ''
                });
                setParcialFijo(!!detalleInfo?.parcial);
                setEstudianteFijo(!!detalleInfo?.estudiante?.id);
                setAsignaturaFijo(!!detalleInfo?.asignatura?.id);
                setShowModal(true);
              }}
              style={{
                backgroundColor: '#2c3e50',
                border: 'none',
                padding: '8px 20px',
                fontWeight: '500',
                marginRight: '8px'
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Nota
            </Button>
            <Button size="sm" variant="outline-primary" onClick={() => exportEstudiantePDF()} style={{ marginRight: '8px' }}>
              <i className="bi bi-file-earmark-pdf me-1"></i> Exportar Estudiante (PDF)
            </Button>
            <Button size="sm" variant="outline-success" onClick={() => exportEstudianteXLS()} style={{ marginRight: '8px' }}>
              <i className="bi bi-file-earmark-spreadsheet me-1"></i> Exportar Estudiante (Excel)
            </Button>
            <Button 
              onClick={() => setShowDetalleModal(false)}
              style={{
                backgroundColor: '#6c757d',
                border: 'none',
                padding: '8px 20px',
                fontWeight: '500'
              }}
            >
              <i className="bi bi-x-circle me-2"></i>
              Cerrar
            </Button>
          </Modal.Footer>
      </Modal>

      {/* Modal de Formulario */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setParcialFijo(false); setEstudianteFijo(false); setAsignaturaFijo(false); setEvaluacionEdit(null); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {evaluacionEdit ? 'Editar Evaluación' : 'Nueva Evaluación'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <AlertMessage 
              type={alert.type} 
              message={alert.message} 
              onClose={() => setAlert({ type: '', message: '' })} 
            />
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estudiante *</Form.Label>
                  <Form.Select
                      value={formData.estudiante_id}
                      onChange={(e) => handleEstudianteChange(e.target.value)}
                      required
                      disabled={!!evaluacionEdit || estudianteFijo}
                    >
                    <option value="">Seleccionar...</option>
                    {estudiantes.filter(est => est.matricula_activa).map(est => (
                      <option key={est.id} value={est.id}>
                        {est.nombres} {est.apellidos} - {est.cedula}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Asignatura *</Form.Label>
                  <Form.Select
                    value={formData.asignatura_id}
                    onChange={(e) => handleAsignaturaChange(e.target.value)}
                    required
                    disabled={!!evaluacionEdit || asignaturaFijo || (formData.estudiante_id && asignaturasDisponibles.length === 0)}
                  >
                    <option value="">Seleccionar...</option>
                    {asignaturasDisponibles.length ? (
                      asignaturasDisponibles.map(asig => (
                        <option key={asig.id} value={asig.id}>
                          {asig.nombre}
                          {asig.docente && ` - ${asig.docente.nombres} ${asig.docente.apellidos}`}
                        </option>
                      ))
                    ) : formData.estudiante_id ? (
                      // Si no hay asignaturas disponibles para el estudiante pero la asignatura viene fijada,
                      // mostrarlas como opción para que el select muestre el valor aunque esté deshabilitado.
                      asignaturaFijo && formData.asignatura_id ? (
                        <>
                          <option value={formData.asignatura_id}>
                            {asignaturas.find(a => a.id === parseInt(formData.asignatura_id))?.nombre || 'Asignatura seleccionada'}
                          </option>
                          <option value="" disabled>Matricúlate antes en una materia</option>
                        </>
                      ) : (
                        <option value="" disabled>Matricúlate antes en una materia</option>
                      )
                    ) : (
                      asignaturas.map(asig => (
                        <option key={asig.id} value={asig.id}>
                          {asig.nombre}
                        </option>
                      ))
                    )}
                  </Form.Select>
                  {formData.asignatura_id && (
                    <Form.Text className="text-muted">
                      <i className="bi bi-person me-1"></i>
                      Docente: {(asignaturasDisponibles.length ? asignaturasDisponibles : asignaturas).find(a => a.id === parseInt(formData.asignatura_id))?.docente?.nombres} {(asignaturasDisponibles.length ? asignaturasDisponibles : asignaturas).find(a => a.id === parseInt(formData.asignatura_id))?.docente?.apellidos || 'Sin asignar'}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Parcial *</Form.Label>
                  <Form.Select
                      value={formData.parcial}
                      onChange={(e) => setFormData({...formData, parcial: e.target.value})}
                      required
                      disabled={!!evaluacionEdit || parcialFijo}
                    >
                    <option value="1">Parcial 1</option>
                    <option value="2">Parcial 2</option>
                    <option value="3">Parcial 3</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Evaluación *</Form.Label>
                  <Form.Select
                    value={formData.tipo_evaluacion}
                    onChange={(e) => handleTipoChange(e.target.value)}
                    required
                    disabled={!!evaluacionEdit}
                  >
                    {TIPOS_EVALUACION.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label} ({tipo.porcentaje}%)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nota (0-20) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    value={formData.nota}
                    onChange={(e) => setFormData({...formData, nota: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fecha_evaluacion}
                    onChange={(e) => setFormData({...formData, fecha_evaluacion: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  />
                </Form.Group>
              </Col>
              {formData.nota && (
                <Col md={12}>
                  <div className="alert alert-info">
                    <strong>Aporte al parcial:</strong> {((parseFloat(formData.nota) * parseFloat(formData.porcentaje)) / 100).toFixed(2)} puntos
                  </div>
                </Col>
              )}
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

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmarEliminar}
        title="Eliminar Evaluación"
        message="¿Está seguro que desea eliminar esta evaluación? Esta acción recalculará las notas del parcial."
      />
    </div>
  );
}

// Componente para mostrar tabla de evaluaciones por parcial
function TablaParcial({ 
  parcial, 
  evaluaciones, 
  agregados = [],
  vistaCompleta = false,
  estudiantes, 
  asignaturas,
  filtros,
  setFiltros,
  aplicarFiltros,
  limpiarFiltros,
  handleNuevo,
  handleEditar,
  handleEliminar,
  esEstudiante,
  verDetalleEvaluaciones 
}) {
  const titulo = vistaCompleta ? 'Promedio Semestral' : `Evaluaciones del Parcial ${parcial}`;
  
  // (evaluaciones filtradas no se usan aquí)

  // Filtrar agregados localmente
  const agregadosFiltrados = agregados.filter(item => {
    const estId = item.estudiante?.id || item.estudiante_id || item.estudianteId;
    const asigId = item.asignatura?.id || item.asignatura_id || item.asignaturaId;
    
    if (filtros.estudiante_id && estId !== parseInt(filtros.estudiante_id)) return false;
    if (filtros.asignatura_id && asigId !== parseInt(filtros.asignatura_id)) return false;
    return true;
  });

  const exportToCSV = () => {
    // Generar archivo .xls (HTML) para abrir en Excel sin dependencia externa
    const rowsHtml = agregadosFiltrados.map(it => `
      <tr>
        <td>${(it.estudiante?.nombres||'')+' '+(it.estudiante?.apellidos||'')}</td>
        <td>${it.asignatura?.nombre||''}</td>
        <td>${it.p1!=null?it.p1.toFixed(2):''}</td>
        <td>${it.p2!=null?it.p2.toFixed(2):''}</td>
        <td>${it.p3!=null?it.p3.toFixed(2):''}</td>
        <td>${it.promedio!=null?it.promedio.toFixed(2):''}</td>
        <td>${it.estadoSem||''}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Promedio Semestral</title></head><body><table border="1"><thead><tr><th>Estudiante</th><th>Asignatura</th><th>P1</th><th>P2</th><th>P3</th><th>Promedio</th><th>Estado</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });// crea contenido html descargable
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'promedio_semestral.xls';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const style = `<style>table{width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif}th,td{border:1px solid #ccc;padding:6px;text-align:left}th{background:#f8f9fa}</style>`;
    const rowsHtml = agregadosFiltrados.map(it => `<tr><td>${(it.estudiante?.nombres||'')+' '+(it.estudiante?.apellidos||'')}</td><td>${it.asignatura?.nombre||''}</td><td>${it.p1!=null?it.p1.toFixed(2):''}</td><td>${it.p2!=null?it.p2.toFixed(2):''}</td><td>${it.p3!=null?it.p3.toFixed(2):''}</td><td>${it.promedio!=null?it.promedio.toFixed(2):''}</td><td>${it.estadoSem||''}</td></tr>`).join('');
    const html = `<html><head><title>Promedio Semestral</title>${style}</head><body><h2>Promedio Semestral</h2><table><thead><tr><th>Estudiante</th><th>Asignatura</th><th>P1</th><th>P2</th><th>P3</th><th>Promedio</th><th>Estado</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    const newWin = window.open('', '_blank');
    if (!newWin) return;
    newWin.document.open();
    newWin.document.write(html);
    newWin.document.close();
    newWin.focus();
    setTimeout(() => { newWin.print(); }, 500);
  };

  return (
    <>
      <Card className="mb-4" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Select
                value={filtros.estudiante_id}
                onChange={(e) => setFiltros({...filtros, estudiante_id: e.target.value, parcial: vistaCompleta ? '' : parcial.toString()})}
                style={{ borderColor: '#dee2e6' }}
              >
                <option value="">Todos los estudiantes</option>
                {estudiantes.filter(est => est.matricula_activa).map(est => (
                  <option key={est.id} value={est.id}>
                    {est.nombres} {est.apellidos}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select
                value={filtros.asignatura_id}
                onChange={(e) => setFiltros({...filtros, asignatura_id: e.target.value, parcial: vistaCompleta ? '' : parcial.toString()})}
                style={{ borderColor: '#dee2e6' }}
              >
                <option value="">Todas las asignaturas</option>
                {asignaturas.map(asig => (
                  <option key={asig.id} value={asig.id}>
                    {asig.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="secondary" 
                onClick={limpiarFiltros}
                style={{
                  backgroundColor: '#6c757d',
                  border: 'none',
                  padding: '6px 16px'
                }}
              >
                <i className="bi bi-x-circle me-1"></i> Limpiar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '2px solid #dee2e6',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5 className="mb-0" style={{ color: '#2c3e50', fontWeight: '600', margin: 0 }}>
              <i className="bi bi-journal-check me-2"></i>
              {titulo} <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>({agregadosFiltrados.length})</span>
            </h5>
            {vistaCompleta && (
              <div>
                <Button size="sm" variant="secondary" onClick={() => exportToPDF()} style={{ marginRight: '8px' }}>Exportar PDF</Button>
                <Button size="sm" variant="success" onClick={() => exportToCSV()}>Exportar Excel</Button>
              </div>
            )}
          </div>
        </div>
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <tr>
                <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px' }}>Estudiante</th>
                <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px' }}>Asignatura</th>
                {vistaCompleta ? (
                  <>
                    <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px', textAlign: 'center' }}>P1</th>
                    <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px', textAlign: 'center' }}>P2</th>
                    <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px', textAlign: 'center' }}>P3</th>
                    <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px', textAlign: 'center' }}>Estado Semestre</th>
                  </>
                ) : (
                  <>
                    <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px', textAlign: 'center' }}>Nota Parcial</th>
                    <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px', textAlign: 'center' }}>Estado</th>
                  </>
                )}
                {!esEstudiante && <th style={{ color: '#495057', fontWeight: '600', fontSize: '0.85rem', padding: '12px 16px', textAlign: 'center' }}>Ver Detalle</th>}
              </tr>
            </thead>
            <tbody>
              {agregadosFiltrados.length > 0 ? (
                agregadosFiltrados.map((item, idx) => {
                  // Calcular la nota parcial real sumando las evaluaciones
                  const notaParcialReal = parcial === 1 ? item.p1 : (parcial === 2 ? item.p2 : item.p3);
                  
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f3f5' }}>
                      <td style={{ padding: '12px 16px', color: '#2c3e50' }}>{item.estudiante?.nombres} {item.estudiante?.apellidos}</td>
                      <td style={{ padding: '12px 16px', color: '#495057' }}>{item.asignatura?.nombre}</td>
                      {vistaCompleta ? (
                        <>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{ 
                              color: item.p1 >= 14 ? '#28a745' : '#dc3545',
                              fontWeight: '600',
                              fontSize: '0.95rem'
                            }}>
                              {item.p1 != null ? item.p1.toFixed(2) : '-'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{ 
                              color: item.p2 >= 14 ? '#28a745' : '#dc3545',
                              fontWeight: '600',
                              fontSize: '0.95rem'
                            }}>
                              {item.p2 != null ? item.p2.toFixed(2) : '-'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{ 
                              color: item.p3 >= 14 ? '#28a745' : '#dc3545',
                              fontWeight: '600',
                              fontSize: '0.95rem'
                            }}>
                              {item.p3 != null ? item.p3.toFixed(2) : '-'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{ 
                              color: item.promedio >= 14 ? '#28a745' : '#dc3545',
                              fontWeight: '700',
                              fontSize: '1.05rem'
                            }}>
                              {item.promedio != null ? item.promedio.toFixed(2) : '-'}
                            </span>
                            <span style={{ color: '#6c757d', fontSize: '0.85rem' }}> / 20</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 10px',
                              backgroundColor: item.estadoSem && item.estadoSem.includes('Aprobado') ? '#d4edda' : '#f8d7da',
                              color: item.estadoSem && item.estadoSem.includes('Aprobado') ? '#155724' : '#721c24',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '500'
                            }}>
                              {item.estadoSem}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{ 
                              color: notaParcialReal >= 14 ? '#28a745' : '#dc3545',
                              fontWeight: '700',
                              fontSize: '1.05rem'
                            }}>
                              {notaParcialReal != null ? notaParcialReal.toFixed(2) : '-'}
                            </span>
                            <span style={{ color: '#6c757d', fontSize: '0.85rem' }}> / 20</span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 10px',
                              backgroundColor: (parcial === 1 && item.estadoP1 === 'Aprobado parcial') ||
                                (parcial === 2 && item.estadoP2 === 'Aprobado parcial') ||
                                (parcial === 3 && item.estadoP3 === 'Aprobado parcial') ? '#d4edda' : '#f8d7da',
                              color: (parcial === 1 && item.estadoP1 === 'Aprobado parcial') ||
                                (parcial === 2 && item.estadoP2 === 'Aprobado parcial') ||
                                (parcial === 3 && item.estadoP3 === 'Aprobado parcial') ? '#155724' : '#721c24',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '500'
                            }}>
                              {parcial === 1 ? item.estadoP1 : (parcial === 2 ? item.estadoP2 : item.estadoP3)}
                            </span>
                          </td>
                        </>
                      )}
                      {!esEstudiante && (
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <Button 
                            size="sm"
                            onClick={() => verDetalleEvaluaciones(item, parcial)}
                            title="Ver detalles de evaluaciones"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #dee2e6',
                              color: '#495057',
                              padding: '6px 12px'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={vistaCompleta ? (esEstudiante ? "7" : "8") : (esEstudiante ? "3" : "4")} className="text-center py-5">
                    <i className="bi bi-inbox" style={{ fontSize: '2.5rem', color: '#dee2e6' }}></i>
                    <p className="mt-3 mb-0" style={{ color: '#6c757d' }}>No hay datos para mostrar</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        {agregadosFiltrados.length > 0 && (
          <div style={{ 
            padding: '16px 20px', 
            borderTop: '2px solid #dee2e6',
            backgroundColor: '#f8f9fa'
          }}>
            <Row>
              <Col md={12}>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ color: '#495057' }}>
                    <strong>Total registros:</strong> {agregadosFiltrados.length}
                  </span>
                  {vistaCompleta && (
                    <span style={{ color: '#495057' }}>
                      <strong>Promedio general:</strong> {' '}
                      <span style={{
                        padding: '6px 14px',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>
                        {(agregadosFiltrados.reduce((sum, it) => sum + (it.promedio || 0), 0) / agregadosFiltrados.length).toFixed(2)} / 20
                      </span>
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </>
  );
}

// Componente para mostrar resumen de notas
function ResumenNotas({ notas }) {
  // Agrupar por asignatura
  const agruparPorAsignatura = () => {
    const agrupadas = {};
    notas.forEach(nota => {
      if (!agrupadas[nota.asignatura_nombre]) {
        agrupadas[nota.asignatura_nombre] = {
          parciales: {},
          estado: nota.estado_semestral,
          total: nota.total_puntos,
          promedio: nota.promedio_semestral,
          observaciones: nota.observaciones
        };
      }
      agrupadas[nota.asignatura_nombre].parciales[nota.parcial] = nota.nota_final;
    });
    return agrupadas;
  };

  const notasAgrupadas = agruparPorAsignatura();

  return (
    <div>
      {Object.entries(notasAgrupadas).map(([asignatura, data]) => (
        <Card key={asignatura} className="mb-3">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">{asignatura}</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {[1, 2, 3].map(parcial => (
                <Col md={4} key={parcial}>
                  <div className="text-center p-3 border rounded">
                    <h6>Parcial {parcial}</h6>
                    <h3 className={data.parciales[parcial] >= 14 ? 'text-success' : 'text-danger'}>
                      {data.parciales[parcial] ? data.parciales[parcial].toFixed(2) : '-'} / 20
                    </h3>
                    <Badge bg={data.parciales[parcial] >= 14 ? 'success' : 'danger'}>
                      {data.parciales[parcial] >= 14 ? 'Aprobado' : 'Reprobado'}
                    </Badge>
                  </div>
                </Col>
              ))}
            </Row>
            <hr />
            <Row className="mt-3">
              <Col md={6}>
                <strong>Total Puntos:</strong> {data.total || 0} / 60
              </Col>
              <Col md={6}>
                <strong>Promedio:</strong> {data.promedio ? data.promedio.toFixed(2) : 0} / 20
              </Col>
              <Col md={12} className="mt-2">
                <Badge bg={
                  data.estado === 'aprobado' ? 'success' : 
                  data.estado === 'reprobado_anticipado' ? 'warning' : 'danger'
                } className="me-2">
                  {data.estado?.toUpperCase().replace('_', ' ')}
                </Badge>
                {data.observaciones && (
                  <small className="text-muted">{data.observaciones}</small>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

// Vista para estudiantes
function EstudianteNotas({ usuario }) {
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!usuario?.perfil?.id) return;
      setCargando(true);
      try {
        const resp = await obtenerResumenEstudiante(usuario.perfil.id);
        if (!mounted) return;
        setNotas(Array.isArray(resp) ? resp : []);
      } catch (error) {
        console.error('Error al cargar notas:', error);
      } finally {
        if (mounted) setCargando(false);
      }
    })();
    return () => { mounted = false; };
  }, [usuario]);

  if (cargando) return <LoadingSpinner />;

  return (
    <div>
      {notas.length > 0 ? (
        <ResumenNotas notas={notas} />
      ) : (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="bi bi-journal-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <p className="mt-3 text-muted">No tienes notas registradas aún</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Notas;
