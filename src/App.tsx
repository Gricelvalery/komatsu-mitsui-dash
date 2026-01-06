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
import Procesos from "./pages/Procesos";
import FileManagement from "./pages/FileManagement";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div
              className={cn(
                "flex-1 transition-smooth",
                sidebarCollapsed ? "ml-16" : "ml-64"
              )}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <DashboardHeader title="Dashboard" />
                      <Dashboard />
                    </>
                  }
                />
                <Route
                  path="/kpi/antapaccay"
                  element={
                    <>
                      <DashboardHeader title="KPIs Antapaccay" />
                      <KpisAntapaccay />
                    </>
                  }
                />
                <Route
                  path="/plm"
                  element={
                    <>
                      <DashboardHeader title="Gestión PLM" />
                      <Plm />
                    </>
                  }
                />
                <Route
                  path="/aceites/*"
                  element={
                    <>
                      <DashboardHeader title="Gestión de Aceites" />
                      <Aceites />
                    </>
                  }
                />
                <Route
                  path="/aceites/quellaveco"
                  element={<Quellaveco />}
                />
                <Route
                  path="/archivos/*"
                  element={
                    <>
                      <DashboardHeader title="Gestión de Archivos" />
                      <FileManagement />
                    </>
                  }
                />
                <Route
                  path="/reportes/*"
                  element={
                    <>
                      <DashboardHeader title="Reportes" />
                      <Reports />
                    </>
                  }
                />
                <Route
                  path="/usuarios/*"
                  element={
                    <>
                      <DashboardHeader title="Usuarios" />
                      <Users />
                    </>
                  }
                />
                <Route
                  path="/gerencia/reporte"
                  element={
                    <>
                      <DashboardHeader title="Gerencia - Reporte de Proyectos" />
                      <GerenciaReporte />
                    </>
                  }
                />
                <Route
                  path="/procesos/*"
                  element={
                    <>
                      <DashboardHeader title="Gestión de Procesos" />
                      <Procesos />
                    </>
                  }
                />
                <Route
                  path="/configuracion"
                  element={
                    <>
                      <DashboardHeader title="Configuración del Sistema" />
                      <Settings />
                    </>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
