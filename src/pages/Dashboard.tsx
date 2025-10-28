import { Briefcase, Truck, FileText, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import heroImage from "@/assets/komatsu-hero.jpg";

export const Dashboard = () => {
  return (
    <div className="relative min-h-screen">
      {/* Video/Image Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={heroImage}
          alt="Komatsu Mining"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 space-y-8">
        {/* Hero Title */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Panel Administrativo Komatsu Mitsui
          </h1>
          <p className="text-lg text-white/80">
            Sistema de gestión y monitoreo de operaciones
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
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
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <ChartsSection />
        </div>
      </div>
    </div>
  );
};
