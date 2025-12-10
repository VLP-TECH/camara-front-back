# 🚀 Guía de Configuración en Easypanel - Dos Servicios (Frontend y Backend)

Esta guía explica cómo configurar el frontend y el backend como dos servicios separados (dos "boxes") en Easypanel, cada uno ejecutándose en su propio contenedor Docker.

## 📋 Estructura del Proyecto

- **Frontend**: React + Vite (este repositorio)
- **Backend**: FastAPI (repositorio separado: `/Users/chaumesanchez/Downloads/Camara_de_comercio`)

## 🎯 Configuración en Easypanel

Necesitas crear **DOS servicios separados** en Easypanel:

### 1️⃣ Servicio Frontend

#### Configuración Básica

1. **Nombre del Servicio**: `frontend-camara-vlc` (o el que prefieras)
2. **Tipo**: `App` → `Docker`
3. **Repositorio**: URL de tu repositorio del frontend
   ```
   https://github.com/VLP-TECH/ecosistema-valencia-view.git
   ```
4. **Rama**: `main` (o la rama que uses)

#### Configuración del Dockerfile

- **Dockerfile Path**: `Dockerfile` (o dejar vacío)
- **Build Command**: (dejar vacío - el Dockerfile maneja el build)
- **Start Command**: (dejar vacío - el Dockerfile tiene CMD configurado)

#### Variables de Entorno

Configura las siguientes variables de entorno en Easypanel:

```bash
NODE_ENV=production
PORT=4173
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
VITE_API_BASE_URL=http://backend-camara-vlc:8000
```

**⚠️ IMPORTANTE**: 
- `VITE_API_BASE_URL` debe apuntar al nombre del servicio del backend en Easypanel
- Si el backend se llama `backend-camara-vlc`, usa: `http://backend-camara-vlc:8000`
- Easypanel crea una red interna donde los servicios se comunican por nombre

#### Puerto

- **Puerto de la aplicación**: `4173`
- Easypanel expondrá este puerto automáticamente

#### Dominio

Configura el dominio para el frontend (ej: `app.camara-valencia.com`)

---

### 2️⃣ Servicio Backend

#### Configuración Básica

1. **Nombre del Servicio**: `backend-camara-vlc` (o el que prefieras)
2. **Tipo**: `App` → `Docker`
3. **Repositorio**: URL de tu repositorio del backend
   ```
   https://github.com/tu-usuario/camara-backend.git
   ```
   O si está en el mismo repositorio, usa la misma URL pero especifica el contexto
4. **Rama**: `main` (o la rama que uses)

#### Configuración del Dockerfile

- **Dockerfile Path**: `Dockerfile.backend` (o `Dockerfile` si está en la raíz)
- **Build Command**: (dejar vacío)
- **Start Command**: (dejar vacío)

#### Variables de Entorno

Configura las siguientes variables de entorno:

```bash
PYTHONUNBUFFERED=1
PORT=8000
DB_HOST=tu-host-postgresql
DB_PORT=5432
DB_USER=tu-usuario-db
DB_PASSWORD=tu-password-db
DB_NAME=indicadores
```

**Nota**: Si usas una base de datos externa (Supabase, RDS, etc.), configura estas variables. Si quieres incluir PostgreSQL en Easypanel, crea un tercer servicio de base de datos.

#### Puerto

- **Puerto de la aplicación**: `8000`
- Easypanel expondrá este puerto automáticamente

#### Dominio (Opcional)

Si quieres exponer el backend directamente, configura un dominio (ej: `api.camara-valencia.com`). Si solo se comunica con el frontend, no es necesario.

---

## 🔗 Conexión entre Servicios

### Comunicación Interna

En Easypanel, los servicios en la misma red pueden comunicarse usando el **nombre del servicio**:

- Frontend → Backend: `http://backend-camara-vlc:8000`
- Backend → Base de Datos: `http://db-service:5432` (si tienes un servicio de DB)

### Configuración CORS en el Backend

Asegúrate de que el backend permita las peticiones del frontend. En `microservicio_exposicion/main.py`:

```python
# Configuración CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",
    "https://tu-dominio-frontend.com",  # Tu dominio de producción
    "https://*.easypanel.host",  # Dominios de Easypanel
    "*"  # En desarrollo, en producción usa dominios específicos
]
```

---

## 📝 Pasos Detallados en Easypanel

### Crear el Servicio Frontend

1. Ve a tu proyecto en Easypanel
2. Click en **"Add Service"** o **"Nuevo Servicio"**
3. Selecciona **"App"** → **"Docker"**
4. Configura:
   - **Name**: `frontend-camara-vlc`
   - **Repository**: URL del repositorio del frontend
   - **Branch**: `main`
   - **Dockerfile Path**: `Dockerfile`
5. En **Environment Variables**, agrega todas las variables mencionadas arriba
6. En **Port**, configura `4173`
7. Guarda y despliega

### Crear el Servicio Backend

1. Ve a tu proyecto en Easypanel
2. Click en **"Add Service"** o **"Nuevo Servicio"**
3. Selecciona **"App"** → **"Docker"**
4. Configura:
   - **Name**: `backend-camara-vlc`
   - **Repository**: URL del repositorio del backend
   - **Branch**: `main`
   - **Dockerfile Path**: `Dockerfile.backend` (o `Dockerfile`)
5. En **Environment Variables**, agrega todas las variables mencionadas arriba
6. En **Port**, configura `8000`
7. Guarda y despliega

---

## 🔧 Troubleshooting

### El frontend no puede conectarse al backend

1. **Verifica el nombre del servicio**: 
   - El nombre en `VITE_API_BASE_URL` debe coincidir exactamente con el nombre del servicio en Easypanel
   - Ejemplo: Si el servicio se llama `backend-camara-vlc`, usa `http://backend-camara-vlc:8000`

2. **Verifica que ambos servicios estén en el mismo proyecto**:
   - Los servicios deben estar en el mismo proyecto de Easypanel para comunicarse

3. **Verifica los logs**:
   - Revisa los logs del frontend para ver errores de conexión
   - Revisa los logs del backend para ver si recibe las peticiones

### Error de CORS

1. **Actualiza los orígenes permitidos en el backend**:
   - Agrega el dominio del frontend a la lista de `origins` en el backend
   - Agrega `*.easypanel.host` para los dominios temporales de Easypanel

### El backend no puede conectarse a la base de datos

1. **Verifica las variables de entorno**:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   
2. **Si usas un servicio de DB en Easypanel**:
   - Usa el nombre del servicio como `DB_HOST`
   - Ejemplo: Si el servicio de DB se llama `postgres-db`, usa `DB_HOST=postgres-db`

---

## 🗄️ Opción: Base de Datos como Tercer Servicio

Si quieres incluir PostgreSQL en Easypanel:

### 3️⃣ Servicio Base de Datos (Opcional)

1. **Nombre del Servicio**: `postgres-db`
2. **Tipo**: `Database` → `PostgreSQL`
3. **Versión**: `17` (o la que prefieras)
4. **Variables de entorno** (configuradas automáticamente):
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB`

Luego, en el backend, configura:
```bash
DB_HOST=postgres-db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=la-password-configurada
DB_NAME=indicadores
```

---

## ✅ Verificación

Después de configurar ambos servicios:

1. **Verifica que ambos servicios estén corriendo**:
   - En Easypanel, ambos servicios deben mostrar estado "Running"

2. **Prueba el backend directamente**:
   - Visita: `https://tu-dominio-backend.com/api/v1/indicadores-disponibles`
   - O si no tienes dominio: `https://backend-camara-vlc.xxx.easypanel.host/api/v1/indicadores-disponibles`

3. **Prueba el frontend**:
   - Visita: `https://tu-dominio-frontend.com`
   - Verifica que pueda conectarse al backend (revisa la consola del navegador)

4. **Revisa los logs**:
   - Logs del frontend: Debe mostrar que el servidor está corriendo
   - Logs del backend: Debe mostrar que FastAPI está corriendo

---

## 📚 Recursos Adicionales

- [Documentación de Easypanel](https://easypanel.io/docs)
- [Docker Networking](https://docs.docker.com/network/)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)

---

## 🎉 ¡Listo!

Ahora tienes dos servicios Docker separados ejecutándose en Easypanel, conectados entre sí. El frontend puede comunicarse con el backend usando el nombre del servicio como hostname.



