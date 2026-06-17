import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Dashboard } from "./pages/Dashboard";
import { KpisAntapaccay } from "./pages/KpisAntapaccay";
import { Plm } from "./pages/Plm";
import Aceites from "./pages/Aceites";
import Quellaveco from "./pages/Quellaveco";
import GerenciaReporte from "./pages/GerenciaReporte";
import GerenciaLlenado from "./pages/GerenciaLlenado";
import Procesos from "./pages/Procesos";
import FileManagement from "./pages/FileManagement";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import BambasGraficoMina from "./pages/BambasGraficoMina";
import SeguimientoHerramientas from "./pages/SeguimientoHerramientas";
import SeguimientoKpi from "./pages/SeguimientoKpi";
import MejoraAgenda from "./pages/MejoraAgenda";
import HerramientasPoder from "./pages/HerramientasPoder";
import ControlCompras from "./pages/ControlCompras";
import AuthPage from "./pages/Auth";
import SolpedsGrid from "./pages/SolpedsGrid";
import SolpedAprobaciones from "./pages/SolpedAprobaciones";
import Presupuestos from "./pages/Presupuestos";
import SolpedDashboard from "./pages/SolpedDashboard";
import Taxis from "./pages/Taxis";
import Tiny from "./pages/Tiny";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

const AppLayout = ({ sidebarCollapsed, setSidebarCollapsed, children }: any) => (
  <div className="flex min-h-screen w-full">
    <DashboardSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
    <div className={cn("flex-1 transition-smooth", sidebarCollapsed ? "ml-16" : "ml-64")}>
      {children}
    </div>
  </div>
);

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={
                <AppLayout sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
                  <Routes>
                    <Route path="/" element={<><DashboardHeader title="Dashboard" /><Dashboard /></>} />
                    <Route path="/kpi/antapaccay" element={<><DashboardHeader title="KPIs Antapaccay" /><KpisAntapaccay /></>} />
                    <Route path="/plm" element={<><DashboardHeader title="Gestión PLM" /><Plm /></>} />
                    <Route path="/aceites/*" element={<><DashboardHeader title="Gestión de Aceites" /><Aceites /></>} />
                    <Route path="/aceites/quellaveco" element={<Quellaveco />} />
                    <Route path="/archivos/*" element={<><DashboardHeader title="Gestión de Archivos" /><FileManagement /></>} />
                    <Route path="/reportes/*" element={<><DashboardHeader title="Reportes" /><Reports /></>} />
                    <Route path="/usuarios/*" element={<><DashboardHeader title="Usuarios" /><Users /></>} />
                    <Route path="/gerencia/reporte" element={<><DashboardHeader title="Gerencia - Reporte de Proyectos" /><GerenciaReporte /></>} />
                    <Route path="/gerencia/llenado" element={<><DashboardHeader title="Gerencia - Llenado de Datos" /><GerenciaLlenado /></>} />
                    <Route path="/procesos/*" element={<><DashboardHeader title="Gestión de Procesos" /><Procesos /></>} />
                    <Route path="/bambas/grafico-mina" element={<><DashboardHeader title="Bambas - Gráfico de Mina" /><BambasGraficoMina /></>} />
                    <Route path="/mejora/agenda" element={<><DashboardHeader title="Mejora - Agenda de Reuniones" /><MejoraAgenda /></>} />
                    <Route path="/administracion/seguimiento" element={<><DashboardHeader title="Administración - Seguimiento de Herramientas" /><SeguimientoHerramientas /></>} />
                    <Route path="/administracion/kpi" element={<><DashboardHeader title="Administración - KPI Herramientas" /><SeguimientoKpi /></>} />
                    <Route path="/administracion/herramientas-poder" element={<><DashboardHeader title="Administración - Herramientas de Poder" /><HerramientasPoder /></>} />
                    <Route path="/administracion/control-compras" element={<><DashboardHeader title="Administración - Control de Compras" /><ControlCompras /></>} />
                    <Route path="/solpeds" element={<><DashboardHeader title="SOLPEDs" /><SolpedsGrid /></>} />
                    <Route path="/taxis" element={<><DashboardHeader title="Gestión de Taxis" /><Taxis /></>} />
                    <Route path="/tiny" element={<><DashboardHeader title="Tiny - Control de Herramientas" /><Tiny /></>} />
                    <Route path="/solpeds/aprobaciones" element={<ProtectedRoute><><DashboardHeader title="SOLPEDs - Aprobaciones" /><SolpedAprobaciones /></></ProtectedRoute>} />
                    <Route path="/solpeds/dashboard" element={<ProtectedRoute><><DashboardHeader title="SOLPEDs - Dashboard Ejecutivo" /><SolpedDashboard /></></ProtectedRoute>} />
                    <Route path="/presupuestos" element={<ProtectedRoute><><DashboardHeader title="Presupuestos por Proyecto" /><Presupuestos /></></ProtectedRoute>} />
                    <Route path="/configuracion" element={<><DashboardHeader title="Configuración del Sistema" /><Settings /></>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

