import { Briefcase, Truck, FileText, Users, Database, FolderOpen, Settings } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/komatsu-hero.jpg";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Subtle Background Image */}
      <div className="fixed inset-0 z-0 opacity-5">
        <img
          src={heroImage}
          alt="Komatsu Mining"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 py-16 space-y-16 max-w-7xl mx-auto">
        {/* Hero Title - Extra Large Typography */}
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight tracking-tight">
            Portal Web de<br />
            <span className="text-primary">Operaciones</span> &<br />
            <span className="text-accent">Servicios Minería</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light">
            Sistema integral de gestión y monitoreo de operaciones mineras
          </p>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Button 
            onClick={() => navigate("/aceites")}
            variant="outline"
            className="h-24 text-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 border-2"
          >
            <Database className="mr-3 h-6 w-6" />
            Gestión de Aceites
          </Button>
          <Button 
            onClick={() => navigate("/archivos")}
            variant="outline"
            className="h-24 text-lg font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105 border-2"
          >
            <FolderOpen className="mr-3 h-6 w-6" />
            Archivos
          </Button>
          <Button 
            onClick={() => navigate("/reportes")}
            variant="outline"
            className="h-24 text-lg font-medium hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-105 border-2"
          >
            <FileText className="mr-3 h-6 w-6" />
            Reportes
          </Button>
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
