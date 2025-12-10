import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { 
  getSubdimensionesConScores, 
  getDimensionScore,
  getSubdimensiones 
} from "@/lib/kpis-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Mapeo de dimensiones con sus iconos y descripciones
const dimensionesInfo: Record<string, { icon: any; descripcion: string }> = {
  "Transformación Digital Empresarial": {
    icon: Building2,
    descripcion: "Evaluación del grado de adopción de tecnologías digitales en el tejido empresarial valenciano, midiendo la integración de herramientas como ERP, CRM, Big Data, Cloud Computing y comercio electrónico."
  },
  "Capital Humano": {
    icon: Users,
    descripcion: "Disponibilidad y cualificación del talento digital en la región."
  },
  "Infraestructura Digital": {
    icon: Wifi,
    descripcion: "Calidad y penetración de redes de conectividad."
  },
  "Ecosistema y Colaboración": {
    icon: Network,
    descripcion: "Cooperación entre agentes del ecosistema digital."
  },
  "Emprendimiento e Innovación": {
    icon: Lightbulb,
    descripcion: "Ecosistema de apoyo a startups y proyectos innovadores."
  },
  "Servicios Públicos Digitales": {
    icon: Shield,
    descripcion: "Digitalización y accesibilidad de servicios públicos."
  },
  "Sostenibilidad Digital": {
    icon: Leaf,
    descripcion: "Impacto ambiental y eficiencia energética de la transformación digital."
  },
};

const DimensionDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dimensionNombre = searchParams.get("dimension") || "";
  
  const [selectedTerritorio, setSelectedTerritorio] = useState("Comunitat Valenciana");
  const [selectedAno, setSelectedAno] = useState("2024");
  const [selectedReferencia, setSelectedReferencia] = useState("Media UE");
  const [selectedView, setSelectedView] = useState("Tabla");

  const dimensionInfo = dimensionesInfo[dimensionNombre] || {
    icon: Layers,
    descripcion: "Información detallada de la dimensión."
  };
  const Icon = dimensionInfo.icon;

  // Obtener score global de la dimensión
  const { data: dimensionScore } = useQuery({
    queryKey: ["dimension-score", dimensionNombre, selectedTerritorio, selectedAno],
    queryFn: () => getDimensionScore(dimensionNombre, selectedTerritorio, Number(selectedAno)),
    enabled: !!dimensionNombre,
  });

  // Obtener subdimensiones con scores
  const { data: subdimensiones } = useQuery({
    queryKey: ["subdimensiones-scores", dimensionNombre, selectedTerritorio, selectedAno],
    queryFn: () => getSubdimensionesConScores(dimensionNombre, selectedTerritorio, Number(selectedAno)),
    enabled: !!dimensionNombre,
  });

  // Preparar datos para el gráfico de barras
  const chartData = subdimensiones?.map(sub => ({
    nombre: sub.nombre,
    "Comunitat Valenciana": sub.score,
    "España": sub.espana,
    "UE": sub.ue,
  })) || [];

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

  if (!dimensionNombre) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dimensión no encontrada</h1>
          <Button onClick={() => navigate("/dimensiones")}>Volver a Dimensiones</Button>
        </div>
      </div>
    );
  }

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
              const ItemIcon = item.icon;
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
                  <ItemIcon className="h-5 w-5" />
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
              <button
                onClick={() => navigate("/dimensiones")}
                className="text-[#0c6c8b] hover:text-[#0a5a73] font-medium flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>← Volver a Dimensiones</span>
              </button>
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Dimension Header */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <Icon className="h-10 w-10 text-[#0c6c8b]" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#0c6c8b] mb-3">
                      {dimensionNombre}
                    </h1>
                    <p className="text-gray-600 mb-6">
                      {dimensionInfo.descripcion}
                    </p>
                    <div className="flex items-center space-x-8">
                      <div>
                        <div className="text-5xl font-bold text-gray-900">
                          {dimensionScore || 0}
                        </div>
                        <div className="text-sm text-gray-500">Nota Global</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">0</span>
                          <span className="text-sm text-gray-600">50</span>
                          <span className="text-sm text-gray-600">100</span>
                        </div>
                        <Progress value={dimensionScore || 0} className="h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subdimensiones Cards */}
            <div>
              <h2 className="text-2xl font-bold text-[#0c6c8b] mb-4">
                Detalle de Subdimensiones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subdimensiones?.map((subdimension) => (
                  <Card key={subdimension.nombre} className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {subdimension.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            {selectedTerritorio}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-gray-900">
                            {Math.round(subdimension.score)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Progress value={subdimension.score} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>España: {Math.round(subdimension.espana)}</span>
                        <span>UE: {Math.round(subdimension.ue)}</span>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => navigate(`/kpis?subdimension=${encodeURIComponent(subdimension.nombre)}`)}
                          className="text-[#0c6c8b] hover:text-[#0a5a73]"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Comparativa Regional */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#0c6c8b]">
                  Comparativa Regional
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedView === "Gráfico" && chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="nombre" 
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Comunitat Valenciana" fill="#0c6c8b" />
                      <Bar dataKey="España" fill="#3B82F6" />
                      <Bar dataKey="UE" fill="#4FD1C7" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : selectedView === "Tabla" && subdimensiones ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subdimensión</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">{selectedTerritorio}</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">España</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">UE</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Indicadores</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subdimensiones.map((sub) => (
                          <tr key={sub.nombre} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{sub.nombre}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-lg font-bold text-[#0c6c8b]">{Math.round(sub.score)}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-sm text-gray-700">{Math.round(sub.espana)}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-sm text-gray-700">{Math.round(sub.ue)}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-sm text-gray-500">{sub.indicadores}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay datos disponibles para mostrar
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DimensionDetail;

