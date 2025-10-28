import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Dashboard } from "@/pages/Dashboard";
import { ComingSoon } from "@/pages/ComingSoon";
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
                  path="/archivos/subir"
                  element={
                    <>
                      <DashboardHeader title="Subir Archivos" />
                      <ComingSoon title="Subir Archivos" />
                    </>
                  }
                />
                <Route
                  path="/archivos/lista"
                  element={
                    <>
                      <DashboardHeader title="Ver Archivos" />
                      <ComingSoon title="Gestión de Archivos" />
                    </>
                  }
                />
                <Route
                  path="/reportes/generar"
                  element={
                    <>
                      <DashboardHeader title="Generar Reporte" />
                      <ComingSoon title="Generar Reporte" />
                    </>
                  }
                />
                <Route
                  path="/reportes/historial"
                  element={
                    <>
                      <DashboardHeader title="Historial de Reportes" />
                      <ComingSoon title="Historial de Reportes" />
                    </>
                  }
                />
                <Route
                  path="/usuarios/lista"
                  element={
                    <>
                      <DashboardHeader title="Lista de Usuarios" />
                      <ComingSoon title="Lista de Usuarios" />
                    </>
                  }
                />
                <Route
                  path="/usuarios/agregar"
                  element={
                    <>
                      <DashboardHeader title="Agregar Usuario" />
                      <ComingSoon title="Agregar Usuario" />
                    </>
                  }
                />
                <Route
                  path="/usuarios/roles"
                  element={
                    <>
                      <DashboardHeader title="Roles y Permisos" />
                      <ComingSoon title="Roles y Permisos" />
                    </>
                  }
                />
                <Route
                  path="/configuracion"
                  element={
                    <>
                      <DashboardHeader title="Configuración del Sistema" />
                      <ComingSoon title="Configuración" />
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
