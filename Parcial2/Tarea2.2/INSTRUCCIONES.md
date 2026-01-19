# INSTRUCCIONES DE INSTALACIÓN Y EJECUCIÓN

## Paso 1: Instalar Dependencias del Backend

```powershell
cd C:\Users\DELL\Documents\Espe_GIT\Web_Avanzada\Parcial2\Tarea2.2\tarea_backend
npm install
```

## Paso 2: Configurar Base de Datos MySQL

1. Abre MySQL Workbench o línea de comandos de MySQL
2. Ejecuta el archivo schema.sql:

```sql
-- Opción 1: Desde MySQL Workbench
-- File -> Open SQL Script -> Seleccionar tarea_backend/database/schema.sql -> Ejecutar

-- Opción 2: Desde línea de comandos
mysql -u root -p < database/schema.sql
```

3. Verifica que la base de datos se creó correctamente:

```sql
USE sistema_escolar;
SHOW TABLES;
```

Deberías ver las siguientes tablas:
- usuarios
- estudiantes
- docentes
- cursos
- asignaturas
- evaluaciones
- notas_parciales
- estado_semestral
- actividades
- notificaciones
- eventos
- asignaciones

## Paso 3: Configurar Variables de Entorno

Edita el archivo `.env` en `tarea_backend` con tus credenciales de MySQL:

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_PASSWORD_AQUI
DB_NAME=sistema_escolar
DB_PORT=3306
JWT_SECRET=mi_secreto_super_seguro_2024
```

## Paso 4: Instalar Dependencias del Frontend

```powershell
cd C:\Users\DELL\Documents\Espe_GIT\Web_Avanzada\Parcial2\Tarea2.2\tarea_frontend
npm install
```

## Paso 5: Ejecutar el Backend

Abre una terminal PowerShell y ejecuta:

```powershell
cd C:\Users\DELL\Documents\Espe_GIT\Web_Avanzada\Parcial2\Tarea2.2\tarea_backend
npm run dev
```

Deberías ver:
```
Servidor corriendo en puerto 3001
http://localhost:3001
✓ Conexión a MySQL exitosa
```

## Paso 6: Ejecutar el Frontend

Abre OTRA terminal PowerShell y ejecuta:

```powershell
cd C:\Users\DELL\Documents\Espe_GIT\Web_Avanzada\Parcial2\Tarea2.2\tarea_frontend
npm start
```

El navegador debería abrirse automáticamente en `http://localhost:3000`

## Paso 7: Iniciar Sesión

Usa las credenciales por defecto:
- **Usuario:** admin
- **Contraseña:** admin123

## Verificación de Funcionamiento

### Backend
Prueba que el backend funciona visitando: `http://localhost:3001`

Deberías ver:
```json
{
  "message": "API Sistema Escolar funcionando correctamente"
}
```

### Frontend
El frontend debería mostrar la página de login en `http://localhost:3000/login`

## Solución de Problemas Comunes

### Error de conexión a MySQL
- Verifica que MySQL esté corriendo
- Verifica el usuario y contraseña en el archivo `.env`
- Verifica que el puerto sea el correcto (3306 por defecto)

### Error "Module not found"
```powershell
# En la carpeta correspondiente:
npm install
```

### Puerto 3000 o 3001 ya en uso
```powershell
# Cambiar puerto del frontend en package.json
# O matar el proceso:
Get-Process -Name node | Stop-Process -Force
```

### Error "CORS"
- Verifica que el backend esté corriendo en el puerto 3001
- El backend ya tiene CORS configurado para aceptar peticiones del frontend

## Funcionalidades Implementadas

### ✅ Backend
- [x] Autenticación con JWT
- [x] CRUD de Estudiantes
- [x] CRUD de Docentes
- [x] Sistema de Notas con cálculo automático
- [x] Lógica de parciales y semestre
- [x] Reprobación anticipada (P1+P2 < 28)
- [x] Dashboard con actividades
- [x] Subida de fotos

### ✅ Frontend
- [x] Login con autenticación
- [x] Dashboard informativo
- [x] Gestión de Estudiantes (CRUD completo)
- [x] Gestión de Docentes (CRUD completo)
- [x] Sistema de Notas
  - [x] Registro de evaluaciones
  - [x] Cálculo automático de parciales
  - [x] Vista por estudiante
  - [x] Estados académicos
- [x] Página de Ayuda
- [x] Diseño responsive con Bootstrap
- [x] Modales de confirmación
- [x] Alertas y notificaciones
- [x] Componentes reutilizables

## Estructura del Sistema de Notas

### Cada Parcial (20 puntos):
- Tarea: 20% (4 puntos máx)
- Informe: 20% (4 puntos máx)
- Lección: 20% (4 puntos máx)
- Examen: 40% (8 puntos máx)

### Semestre (60 puntos):
- Parcial 1: 20 puntos
- Parcial 2: 20 puntos
- Parcial 3: 20 puntos
- **Mínimo para aprobar:** 42.10 puntos

### Reglas Especiales:
- Si P1 + P2 < 28 → Reprobación anticipada
- Nota mínima por parcial para aprobar: 14/20

## Próximos Pasos (Opcional)

Para mejorar el sistema, puedes agregar:
- [ ] Reportes en PDF
- [ ] Exportar a Excel
- [ ] Gráficos de rendimiento
- [ ] Sistema de asistencia
- [ ] Mensajería interna
- [ ] Calendario interactivo
- [ ] Recuperación de contraseña
- [ ] Roles más específicos

## Contacto y Soporte

Si tienes problemas, revisa:
1. Los logs del backend en la terminal
2. La consola del navegador (F12)
3. Que MySQL esté corriendo
4. Que ambos servidores estén activos
