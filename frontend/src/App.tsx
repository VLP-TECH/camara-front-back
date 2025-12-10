import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ChatWidget from "@/components/ChatWidget";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminConfig from "./pages/AdminConfig";
import Surveys from "./pages/Surveys";
import SurveyForm from "./pages/SurveyForm";
import CreateSurvey from "./pages/CreateSurvey";
import OpenData from "./pages/OpenData";
import KPIsDashboard from "./pages/KPIsDashboard";
import Tendencias from "./pages/Tendencias";
import BrainnovaScore from "./pages/BrainnovaScore";
import Metodologia from "./pages/Metodologia";
import Informes from "./pages/Informes";
import EvolucionTemporal from "./pages/EvolucionTemporal";
import ComparacionTerritorial from "./pages/ComparacionTerritorial";
import Dimensiones from "./pages/Dimensiones";
import DimensionDetail from "./pages/DimensionDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dimensiones" element={<Dimensiones />} />
              <Route path="/dimensiones/detalle" element={<DimensionDetail />} />
              <Route path="/admin-usuarios" element={<AdminDashboard />} />
              <Route path="/config" element={<AdminConfig />} />
              <Route path="/encuestas" element={<Surveys />} />
              <Route path="/encuestas/crear" element={<CreateSurvey />} />
              <Route path="/encuestas/:id" element={<SurveyForm />} />
              <Route path="/datos-abiertos" element={<OpenData />} />
              <Route path="/kpis" element={<KPIsDashboard />} />
              <Route path="/tendencias" element={<Tendencias />} />
              <Route path="/brainnova-score" element={<BrainnovaScore />} />
              <Route path="/metodologia" element={<Metodologia />} />
              <Route path="/informes" element={<Informes />} />
              <Route path="/evolucion" element={<EvolucionTemporal />} />
              <Route path="/comparacion" element={<ComparacionTerritorial />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ChatWidget />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;