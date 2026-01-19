# Backend - Sistema Escolar

Backend del sistema de gestión escolar desarrollado con Node.js, Express y MySQL.

## Instalación

```bash
npm install
```

## Configuración

1. Crear base de datos MySQL:
```bash
mysql -u root -p < database/schema.sql
```

2. Configurar variables de entorno en `.env`:
```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sistema_escolar
JWT_SECRET=tu_secreto
```

## Ejecutar

Modo desarrollo:
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

## Credenciales por defecto

- Usuario: admin
- Contraseña: admin123

## API Endpoints

### Autenticación
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/verify

### Estudiantes
- GET /api/estudiantes
- GET /api/estudiantes/:id
- GET /api/estudiantes/buscar?termino=
- POST /api/estudiantes
- PUT /api/estudiantes/:id
- DELETE /api/estudiantes/:id

### Docentes
- GET /api/docentes
- GET /api/docentes/:id
- GET /api/docentes/buscar?termino=
- POST /api/docentes
- PUT /api/docentes/:id
- DELETE /api/docentes/:id

### Notas
- GET /api/notas
- POST /api/notas
- PUT /api/notas/:id
- DELETE /api/notas/:id
- GET /api/notas/estudiante/:id

### Actividades
- GET /api/actividades/dashboard
