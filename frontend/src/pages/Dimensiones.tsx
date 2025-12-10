import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  MessageSquare,
  Building2,
  Users,
  Wifi,
  Network,
  Lightbulb,
  Shield,
  Leaf,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getDimensiones, getIndicadoresConDatos, type IndicadorConDatos } from "@/lib/kpis-data";

interface DimensionData {
  nombre: string;
  score: number;
  descripcion: string;
  icon: any;
  indicadores: IndicadorConDatos[];
}

const Dimensiones = () => {
  const navigate = useNavigate();
  const [selectedTerritorio, setSelectedTerritorio] = useState("Comunitat Valenciana");
  const [selectedAno, setSelectedAno] = useState("2024");
  const [selectedReferencia, setSelectedReferencia] = useState("Media UE");
  const [selectedView, setSelectedView] = useState("Tabla");
  const [expandedDimensions, setExpandedDimensions] = useState<Set<string>>(new Set());

  // Obtener dimensiones
  const { data: dimensiones } = useQuery({
    queryKey: ["dimensiones"],
    queryFn: getDimensiones,
  });

  // Obtener todos los indicadores
  const { data: indicadores } = useQuery({
    queryKey: ["todos-indicadores"],
    queryFn: () => getIndicadoresConDatos(),
  });

  // Mapeo de dimensiones con sus datos
  const dimensionesData: DimensionData[] = [
    {
      nombre: "Transformación Digital Empresarial",
      score: 68,
      descripcion: "Grado de adopción de tecnologías digitales en el tejido empresarial valenciano.",
      icon: Building2,
      indicadores: []
    },
    {
      nombre: "Capital Humano",
      score: 72,
      descripcion: "Disponibilidad y cualificación del talento digital en la región.",
      icon: Users,
      indicadores: []
    },
    {
      nombre: "Infraestructura Digital",
      score: 75,
      descripcion: "Calidad y penetración de redes de conectividad.",
      icon: Wifi,
      indicadores: []
    },
    {
      nombre: "Ecosistema y Colaboración",
      score: 64,
      descripcion: "Cooperación entre agentes del ecosistema digital.",
      icon: Network,
      indicadores: []
    },
    {
      nombre: "Emprendimiento e Innovación",
      score: 58,
      descripcion: "Ecosistema de apoyo a startups y proyectos innovadores.",
      icon: Lightbulb,
      indicadores: []
    },
    {
      nombre: "Servicios Públicos Digitales",
      score: 70,
      descripcion: "Digitalización y accesibilidad de servicios públicos.",
      icon: Shield,
      indicadores: []
    },
    {
      nombre: "Sostenibilidad Digital",
      score: 62,
      descripcion: "Impacto ambiental y eficiencia energética de la transformación digital.",
      icon: Leaf,
      indicadores: []
    },
  ];

  // Agrupar indicadores por dimensión
  const dimensionesConIndicadores = dimensionesData.map(dim => {
    const indicadoresDim = indicadores?.filter(ind => 
      ind.dimension === dim.nombre
    ) || [];
    return {
      ...dim,
      indicadores: indicadoresDim
    };
  });

  const toggleDimension = (dimensionNombre: string) => {
    const newExpanded = new Set(expandedDimensions);
    if (newExpanded.has(dimensionNombre)) {
      newExpanded.delete(dimensionNombre);
    } else {
      newExpanded.add(dimensionNombre);
    }
    setExpandedDimensions(newExpanded);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard General", href: "/dashboard" },
    { icon: Layers, label: "Dimensiones", href: "/dimensiones", active: true },
    { icon: LineChart, label: "Todos los Indicadores", href: "/kpis" },
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0c6c8b] mb-2">
                Dimensiones del Sistema BRAINNOVA
              </h1>
              <p className="text-lg text-[#0c6c8b]">
                Explora las siete dimensiones clave que componen el Índice de economía digital de la Comunitat Valenciana
              </p>
            </div>

            {/* Dimension Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dimensionesConIndicadores.map((dimension) => {
                const Icon = dimension.icon;
                const isExpanded = expandedDimensions.has(dimension.nombre);
                return (
                  <Card key={dimension.nombre} className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon className="h-6 w-6 text-[#0c6c8b]" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">
                            {dimension.score}
                          </div>
                          <div className="text-sm text-gray-500">sobre 100</div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {dimension.nombre}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                        {dimension.descripcion}
                      </p>
                      
                      <div className="mb-4">
                        <Progress value={dimension.score} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">
                          {dimension.indicadores.length} indicadores
                        </span>
                        <button
                          onClick={() => toggleDimension(dimension.nombre)}
                          className="text-[#0c6c8b] hover:text-[#0a5a73] font-medium text-sm flex items-center space-x-1"
                        >
                          <span>{isExpanded ? "Ocultar" : "Ver"} indicadores</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Lista de indicadores expandible */}
                      {isExpanded && dimension.indicadores.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Indicadores ({dimension.indicadores.length})
                          </h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {dimension.indicadores.map((indicador, idx) => (
                              <div
                                key={idx}
                                className="p-2 bg-gray-50 rounded text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate(`/kpis?search=${encodeURIComponent(indicador.nombre)}`)}
                              >
                                <div className="font-medium">{indicador.nombre}</div>
                                {indicador.subdimension && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {indicador.subdimension}
                                  </div>
                                )}
                                {indicador.ultimoValor !== undefined && (
                                  <div className="text-xs text-[#0c6c8b] mt-1">
                                    Valor: {indicador.ultimoValor.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => navigate(`/dimensiones/detalle?dimension=${encodeURIComponent(dimension.nombre)}`)}
                          className="text-[#0c6c8b] hover:text-[#0a5a73] font-medium text-sm flex items-center space-x-1 w-full justify-end"
                        >
                          <span>Ver detalle completo</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dimensiones;

