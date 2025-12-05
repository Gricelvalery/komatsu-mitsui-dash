import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search, Filter, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Proyectos principales
const projects = ["Antamina", "Bayovar", "Antapaccay", "Las Bambas", "Quellaveco", "Cerro Verde"];

// Categorías con sus items
const categories = [
  {
    key: "seguridad",
    label: "SEGURIDAD",
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-600",
    items: [
      "Inspección EPP",
      "Capacitación SST",
      "Auditoría Interna",
      "Protocolo LOTO",
      "Check Pre-Operacional",
      "Matriz IPERC"
    ]
  },
  {
    key: "disponibilidad",
    label: "DISPONIBILIDAD",
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600",
    items: [
      "Motor Principal",
      "Sistema Hidráulico",
      "Transmisión",
      "Tren de Rodaje",
      "Sistema Eléctrico",
      "Frenos"
    ]
  },
  {
    key: "gestion",
    label: "GESTIÓN",
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600",
    items: [
      "Reporte Mensual",
      "KPIs Operativos",
      "Control Combustible",
      "Horómetros",
      "Productividad",
      "Costos"
    ]
  },
  {
    key: "riesgos",
    label: "RIESGOS",
    color: "from-rose-500 to-red-600",
    bgLight: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-600",
    items: [
      "Matriz de Riesgos",
      "Plan Contingencia",
      "Evaluación Crítica",
      "Medidas Control",
      "Seguimiento",
      "Alertas"
    ]
  }
];

// Generar datos aleatorios para la matriz
const generateMatrixData = () => {
  const data: Record<string, Record<string, Record<string, { value: string; status: "ok" | "warning" | "alert" }>>> = {};
  
  projects.forEach(project => {
    data[project] = {};
    categories.forEach(category => {
      data[project][category.key] = {};
      category.items.forEach((item, idx) => {
        const statuses: ("ok" | "warning" | "alert")[] = ["ok", "ok", "ok", "warning", "alert"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        data[project][category.key][item] = {
          value: String(idx + 1),
          status: randomStatus
        };
      });
    });
  });
  
  return data;
};

const matrixData = generateMatrixData();

const statusColors = {
  ok: "bg-emerald-500/20 text-emerald-700 border-emerald-500/40",
  warning: "bg-amber-500/20 text-amber-700 border-amber-500/40",
  alert: "bg-rose-500/20 text-rose-700 border-rose-500/40"
};

interface CategoryRowProps {
  category: typeof categories[0];
  isExpanded: boolean;
  onToggle: () => void;
}

const CategoryRow = ({ category, isExpanded, onToggle }: CategoryRowProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      {/* Category Header Row */}
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          "grid transition-all duration-300 hover:scale-[1.01]",
          "border-b border-border/50"
        )} style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}>
          {/* Category Label */}
          <div className={cn(
            "flex items-center gap-3 p-4 font-bold text-sm tracking-wider",
            "bg-gradient-to-r", category.color,
            "text-white rounded-l-lg"
          )}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {category.label}
          </div>
          
          {/* Project Summary Cells */}
          {projects.map((project) => (
            <div
              key={project}
              className={cn(
                "flex items-center justify-center p-4",
                category.bgLight,
                "border-l border-border/30",
                "transition-all duration-200 hover:brightness-95"
              )}
            >
              <span className={cn("font-bold text-lg", category.text)}>
                {category.items.length}
              </span>
              <span className="text-muted-foreground text-xs ml-1">items</span>
            </div>
          ))}
        </div>
      </CollapsibleTrigger>

      {/* Expanded Items */}
      <CollapsibleContent>
        <div className="animate-fade-in">
          {category.items.map((item, idx) => (
            <div
              key={item}
              className={cn(
                "grid border-b border-border/30 transition-all duration-200",
                "hover:bg-muted/30"
              )}
              style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}
            >
              {/* Item Label */}
              <div className={cn(
                "flex items-center gap-3 p-3 pl-8 text-sm",
                category.bgLight,
                "border-l-4",
                category.border
              )}>
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  "bg-gradient-to-r", category.color, "text-white"
                )}>
                  {idx + 1}
                </span>
                <span className="font-medium text-foreground truncate">{item}</span>
              </div>
              
              {/* Project Cells */}
              {projects.map((project) => {
                const cellData = matrixData[project][category.key][item];
                return (
                  <div
                    key={project}
                    className={cn(
                      "flex items-center justify-center p-3",
                      "border-l border-border/20",
                      "transition-all duration-200 hover:scale-105 cursor-pointer"
                    )}
                  >
                    <span className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border",
                      statusColors[cellData.status],
                      "shadow-sm hover:shadow-md transition-shadow"
                    )}>
                      {cellData.value}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const GerenciaReporte = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    seguridad: true,
    disponibilidad: false,
    gestion: false,
    riesgos: false
  });

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const expandAll = () => {
    setExpandedCategories({
      seguridad: true,
      disponibilidad: true,
      gestion: true,
      riesgos: true
    });
  };

  const collapseAll = () => {
    setExpandedCategories({
      seguridad: false,
      disponibilidad: false,
      gestion: false,
      riesgos: false
    });
  };

  return (
    <main className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Matriz de Reportes por Proyecto
          </h1>
        </div>
        <p className="text-muted-foreground ml-14">
          Resumen consolidado de documentos y reportes por categoría
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[200px] bg-card/50 backdrop-blur-sm border-border/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 text-sm font-medium hover:bg-card transition-colors">
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            Expandir Todo
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Colapsar Todo
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
        <span className="text-sm font-medium text-muted-foreground">Estado:</span>
        <div className="flex items-center gap-2">
          <span className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border", statusColors.ok)}>1</span>
          <span className="text-sm text-muted-foreground">Completado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border", statusColors.warning)}>2</span>
          <span className="text-sm text-muted-foreground">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border", statusColors.alert)}>3</span>
          <span className="text-sm text-muted-foreground">Alerta</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-elevated">
        {/* Header Row */}
        <div
          className="grid bg-gradient-to-r from-sidebar-background to-sidebar-accent"
          style={{ gridTemplateColumns: `200px repeat(${projects.length}, 1fr)` }}
        >
          <div className="p-4 font-bold text-sidebar-foreground border-r border-sidebar-border/50">
            Categoría / Proyecto
          </div>
          {projects.map((project, idx) => (
            <div
              key={project}
              className={cn(
                "p-4 font-bold text-center text-sidebar-foreground",
                "border-r border-sidebar-border/50 last:border-r-0",
                "hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
              )}
            >
              <span className="text-sm">{project}</span>
            </div>
          ))}
        </div>

        {/* Category Rows */}
        <div className="divide-y divide-border/30">
          {categories.map((category) => (
            <CategoryRow
              key={category.key}
              category={category}
              isExpanded={expandedCategories[category.key]}
              onToggle={() => toggleCategory(category.key)}
            />
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {categories.map((category) => (
          <div
            key={category.key}
            className={cn(
              "p-4 rounded-xl border",
              category.bgLight,
              category.border,
              "transition-all duration-200 hover:scale-[1.02]"
            )}
          >
            <div className={cn("text-2xl font-bold", category.text)}>
              {category.items.length * projects.length}
            </div>
            <div className="text-sm text-muted-foreground">{category.label}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {projects.length} proyectos
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default GerenciaReporte;
