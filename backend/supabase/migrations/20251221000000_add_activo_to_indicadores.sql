-- Migración para agregar campo activo a indicadores y activación automática
-- cuando hay datos en resultado_indicadores

-- 1. Agregar campo activo a definicion_indicadores si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'definicion_indicadores' 
        AND column_name = 'activo'
    ) THEN
        ALTER TABLE public.definicion_indicadores 
        ADD COLUMN activo BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 2. Función para actualizar el estado activo de un indicador
CREATE OR REPLACE FUNCTION public.update_indicador_activo()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar el indicador relacionado
    UPDATE public.definicion_indicadores
    SET activo = true
    WHERE nombre = COALESCE(NEW.nombre_indicador, OLD.nombre_indicador)
    AND EXISTS (
        SELECT 1 
        FROM public.resultado_indicadores 
        WHERE nombre_indicador = COALESCE(NEW.nombre_indicador, OLD.nombre_indicador)
        AND valor_calculado IS NOT NULL
    );
    
    -- Si se elimina un resultado, verificar si aún hay datos
    IF TG_OP = 'DELETE' THEN
        UPDATE public.definicion_indicadores
        SET activo = EXISTS (
            SELECT 1 
            FROM public.resultado_indicadores 
            WHERE nombre_indicador = OLD.nombre_indicador
            AND valor_calculado IS NOT NULL
        )
        WHERE nombre = OLD.nombre_indicador;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 3. Función para actualizar todos los indicadores basándose en datos existentes
CREATE OR REPLACE FUNCTION public.actualizar_indicadores_activos()
RETURNS void AS $$
BEGIN
    -- Activar indicadores que tienen datos
    UPDATE public.definicion_indicadores
    SET activo = true
    WHERE nombre IN (
        SELECT DISTINCT nombre_indicador
        FROM public.resultado_indicadores
        WHERE valor_calculado IS NOT NULL
    );
    
    -- Desactivar indicadores que no tienen datos
    UPDATE public.definicion_indicadores
    SET activo = false
    WHERE nombre NOT IN (
        SELECT DISTINCT nombre_indicador
        FROM public.resultado_indicadores
        WHERE valor_calculado IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- 4. Crear triggers para actualizar automáticamente cuando se insertan/actualizan/eliminan resultados
DROP TRIGGER IF EXISTS trigger_update_indicador_activo_insert ON public.resultado_indicadores;
CREATE TRIGGER trigger_update_indicador_activo_insert
AFTER INSERT ON public.resultado_indicadores
FOR EACH ROW
WHEN (NEW.valor_calculado IS NOT NULL)
EXECUTE FUNCTION public.update_indicador_activo();

DROP TRIGGER IF EXISTS trigger_update_indicador_activo_update ON public.resultado_indicadores;
CREATE TRIGGER trigger_update_indicador_activo_update
AFTER UPDATE ON public.resultado_indicadores
FOR EACH ROW
WHEN (NEW.valor_calculado IS NOT NULL OR OLD.valor_calculado IS NOT NULL)
EXECUTE FUNCTION public.update_indicador_activo();

DROP TRIGGER IF EXISTS trigger_update_indicador_activo_delete ON public.resultado_indicadores;
CREATE TRIGGER trigger_update_indicador_activo_delete
AFTER DELETE ON public.resultado_indicadores
FOR EACH ROW
EXECUTE FUNCTION public.update_indicador_activo();

-- 5. Ejecutar la función inicial para actualizar todos los indicadores existentes
SELECT public.actualizar_indicadores_activos();

-- 6. Comentario sobre la función
COMMENT ON FUNCTION public.actualizar_indicadores_activos() IS 
'Actualiza el estado activo de todos los indicadores basándose en si tienen datos en resultado_indicadores. Se puede ejecutar manualmente cuando sea necesario.';

