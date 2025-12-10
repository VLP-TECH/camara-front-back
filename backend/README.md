# Backend - Cámara de Comercio de Valencia

Scripts y configuración del backend para la plataforma digital de la Cámara de Comercio de Valencia.

## Estructura

```
backend/
├── scripts/           # Scripts de utilidad y carga de datos
│   ├── README-backend.md              # Configuración del backend de Brainnova
│   ├── README-load-database.md        # Carga de datos en Supabase
│   ├── README-indicadores-con-datos.md # Cómo encontrar indicadores con datos
│   ├── load-all-data.py               # Script principal para cargar datos
│   ├── load-brainnova-*.py            # Scripts para cargar datos de Brainnova
│   └── ...                            # Otros scripts de utilidad
└── supabase/          # Configuración y migraciones de Supabase
    ├── config.toml    # Configuración de Supabase
    └── migrations/    # Migraciones de base de datos
```

## Scripts Principales

### Carga de Datos

```bash
# Cargar todos los datos
python scripts/load-all-data.py

# Cargar datos de Brainnova
python scripts/load-brainnova-to-supabase.py
```

### Configuración de Base de Datos

```bash
# Ejecutar migraciones SQL
# Los archivos SQL están en scripts/ y se pueden ejecutar en Supabase SQL Editor
```

## Documentación

- `scripts/README-backend.md` - Configuración del backend de Brainnova
- `scripts/README-load-database.md` - Carga de datos en Supabase
- `scripts/README-indicadores-con-datos.md` - Cómo encontrar indicadores con datos

## Migraciones de Supabase

Las migraciones se encuentran en `supabase/migrations/`. Para aplicarlas:

1. **Usando Supabase CLI:**
   ```bash
   supabase db push
   ```

2. **Manualmente desde el Dashboard:**
   - Ve al SQL Editor en Supabase
   - Ejecuta los archivos SQL en orden cronológico

## Notas

- Los scripts de Python requieren las dependencias necesarias instaladas
- Algunos scripts hacen referencia a rutas absolutas que pueden necesitar actualización
- Los scripts SQL deben ejecutarse en el orden correcto según las dependencias


