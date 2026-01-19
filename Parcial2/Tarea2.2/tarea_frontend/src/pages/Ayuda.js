import React from 'react';
import { Card, Row, Col, Accordion, Badge } from 'react-bootstrap';

function Ayuda() {
  return (
    <div>
      <h2 className="mb-4">
        <i className="bi bi-question-circle me-2"></i>
        Ayuda y Documentación
      </h2>

      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body>
              <h4>Sistema de Gestión Escolar</h4>
              <p className="text-muted">
                Este sistema permite gestionar estudiantes, docentes y notas de manera eficiente. 
                A continuación encontrarás información sobre cómo utilizar cada módulo.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Roles y Permisos</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="p-3 border rounded">
                    <h6 className="text-primary">
                      <i className="bi bi-shield-check me-2"></i>
                      Administrador
                    </h6>
                    <ul className="small">
                      <li>Acceso total al sistema</li>
                      <li>Gestión de estudiantes</li>
                      <li>Gestión de docentes</li>
                      <li>Gestión de notas</li>
                      <li>Reportes completos</li>
                    </ul>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 border rounded">
                    <h6 className="text-success">
                      <i className="bi bi-person-badge me-2"></i>
                      Docente
                    </h6>
                    <ul className="small">
                      <li>Ver estudiantes</li>
                      <li>Registrar notas</li>
                      <li>Editar notas</li>
                      <li>Ver reportes de sus materias</li>
                    </ul>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 border rounded">
                    <h6 className="text-info">
                      <i className="bi bi-person me-2"></i>
                      Estudiante
                    </h6>
                    <ul className="small">
                      <li>Ver sus notas</li>
                      <li>Ver su perfil</li>
                      <li>Consultar estado académico</li>
                      <li>Ver calendario</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Sistema de Calificación</h5>
            </Card.Header>
            <Card.Body>
              <h6>Estructura del Semestre:</h6>
              <ul>
                <li><strong>3 Parciales</strong> en el semestre</li>
                <li>Cada parcial vale <strong>20 puntos</strong></li>
                <li>Total del semestre: <strong>60 puntos</strong></li>
                <li>Promedio mínimo para aprobar semestre: <strong>42.10 puntos</strong></li>
              </ul>

              <h6 className="mt-4">Componentes de cada Parcial:</h6>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Evaluación</th>
                      <th>Porcentaje</th>
                      <th>Sobre</th>
                      <th>Puntos Máximos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tarea</td>
                      <td>20%</td>
                      <td>20 puntos</td>
                      <td>4 puntos</td>
                    </tr>
                    <tr>
                      <td>Informe</td>
                      <td>20%</td>
                      <td>20 puntos</td>
                      <td>4 puntos</td>
                    </tr>
                    <tr>
                      <td>Lección</td>
                      <td>20%</td>
                      <td>20 puntos</td>
                      <td>4 puntos</td>
                    </tr>
                    <tr>
                      <td>Examen</td>
                      <td>40%</td>
                      <td>20 puntos</td>
                      <td>8 puntos</td>
                    </tr>
                    <tr className="table-info">
                      <td><strong>Total</strong></td>
                      <td><strong>100%</strong></td>
                      <td></td>
                      <td><strong>20 puntos</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="alert alert-warning">
                <h6>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Regla de Reprobación Anticipada
                </h6>
                <p className="mb-0">
                  Si la suma del <strong>Parcial 1 + Parcial 2 es menor a 28 puntos</strong>, 
                  el estudiante <strong>reprueba automáticamente</strong> la asignatura en el segundo parcial.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Preguntas Frecuentes</h5>
            </Card.Header>
            <Card.Body>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    ¿Cómo registro un nuevo estudiante?
                  </Accordion.Header>
                  <Accordion.Body>
                    <ol>
                      <li>Ve al módulo de <strong>Estudiantes</strong></li>
                      <li>Haz clic en el botón <strong>"Nuevo Estudiante"</strong></li>
                      <li>Completa todos los campos requeridos (marcados con *)</li>
                      <li>Opcionalmente, sube una foto del estudiante</li>
                      <li>Selecciona el curso al que pertenece</li>
                      <li>Haz clic en <strong>"Guardar"</strong></li>
                    </ol>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    ¿Cómo ingreso las notas de una evaluación?
                  </Accordion.Header>
                  <Accordion.Body>
                    <ol>
                      <li>Ve al módulo de <strong>Notas</strong></li>
                      <li>Haz clic en <strong>"Nueva Nota"</strong></li>
                      <li>Selecciona el estudiante, asignatura y parcial</li>
                      <li>Elige el tipo de evaluación (Tarea, Informe, Lección, Examen)</li>
                      <li>Ingresa la nota sobre 20 puntos</li>
                      <li>El sistema calculará automáticamente el aporte al parcial</li>
                      <li>Guarda la evaluación</li>
                    </ol>
                    <div className="alert alert-info mt-2">
                      <small>
                        <strong>Nota:</strong> El sistema calcula automáticamente la nota final del parcial 
                        y verifica si el estudiante aprueba o reprueba.
                      </small>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    ¿Cómo se calcula la nota final del semestre?
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>La nota final se calcula sumando los tres parciales:</p>
                    <ul>
                      <li><strong>Parcial 1:</strong> Máximo 20 puntos</li>
                      <li><strong>Parcial 2:</strong> Máximo 20 puntos</li>
                      <li><strong>Parcial 3:</strong> Máximo 20 puntos</li>
                      <li><strong>Total:</strong> 60 puntos máximo</li>
                    </ul>
                    <p className="mb-0">
                      El estudiante aprueba si obtiene <strong>42.10 puntos o más</strong> (equivalente a 70% del total).
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    ¿Puedo editar una nota ya ingresada?
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      Sí, puedes editar las notas desde la lista de evaluaciones. 
                      Al hacerlo, el sistema recalculará automáticamente:
                    </p>
                    <ul>
                      <li>La nota final del parcial</li>
                      <li>El estado del parcial (aprobado/reprobado)</li>
                      <li>El total de puntos del semestre</li>
                      <li>El estado general de la asignatura</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    ¿Cómo busco un estudiante específico?
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>Puedes buscar estudiantes por:</p>
                    <ul>
                      <li>Número de cédula</li>
                      <li>Nombres</li>
                      <li>Apellidos</li>
                      <li>ID del estudiante</li>
                    </ul>
                    <p className="mb-0">
                      Usa la barra de búsqueda en el módulo de estudiantes y escribe el término que deseas buscar.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Estados Académicos
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Estados por Parcial:</h6>
                  <ul>
                    <li>
                      <Badge bg="success" className="me-2">Aprobado</Badge>
                      Nota ≥ 14 puntos
                    </li>
                    <li>
                      <Badge bg="danger" className="me-2">Reprobado</Badge>
                      Nota {'<'} 14 puntos
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Estados Semestrales:</h6>
                  <ul>
                    <li>
                      <Badge bg="success" className="me-2">Aprobado</Badge>
                      Total ≥ 42.10 puntos
                    </li>
                    <li>
                      <Badge bg="danger" className="me-2">Reprobado</Badge>
                      Total {'<'} 42.10 puntos
                    </li>
                    <li>
                      <Badge bg="warning" className="me-2">Reprobado Anticipado</Badge>
                      P1 + P2 {'<'} 28 puntos
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Ayuda;
