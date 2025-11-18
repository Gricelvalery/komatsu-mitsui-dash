import { Briefcase, Truck, FileText, Users, Database, FolderOpen, Settings } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/komatsu-hero.jpg";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Enhanced Background with overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <img
          src={heroImage}
          alt="Komatsu Mining"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 py-16 space-y-16 max-w-7xl mx-auto">
        {/* Hero Title with Gradient Text */}
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
            Portal Web de<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Operaciones
            </span>{" "}
            &<br />
            <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Servicios Minería
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light">
            Sistema integral de gestión y monitoreo de operaciones mineras
          </p>
        </div>

        {/* Quick Access Buttons - Glassmorphism Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => navigate("/aceites")}
            className="group relative h-32 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border-2 border-white/20 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-elevated overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative h-full flex flex-col items-center justify-center space-y-3 text-foreground">
              <Database className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg font-semibold">Gestión de Aceites</span>
            </div>
          </button>
          
          <button
            onClick={() => navigate("/archivos")}
            className="group relative h-32 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border-2 border-white/20 hover:border-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-elevated overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative h-full flex flex-col items-center justify-center space-y-3 text-foreground">
              <FolderOpen className="h-10 w-10 text-accent group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg font-semibold">Archivos</span>
            </div>
          </button>
          
          <button
            onClick={() => navigate("/reportes")}
            className="group relative h-32 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border-2 border-white/20 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-elevated overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative h-full flex flex-col items-center justify-center space-y-3 text-foreground">
              <FileText className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg font-semibold">Reportes</span>
            </div>
          </button>
        </div>

        {/* Stats Cards - Minimal Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <StatsCard
            title="Proyectos Activos"
            value={28}
            icon={Briefcase}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Equipos Operativos"
            value={65}
            icon={Truck}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Reportes Generados"
            value={142}
            icon={FileText}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Usuarios Registrados"
            value={89}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <ChartsSection />
        </div>
      </div>
    </div>
  );
};
