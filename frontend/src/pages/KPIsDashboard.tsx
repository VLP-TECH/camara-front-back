import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LayoutDashboard,
  Layers,
  LineChart,
  Map,
  BookOpen,
  Clock,
  FileText,
  Search,
  Download,
  TrendingUp,
  ArrowRight,
  Loader2,
  MessageSquare
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import {
  getDimensiones,
  getIndicadoresConDatos,
  getDatosHistoricosIndicador,
  type IndicadorConDatos,
} from "@/lib/kpis-data";
import { exportIndicadoresToCSV } from "@/lib/csv-export";

const KPIsDashboard = () => {
  const navigate = useNavigate();
  const [selectedTerritorio, setSelectedTerritorio] = useState("Comunitat Valenciana");
  const [selectedAno, setSelectedAno] = useState("2024");
  const [selectedReferencia, setSelectedReferencia] = useState("Media UE");
  const [selectedView, setSelectedView] = useState("Tabla");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDimension, setSelectedDimension] = useState("Todas las dimensiones");
  const [selectedSubdimension, setSelectedSubdimension] = useState("Todas las subdimensiones");

  // Obtener dimensiones
  const { data: dimensiones } = useQuery({
    queryKey: ["dimensiones"],
    queryFn: getDimensiones,
  });

  // Obtener todos los indicadores
  const { data: indicadores, isLoading } = useQuery({
    queryKey: ["todos-indicadores"],
    queryFn: () => getIndicadoresConDatos(),
  });

  // Filtrar indicadores
  const filteredIndicadores = indicadores?.filter((ind) => {
    const matchesSearch = !searchQuery || 
      ind.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDimension = selectedDimension === "Todas las dimensiones" || 
      ind.dimension === selectedDimension;
    const matchesSubdimension = selectedSubdimension === "Todas las subdimensiones" || 
      ind.subdimension === selectedSubdimension;
    
    return matchesSearch && matchesDimension && matchesSubdimension;
  }) || [];

  // Obtener datos históricos para gráficos de evolución
  const { data: historicoData } = useQuery({
    queryKey: ["historico-indicadores", filteredIndicadores?.map(i => i.nombre)],
    queryFn: async () => {
      if (!filteredIndicadores || filteredIndicadores.length === 0) return {};
      const historicos: Record<string, any[]> = {};
      for (const ind of filteredIndicadores.slice(0, 10)) {
        const data = await getDatosHistoricosIndicador(ind.nombre, selectedTerritorio, 5);
        if (data && data.length > 0) {
          historicos[ind.nombre] = data.map(d => ({
            periodo: d.periodo,
            valor: d.valor_calculado
          }));
        }
      }
      return historicos;
    },
    enabled: filteredIndicadores && filteredIndicadores.length > 0,
  });

  const handleExport = () => {
    if (filteredIndicadores) {
      exportIndicadoresToCSV(filteredIndicadores, "todos-indicadores");
    }
  };

  // Calcular valor normalizado (0-100)
  const getNormalizedValue = (valor: number | undefined): number => {
    if (!valor) return 0;
    // Normalización simple (ajustar según lógica de negocio)
    return Math.min(100, Math.max(0, (valor / 100) * 100));
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard General", href: "/dashboard" },
    { icon: Layers, label: "Dimensiones", href: "/dimensiones" },
    { icon: LineChart, label: "Todos los Indicadores", href: "/kpis", active: true },
    { icon: Map, label: "Comparación Territorial", href: "/comparacion" },
    { icon: Clock, label: "Evolución Temporal", href: "/evolucion" },
    { icon: FileText, label: "Informes", href: "/informes" },
    { icon: MessageSquare, label: "Encuestas", href: "/encuestas" },
    { icon: BookOpen, label: "Metodología", href: "/metodologia" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0c6c8b] text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-[#0c6c8b] rounded"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold">BRAINNOVA</h1>
              <p className="text-xs text-blue-200">Economía Digital</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <button
                  key={item.label}
                  onClick={() => item.href && navigate(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors relative ${
                    isActive
                      ? "bg-[#0a5a73] text-white"
                      : "text-blue-100 hover:bg-[#0a5a73]/50"
                  }`}
                  style={isActive ? {
                    borderLeft: '4px solid #4FD1C7'
                  } : {}}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-blue-600">
          <p className="text-xs text-blue-200">Versión 2025</p>
          <p className="text-xs text-blue-200">Actualizado Nov 2025</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-blue-100 text-[#0c6c8b] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">BRAINNOVA Economía Digital</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedTerritorio} onValueChange={setSelectedTerritorio}>
                <SelectTrigger className="w-48 bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comunitat Valenciana">Comunitat Valenciana</SelectItem>
                  <SelectItem value="España">España</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedAno} onValueChange={setSelectedAno}>
                <SelectTrigger className="w-32 bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedReferencia} onValueChange={setSelectedReferencia}>
                <SelectTrigger className="w-40 bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Media UE">Media UE</SelectItem>
                  <SelectItem value="Top UE">Top UE</SelectItem>
                  <SelectItem value="España">España</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedView === "Tabla" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("Tabla")}
                className={selectedView === "Tabla" ? "bg-[#0c6c8b] text-white" : ""}
              >
                Tabla
              </Button>
              <Button
                variant={selectedView === "Gráfico" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("Gráfico")}
                className={selectedView === "Gráfico" ? "bg-[#0c6c8b] text-white" : ""}
              >
                Gráfico
              </Button>
              <Button
                variant={selectedView === "Mapa" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("Mapa")}
                className={selectedView === "Mapa" ? "bg-[#0c6c8b] text-white" : ""}
              >
                Mapa
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#0c6c8b] mb-2">
                Todos los Indicadores
              </h1>
              <p className="text-gray-600">
                Repositorio completo de todos los indicadores del Sistema BRAINNOVA. Filtra por dimensión, subdimensión o busca por nombre para encontrar métricas específicas.
              </p>
            </div>

            {/* Search and Filter Bar */}
            <Card className="p-4 mb-6 bg-white">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar indicador..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                  <SelectTrigger className="w-64 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas las dimensiones">Todas las dimensiones</SelectItem>
                    {dimensiones?.map((dim) => (
                      <SelectItem key={dim.nombre} value={dim.nombre}>
                        {dim.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSubdimension} onValueChange={setSelectedSubdimension}>
                  <SelectTrigger className="w-64 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas las subdimensiones">Todas las subdimensiones</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={handleExport}
                  className="bg-[#0c6c8b] text-white hover:bg-[#0a5a73]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar datos
                </Button>
              </div>
            </Card>

            {/* Indicator Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Mostrando {filteredIndicadores.length} de {indicadores?.length || 0} indicadores
              </p>
            </div>

            {/* Indicators Table */}
            {isLoading ? (
              <Card className="p-12 text-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-[#0c6c8b] mx-auto mb-4" />
                <p className="text-gray-600">Cargando indicadores...</p>
              </Card>
            ) : (
              <Card className="bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Indicador</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fórmula</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Dimensión</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Valor Actual</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Normalizado</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Evolución</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIndicadores.map((indicador, index) => {
                        const normalized = getNormalizedValue(indicador.ultimoValor);
                        const historico = historicoData?.[indicador.nombre] || [];
                        const hasTrend = indicador.ultimoValor !== undefined;
                        
                        return (
                          <tr 
                            key={`${indicador.nombre}-${index}`}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{indicador.nombre}</p>
                                {indicador.subdimension && (
                                  <p className="text-xs text-gray-500 mt-1">{indicador.subdimension}</p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-gray-600">{indicador.formula || "—"}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-700">{indicador.dimension || "—"}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-sm font-medium text-gray-900">
                                {indicador.ultimoValor !== undefined 
                                  ? `${indicador.ultimoValor.toFixed(1)}${indicador.ultimoValor > 1 ? '%' : ''}` 
                                  : "—"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700 w-10">{normalized}</span>
                                <div className="flex-1">
                                  <Progress value={normalized} className="h-2" />
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {historico.length > 0 ? (
                                <div className="w-24 h-8 mx-auto">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <RechartsLineChart data={historico}>
                                      <Line 
                                        type="monotone" 
                                        dataKey="valor" 
                                        stroke="#0c6c8b" 
                                        strokeWidth={2}
                                        dot={false}
                                      />
                                    </RechartsLineChart>
                                  </ResponsiveContainer>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {hasTrend ? (
                                <TrendingUp className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <ArrowRight className="h-5 w-5 text-gray-400 mx-auto" />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default KPIsDashboard;
