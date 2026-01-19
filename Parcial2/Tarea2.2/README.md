# Sistema de Gestión Escolar

Sistema completo de gestión escolar desarrollado con React, Bootstrap, Express y MySQL.

## Características

### Frontend
- ✅ React con React Router
- ✅ Bootstrap 5 y React Bootstrap
- ✅ Autenticación con JWT
- ✅ Diseño responsive
- ✅ Componentes reutilizables

### Funcionalidades

#### Módulo de Estudiantes
- Listar todos los estudiantes
- Buscar por cédula, nombre o ID
- Crear/Editar estudiante
- Subir foto de perfil
- Asignar a curso/paralelo
- Cambiar estado (activo/inactivo)
- Eliminación lógica

#### Módulo de Docentes
- Gestión completa de docentes
- Asignar especialidad
- Gestión de carga horaria
- Búsqueda y filtros

#### Módulo de Notas
- Registro de evaluaciones por parcial
- 4 tipos de evaluación:
  - Tarea (20%)
  - Informe (20%)
  - Lección (20%)
  - Examen (40%)
- Cálculo automático de notas
- Vista por estudiante
- Filtros avanzados

#### Sistema de Calificación
- 3 parciales por semestre
- Cada parcial sobre 20 puntos
- Total semestre: 60 puntos
- Promedio mínimo: 42.10 puntos
- Reprobación anticipada: P1+P2 < 28 puntos

## Instalación

### 1. Instalar dependencias

Frontend:
```bash
cd tarea_frontend
npm install
```

Backend:
```bash
cd tarea_backend
npm install
```

### 2. Configurar Base de Datos

Crear la base de datos:
```bash
mysql -u root -p < tarea_backend/database/schema.sql
```

Configurar `.env` en el backend con tus credenciales.

### 3. Ejecutar

Backend:
```bash
cd tarea_backend
npm run dev
```

Frontend:
```bash
cd tarea_frontend
npm start
```

## Credenciales por defecto

- Usuario: `admin`
- Contraseña: `admin123`

## Tecnologías

### Frontend
- React 19
- React Router 6
- Bootstrap 5
- React Bootstrap
- Axios
- Bootstrap Icons

### Backend
- Node.js
- Express
- MySQL2
- JWT
- Bcrypt
- Multer

## Estructura del Proyecto

```
tarea_frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── services/       # Servicios API
│   └── App.js
└── package.json

tarea_backend/
├── controllers/        # Controladores
├── models/            # Modelos de datos
├── routes/            # Rutas API
├── middleware/        # Middlewares
├── config/            # Configuración
├── database/          # SQL Schema
└── app.js
```

## API Endpoints

### Autenticación
- POST `/api/auth/login`
- POST `/api/auth/register`
- GET `/api/auth/verify`

### Estudiantes
- GET `/api/estudiantes`
- GET `/api/estudiantes/:id`
- GET `/api/estudiantes/buscar?termino=`
- POST `/api/estudiantes`
- PUT `/api/estudiantes/:id`
- DELETE `/api/estudiantes/:id`

### Docentes
- GET `/api/docentes`
- GET `/api/docentes/:id`
- POST `/api/docentes`
- PUT `/api/docentes/:id`
- DELETE `/api/docentes/:id`

### Notas
- GET `/api/notas`
- POST `/api/notas`
- PUT `/api/notas/:id`
- DELETE `/api/notas/:id`
- GET `/api/notas/estudiante/:id`

## Autor

Desarrollado para el curso de Desarrollo Web Avanzado
