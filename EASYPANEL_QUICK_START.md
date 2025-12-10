# ⚡ Quick Start - Easypanel Dos Servicios

## 🎯 Resumen Rápido

Configuración mínima para tener frontend y backend funcionando en Easypanel como dos servicios separados.

## 📦 Servicio 1: Frontend

```
Nombre: frontend-camara-vlc
Tipo: App → Docker
Repositorio: [tu-repo-frontend]
Rama: main
Dockerfile: Dockerfile
Puerto: 4173
```

### Variables de Entorno:
```bash
NODE_ENV=production
PORT=4173
VITE_SUPABASE_URL=[tu-url]
VITE_SUPABASE_ANON_KEY=[tu-key]
VITE_API_BASE_URL=http://backend-camara-vlc:8000
```

## 📦 Servicio 2: Backend

```
Nombre: backend-camara-vlc
Tipo: App → Docker
Repositorio: [tu-repo-backend]
Rama: main
Dockerfile: Dockerfile.backend (o Dockerfile)
Puerto: 8000
```

### Variables de Entorno:
```bash
PYTHONUNBUFFERED=1
PORT=8000
DB_HOST=[tu-db-host]
DB_PORT=5432
DB_USER=[tu-usuario]
DB_PASSWORD=[tu-password]
DB_NAME=indicadores
```

## 🔗 Conexión

- Frontend se conecta a Backend usando: `http://backend-camara-vlc:8000`
- El nombre `backend-camara-vlc` debe coincidir exactamente con el nombre del servicio en Easypanel

## ✅ Checklist

- [ ] Servicio frontend creado y desplegado
- [ ] Servicio backend creado y desplegado
- [ ] Variables de entorno configuradas en ambos servicios
- [ ] `VITE_API_BASE_URL` apunta al nombre correcto del backend
- [ ] CORS configurado en el backend para permitir el dominio del frontend
- [ ] Ambos servicios muestran estado "Running" en Easypanel

## 📖 Documentación Completa

Ver `EASYPANEL_DOS_SERVICIOS.md` para instrucciones detalladas.



