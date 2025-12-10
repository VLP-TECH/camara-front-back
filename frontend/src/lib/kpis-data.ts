// Funciones para obtener datos de KPIs desde Supabase
import { supabase } from "@/integrations/supabase/client";

export interface Dimension {
  nombre: string;
  peso: number;
  id: string;
}

export interface Subdimension {
  nombre: string;
  nombre_dimension: string;
  peso: number;
}

export interface Indicador {
  nombre: string;
  nombre_subdimension: string;
  importancia: string | null;
  formula: string | null;
  fuente: string | null;
  origen_indicador: string | null;
}

export interface IndicadorConDatos extends Indicador {
  dimension: string;
  subdimension: string;
  ultimoValor?: number;
  ultimoPeriodo?: number;
  totalResultados?: number;
}

/**
 * Obtiene todas las dimensiones desde Supabase
 */
export async function getDimensiones(): Promise<Dimension[]> {
  try {
    const { data, error } = await supabase
      .from("dimensiones")
      .select("nombre, peso")
      .order("peso", { ascending: false });

    if (error) throw error;

    return (data || []).map((dim) => ({
      nombre: dim.nombre,
      peso: dim.peso,
      id: dim.nombre.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[áéíóú]/g, (m) => ({ á: "a", é: "e", í: "i", ó: "o", ú: "u" }[m] || m)),
    }));
  } catch (error) {
    console.error("Error fetching dimensiones:", error);
    return [];
  }
}

/**
 * Obtiene todas las subdimensiones desde Supabase
 */
export async function getSubdimensiones(): Promise<Subdimension[]> {
  try {
    const { data, error } = await supabase
      .from("subdimensiones")
      .select("nombre, nombre_dimension, peso")
      .order("nombre_dimension, peso");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching subdimensiones:", error);
    return [];
  }
}

/**
 * Obtiene todos los indicadores desde Supabase
 */
export async function getIndicadores(): Promise<Indicador[]> {
  try {
    const { data, error } = await supabase
      .from("definicion_indicadores")
      .select("nombre, nombre_subdimension, importancia, formula, fuente, origen_indicador")
      .order("nombre");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching indicadores:", error);
    return [];
  }
}

/**
 * Obtiene indicadores con datos agregados (valores, resultados, etc.)
 */
export async function getIndicadoresConDatos(
  nombreDimension?: string
): Promise<IndicadorConDatos[]> {
  try {
    // Obtener indicadores
    let indicadores = await getIndicadores();
    
    // Filtrar por dimensión si se especifica
    if (nombreDimension) {
      const subdimensiones = await getSubdimensiones();
      const subdimensionesFiltradas = subdimensiones
        .filter((sub) => sub.nombre_dimension === nombreDimension)
        .map((sub) => sub.nombre);
      
      indicadores = indicadores.filter((ind) =>
        subdimensionesFiltradas.includes(ind.nombre_subdimension)
      );
    }

    // Obtener subdimensiones para mapear a dimensiones
    const subdimensiones = await getSubdimensiones();
    const subdimMap = new Map(
      subdimensiones.map((sub) => [sub.nombre, sub.nombre_dimension])
    );

    // Obtener datos de resultados para cada indicador
    const indicadoresConDatos = await Promise.all(
      indicadores.map(async (ind) => {
        // Obtener último valor y total de resultados
        const { data: resultados, error } = await supabase
          .from("resultado_indicadores")
          .select("valor_calculado, periodo")
          .eq("nombre_indicador", ind.nombre)
          .order("periodo", { ascending: false })
          .limit(1);

        const { count } = await supabase
          .from("resultado_indicadores")
          .select("id", { count: "exact", head: true })
          .eq("nombre_indicador", ind.nombre);

        return {
          ...ind,
          dimension: subdimMap.get(ind.nombre_subdimension) || "",
          subdimension: ind.nombre_subdimension,
          ultimoValor: resultados?.[0]?.valor_calculado
            ? Number(resultados[0].valor_calculado)
            : undefined,
          ultimoPeriodo: resultados?.[0]?.periodo || undefined,
          totalResultados: count || 0,
        };
      })
    );

    return indicadoresConDatos;
  } catch (error) {
    console.error("Error fetching indicadores con datos:", error);
    return [];
  }
}

/**
 * Obtiene datos históricos de un indicador para gráficos
 */
export async function getDatosHistoricosIndicador(
  nombreIndicador: string,
  pais: string = "España",
  limit: number = 10
): Promise<Array<{ periodo: number; valor: number }>> {
  try {
    const { data, error } = await supabase
      .from("resultado_indicadores")
      .select("periodo, valor_calculado")
      .eq("nombre_indicador", nombreIndicador)
      .eq("pais", pais)
      .order("periodo", { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((item) => ({
      periodo: item.periodo || 0,
      valor: Number(item.valor_calculado) || 0,
    }));
  } catch (error) {
    console.error("Error fetching datos históricos:", error);
    return [];
  }
}

/**
 * Obtiene datos agregados por subdimensión para una dimensión
 */
export async function getDatosPorSubdimension(
  nombreDimension: string,
  pais: string = "España"
): Promise<Array<{ subdimension: string; totalIndicadores: number; indicadoresConDatos: number }>> {
  try {
    const subdimensiones = await getSubdimensiones();
    const subdimensionesFiltradas = subdimensiones.filter(
      (sub) => sub.nombre_dimension === nombreDimension
    );

    const datos = await Promise.all(
      subdimensionesFiltradas.map(async (sub) => {
        const { count: totalIndicadores } = await supabase
          .from("definicion_indicadores")
          .select("nombre", { count: "exact", head: true })
          .eq("nombre_subdimension", sub.nombre);

        // Contar indicadores que tienen datos
        const { data: indicadores } = await supabase
          .from("definicion_indicadores")
          .select("nombre")
          .eq("nombre_subdimension", sub.nombre);

        let indicadoresConDatos = 0;
        if (indicadores) {
          const counts = await Promise.all(
            indicadores.map((ind) =>
              supabase
                .from("resultado_indicadores")
                .select("id", { count: "exact", head: true })
                .eq("nombre_indicador", ind.nombre)
                .eq("pais", pais)
            )
          );
          indicadoresConDatos = counts.filter((c) => (c.count || 0) > 0).length;
        }

        return {
          subdimension: sub.nombre,
          totalIndicadores: totalIndicadores || 0,
          indicadoresConDatos,
        };
      })
    );

    return datos;
  } catch (error) {
    console.error("Error fetching datos por subdimension:", error);
    return [];
  }
}

/**
 * Obtiene datos detallados de subdimensiones con scores y comparativas
 */
export async function getSubdimensionesConScores(
  nombreDimension: string,
  pais: string = "Comunitat Valenciana",
  periodo: number = 2024
): Promise<Array<{
  nombre: string;
  score: number;
  espana: number;
  ue: number;
  indicadores: number;
}>> {
  try {
    const subdimensiones = await getSubdimensiones();
    const subdimensionesFiltradas = subdimensiones.filter(
      (sub) => sub.nombre_dimension === nombreDimension
    );

    const datos = await Promise.all(
      subdimensionesFiltradas.map(async (sub) => {
        // Obtener indicadores de esta subdimensión
        const { data: indicadores } = await supabase
          .from("definicion_indicadores")
          .select("nombre")
          .eq("nombre_subdimension", sub.nombre);

        if (!indicadores || indicadores.length === 0) {
          return {
            nombre: sub.nombre,
            score: 0,
            espana: 0,
            ue: 0,
            indicadores: 0,
          };
        }

        // Obtener valores promedio de los indicadores para el territorio seleccionado
        const valoresTerritorio = await Promise.all(
          indicadores.map(async (ind) => {
            const { data } = await supabase
              .from("resultado_indicadores")
              .select("valor_calculado")
              .eq("nombre_indicador", ind.nombre)
              .eq("pais", pais)
              .eq("periodo", periodo)
              .limit(1);
            return data?.[0]?.valor_calculado ? Number(data[0].valor_calculado) : null;
          })
        );

        // Obtener valores promedio para España
        const valoresEspana = await Promise.all(
          indicadores.map(async (ind) => {
            const { data } = await supabase
              .from("resultado_indicadores")
              .select("valor_calculado")
              .eq("nombre_indicador", ind.nombre)
              .eq("pais", "España")
              .eq("periodo", periodo)
              .limit(1);
            return data?.[0]?.valor_calculado ? Number(data[0].valor_calculado) : null;
          })
        );

        // Obtener valores promedio para UE (usando un país de referencia o promedio)
        const valoresUE = await Promise.all(
          indicadores.map(async (ind) => {
            // Buscar valores de países UE (simplificado, usar promedio si hay varios)
            const { data } = await supabase
              .from("resultado_indicadores")
              .select("valor_calculado")
              .eq("nombre_indicador", ind.nombre)
              .eq("periodo", periodo)
              .in("pais", ["Alemania", "Francia", "Italia", "Países Bajos"])
              .limit(4);
            
            if (data && data.length > 0) {
              const promedio = data.reduce((sum, d) => sum + Number(d.valor_calculado || 0), 0) / data.length;
              return promedio;
            }
            return null;
          })
        );

        // Calcular promedios (normalizados a 0-100)
        const calcularPromedio = (valores: (number | null)[]) => {
          const valoresValidos = valores.filter(v => v !== null) as number[];
          if (valoresValidos.length === 0) return 0;
          const promedio = valoresValidos.reduce((sum, v) => sum + v, 0) / valoresValidos.length;
          // Normalizar a escala 0-100 (ajustar según necesidad)
          return Math.min(100, Math.max(0, promedio));
        };

        return {
          nombre: sub.nombre,
          score: calcularPromedio(valoresTerritorio),
          espana: calcularPromedio(valoresEspana),
          ue: calcularPromedio(valoresUE),
          indicadores: indicadores.length,
        };
      })
    );

    return datos;
  } catch (error) {
    console.error("Error fetching subdimensiones con scores:", error);
    return [];
  }
}

/**
 * Obtiene el score global de una dimensión
 */
export async function getDimensionScore(
  nombreDimension: string,
  pais: string = "Comunitat Valenciana",
  periodo: number = 2024
): Promise<number> {
  try {
    const subdimensiones = await getSubdimensionesConScores(nombreDimension, pais, periodo);
    if (subdimensiones.length === 0) return 0;
    
    const promedio = subdimensiones.reduce((sum, sub) => sum + sub.score, 0) / subdimensiones.length;
    return Math.round(promedio);
  } catch (error) {
    console.error("Error fetching dimension score:", error);
    return 0;
  }
}

