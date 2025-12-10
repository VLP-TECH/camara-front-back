# 📦 Resumen: Configuración Docker para Easypanel

## ✅ Archivos Creados/Modificados

### Frontend (este repositorio)
- ✅ `Dockerfile` - Optimizado para producción
- ✅ `EASYPANEL_DOS_SERVICIOS.md` - Guía completa de configuración
- ✅ `EASYPANEL_QUICK_START.md` - Guía rápida de referencia

### Backend (directorio separado)
- ✅ `Dockerfile.backend` - Dockerfile optimizado para el backend (en `/Users/chaumesanchez/Downloads/Camara_de_comercio/`)

## 🎯 Configuración en Easypanel

### Servicio 1: Frontend
```
Nombre: frontend-camara-vlc
Dockerfile: Dockerfile
Puerto: 4173
```

**Variables de entorno clave:**
- `VITE_API_BASE_URL=http://backend-camara-vlc:8000` ⚠️ IMPORTANTE: Usa el nombre del servicio backend

### Servicio 2: Backend
```
Nombre: backend-camara-vlc
Dockerfile: Dockerfile.backend
Puerto: 8000
```

**Variables de entorno clave:**
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## 🔗 Comunicación entre Servicios

En Easypanel, los servicios se comunican usando el **nombre del servicio** como hostname:

```
Frontend → Backend: http://backend-camara-vlc:8000
```

**⚠️ CRÍTICO**: El nombre en `VITE_API_BASE_URL` debe coincidir exactamente con el nombre del servicio en Easypanel.

## 📋 Checklist de Despliegue

1. **Frontend**
   - [ ] Crear servicio en Easypanel
   - [ ] Configurar repositorio y rama
   - [ ] Configurar Dockerfile path: `Dockerfile`
   - [ ] Configurar puerto: `4173`
   - [ ] Agregar variables de entorno (especialmente `VITE_API_BASE_URL`)
   - [ ] Desplegar

2. **Backend**
   - [ ] Crear servicio en Easypanel
   - [ ] Configurar repositorio y rama
   - [ ] Configurar Dockerfile path: `Dockerfile.backend` (o `Dockerfile`)
   - [ ] Configurar puerto: `8000`
   - [ ] Agregar variables de entorno (DB y otras)
   - [ ] Desplegar

3. **Verificación**
   - [ ] Ambos servicios muestran "Running"
   - [ ] Frontend puede acceder al backend (revisar logs)
   - [ ] CORS configurado correctamente en el backend

## 📚 Documentación

- **Guía completa**: `EASYPANEL_DOS_SERVICIOS.md`
- **Quick start**: `EASYPANEL_QUICK_START.md`

## 🐛 Problemas Comunes

### Frontend no se conecta al backend
- Verifica que `VITE_API_BASE_URL` use el nombre exacto del servicio
- Verifica que ambos servicios estén en el mismo proyecto de Easypanel
- Revisa los logs de ambos servicios

### Error de CORS
- El backend ya tiene `"*"` en origins, debería funcionar
- Para producción, considera restringir a dominios específicos

### Backend no se conecta a la base de datos
- Verifica las variables de entorno de DB
- Si usas un servicio de DB en Easypanel, usa su nombre como `DB_HOST`



