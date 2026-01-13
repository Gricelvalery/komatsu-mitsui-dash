import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search, Filter, ExternalLink, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Proyectos principales
const projects = ["Antamina", "Bayovar", "Antapaccay", "Las Bambas", "Quellaveco", "Cerro Verde"];

// Equipos para cada sub-categoría
const equipos = ["980 E-5", "980 E-4", "980 E-3", "980 E-2", "980 E-1"];

// Estructura de categorías con sub-categorías
interface SubCategory {
  name: string;
  minKpi: number; // Umbral mínimo para el KPI
  unit: string;
}

interface CategoryConfig {
  key: string;
  label: string;
  color: string;
  bgLight: string;
  border: string;
  text: string;
  subCategories: SubCategory[];
}

const categoriesConfig: CategoryConfig[] = [
  {
    key: "seguridad",
    label: "SEGURIDAD",
    color: "from-[#003366] to-[#004d99]",
    bgLight: "bg-[#003366]/5",
    border: "border-[#003366]/30",
    text: "text-[#003366]",
    subCategories: [
      { name: "Índice de Frecuencia", minKpi: 0.5, unit: "" },
      { name: "Índice de Severidad", minKpi: 10, unit: "" },
      { name: "Cumplimiento Capacitación", minKpi: 95, unit: "%" },
      { name: "Inspecciones Realizadas", minKpi: 90, unit: "%" },
    ]
  },
  {
    key: "disponibilidad",
    label: "DISPONIBILIDAD",
    color: "from-[#004d99] to-[#0066cc]",
    bgLight: "bg-[#004d99]/5",
    border: "border-[#004d99]/30",
    text: "text-[#004d99]",
    subCategories: [
      { name: "Disponibilidad Física", minKpi: 92, unit: "%" },
      { name: "MTTR", minKpi: 4, unit: "hrs" },
      { name: "MTBF", minKpi: 150, unit: "hrs" },
      { name: "Utilización", minKpi: 85, unit: "%" },
    ]
  },
  {
    key: "gestion",
    label: "GESTIÓN",
    color: "from-[#4a5568] to-[#718096]",
    bgLight: "bg-[#4a5568]/5",
    border: "border-[#4a5568]/30",
    text: "text-[#4a5568]",
    subCategories: [
      { name: "Cumplimiento PM", minKpi: 95, unit: "%" },
      { name: "Backlog", minKpi: 30, unit: "días" },
      { name: "OEE", minKpi: 80, unit: "%" },
      { name: "Costo por Hora", minKpi: 150, unit: "USD" },
    ]
  },
  {
    key: "riesgos",
    label: "RIESGOS",
    color: "from-[#2d3748] to-[#4a5568]",
    bgLight: "bg-[#2d3748]/5",
    border: "border-[#2d3748]/30",
    text: "text-[#2d3748]",
    subCategories: [
      { name: "Riesgos Críticos", minKpi: 0, unit: "" },
      { name: "Acciones Pendientes", minKpi: 5, unit: "" },
      { name: "Cumplimiento Controles", minKpi: 95, unit: "%" },
      { name: "Incidentes Mes", minKpi: 0, unit: "" },
    ]
  }
];

// Tipos para los datos
type KpiStatus = "ok" | "warning" | "alert";

interface EquipoData {
  value: number;
  status: KpiStatus;
  summary: string;
  fileUrl: string;
}

interface SubCategoryData {
  [equipo: string]: EquipoData;
}

interface CategoryData {
  [subCategory: string]: SubCategoryData;
}

interface ProjectData {
  [category: string]: CategoryData;
}

interface MatrixData {
  [project: string]: ProjectData;
}

// Función para determinar el estado basado en KPI
const getKpiStatus = (value: number, minKpi: number, isLowerBetter: boolean = false): KpiStatus => {
  if (isLowerBetter) {
    // Para métricas donde menor es mejor (MTTR, Backlog, Riesgos, Incidentes, Acciones Pendientes)
    if (value < minKpi) return "ok";
    if (value === minKpi) return "warning";
    return "alert";
  } else {
    // Para métricas donde mayor es mejor (Disponibilidad, MTBF, etc.)
    if (value > minKpi) return "ok";
    if (value === minKpi) return "warning";
    return "alert";
  }
};

// Métricas donde menor valor es mejor
const lowerIsBetterMetrics = ["MTTR", "Backlog", "Riesgos Críticos", "Acciones Pendientes", "Incidentes Mes", "Costo por Hora", "Índice de Frecuencia", "Índice de Severidad"];

// Generar datos simulados
const generateMatrixData = (): MatrixData => {
  const data: MatrixData = {};
  
  projects.forEach((project, projectIdx) => {
    data[project] = {};
    
    categoriesConfig.forEach((category) => {
      data[project][category.key] = {};
      
      category.subCategories.forEach((subCat, subIdx) => {
        data[project][category.key][subCat.name] = {};
        
        equipos.forEach((equipo, equipoIdx) => {
          // Generar valor aleatorio basado en el tipo de métrica
          let value: number;
          const isLowerBetter = lowerIsBetterMetrics.includes(subCat.name);
          const baseVariation = (projectIdx + subIdx + equipoIdx) % 5;
          
          if (subCat.name === "Disponibilidad Física") {
            value = 88 + baseVariation * 2; // 88-96%
          } else if (subCat.name === "MTTR") {
            value = 2.5 + baseVariation * 0.8; // 2.5-5.7 hrs
          } else if (subCat.name === "MTBF") {
            value = 120 + baseVariation * 20; // 120-200 hrs
          } else if (subCat.name === "Utilización") {
            value = 80 + baseVariation * 3; // 80-92%
          } else if (subCat.name === "Cumplimiento PM") {
            value = 90 + baseVariation * 2; // 90-98%
          } else if (subCat.name === "Backlog") {
            value = 20 + baseVariation * 5; // 20-40 días
          } else if (subCat.name === "OEE") {
            value = 75 + baseVariation * 4; // 75-91%
          } else if (subCat.name === "Costo por Hora") {
            value = 120 + baseVariation * 15; // 120-180 USD
          } else if (subCat.name === "Riesgos Críticos") {
            value = baseVariation % 3; // 0-2
          } else if (subCat.name === "Acciones Pendientes") {
            value = baseVariation * 2; // 0-8
          } else if (subCat.name === "Cumplimiento Controles") {
            value = 90 + baseVariation * 2; // 90-98%
          } else if (subCat.name === "Incidentes Mes") {
            value = baseVariation % 2; // 0-1
          } else if (subCat.name === "Índice de Frecuencia") {
            value = baseVariation * 0.3; // 0-1.2
          } else if (subCat.name === "Índice de Severidad") {
            value = baseVariation * 5; // 0-20
          } else if (subCat.name === "Cumplimiento Capacitación") {
            value = 90 + baseVariation * 2; // 90-98%
          } else if (subCat.name === "Inspecciones Realizadas") {
            value = 85 + baseVariation * 3; // 85-97%
          } else {
            value = 80 + baseVariation * 4;
          }
          
          const status = getKpiStatus(value, subCat.minKpi, isLowerBetter);
          
          // Generar resumen descriptivo
          let summary = "";
          if (status === "ok") {
            summary = `${subCat.name}: ${value}${subCat.unit}. Óptimo, supera objetivo de ${subCat.minKpi}${subCat.unit}.`;
          } else if (status === "warning") {
            summary = `${subCat.name}: ${value}${subCat.unit}. En el límite del objetivo mínimo.`;
          } else {
            summary = `${subCat.name}: ${value}${subCat.unit}. Alerta: por debajo del objetivo de ${subCat.minKpi}${subCat.unit}.`;
          }
          
          data[project][category.key][subCat.name][equipo] = {
            value: Math.round(value * 10) / 10,
            status,
            summary,
            fileUrl: `https://sharepoint.example.com/${project}/${category.key}/${subCat.name.replace(/ /g, "_")}/${equipo.replace(/ /g, "_")}.pdf`
          };
        });
      });
    });
  });
  
  return data;
};

const matrixData = generateMatrixData();

const statusStyles = {
  ok: {
    bg: "bg-emerald-100 hover:bg-emerald-200",
    border: "border-emerald-300",
    text: "text-emerald-800",
    dot: "bg-emerald-500"
  },
  warning: {
    bg: "bg-amber-100 hover:bg-amber-200",
    border: "border-amber-300",
    text: "text-amber-800",
    dot: "bg-amber-500"
  },
  alert: {
    bg: "bg-rose-100 hover:bg-rose-200",
    border: "border-rose-300",
    text: "text-rose-800",
    dot: "bg-rose-500"
  }
};

// Componente para la fila de equipo (nivel más bajo)
interface EquipoRowProps {
  equipo: string;
  category: CategoryConfig;
  subCategoryName: string;
}

const EquipoRow = ({ equipo, category, subCategoryName }: EquipoRowProps) => {
  return (
    <TooltipProvider>
      <div
        className="grid border-b border-[#003366]/10 bg-gradient-to-r from-slate-50/80 to-white hover:from-slate-100/80 hover:to-slate-50/50 transition-all duration-200"
        style={{ gridTemplateColumns: `180px repeat(${projects.length}, 1fr)` }}
      >
        {/* Equipo Label */}
        <div className={cn(
          "flex items-center gap-3 p-3 pl-16 text-xs",
          "bg-gradient-to-r from-[#003366]/5 to-transparent",
          "border-l-4 border-[#003366]/20"
        )}>
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#003366] to-[#004d99] flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">{equipo.split(' ')[1]}</span>
          </div>
          <span className="font-semibold text-[#003366]">{equipo}</span>
        </div>
        
        {/* KPI Cells */}
        {projects.map((project) => {
          const equipoData = matrixData[project][category.key][subCategoryName][equipo];
          const styles = statusStyles[equipoData.status];
          
          return (
            <div
              key={project}
              className="p-2 border-l border-[#003366]/5"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "p-3 rounded-xl border-2 h-full cursor-pointer",
                    styles.bg,
                    styles.border,
                    "transition-all duration-300 group relative flex items-center justify-between",
                    "hover:shadow-md hover:scale-[1.02]"
                  )}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full flex-shrink-0 shadow-sm",
                        styles.dot
                      )} />
                      <span className={cn("text-sm font-bold", styles.text)}>
                        {equipoData.value}
                      </span>
                    </div>
                    
                    {/* File Link */}
                    <a
                      href={equipoData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "p-1.5 rounded-lg",
                        "bg-white/80 hover:bg-[#003366] shadow-sm",
                        "opacity-0 group-hover:opacity-100 transition-all duration-200",
                        "text-[#003366] hover:text-white"
                      )}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-[#003366] text-white border-[#004d99]">
                  <p className="text-xs">{equipoData.summary}</p>
                  <p className="text-xs text-blue-200 mt-1">Click en ↗ para ver documento</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

// Componente para la sub-categoría (segundo nivel)
interface SubCategoryRowProps {
  subCategory: SubCategory;
  category: CategoryConfig;
  isExpanded: boolean;
  onToggle: () => void;
}

const SubCategoryRow = ({ subCategory, category, isExpanded, onToggle }: SubCategoryRowProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div
          className={cn(
            "grid border-b border-[#003366]/10 transition-all duration-300",
            isExpanded 
              ? "bg-gradient-to-r from-[#003366]/10 to-[#004d99]/5" 
              : "bg-gradient-to-r from-slate-50 to-white hover:from-[#003366]/5 hover:to-slate-50"
          )}
          style={{ gridTemplateColumns: `180px repeat(${projects.length}, 1fr)` }}
        >
          {/* SubCategory Label */}
          <div className={cn(
            "flex items-center gap-3 p-4 pl-6 text-sm",
            "border-l-4",
            isExpanded ? "border-[#003366]" : "border-[#003366]/30"
          )}>
            <div className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
              isExpanded 
                ? "bg-[#003366] text-white shadow-md" 
                : "bg-[#003366]/10 text-[#003366]"
            )}>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className={cn(
                "font-semibold text-sm transition-colors",
                isExpanded ? "text-[#003366]" : "text-foreground"
              )}>
                {subCategory.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Objetivo mín: {subCategory.minKpi}{subCategory.unit}
              </span>
            </div>
          </div>
          
          {/* Summary cells per project */}
          {projects.map((project) => {
            const subCatData = matrixData[project][category.key][subCategory.name];
            const equipoValues = Object.values(subCatData);
            const okCount = equipoValues.filter(e => e.status === "ok").length;
            const warningCount = equipoValues.filter(e => e.status === "warning").length;
            const alertCount = equipoValues.filter(e => e.status === "alert").length;
            
            return (
              <div
                key={project}
                className="flex items-center justify-center gap-3 p-3 border-l border-[#003366]/10"
              >
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100/80">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-xs font-bold text-emerald-700">{okCount}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100/80">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                  <span className="text-xs font-bold text-amber-700">{warningCount}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-rose-100/80">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                  <span className="text-xs font-bold text-rose-700">{alertCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="animate-fade-in bg-gradient-to-b from-slate-50/50 to-white">
          {equipos.map((equipo) => (
            <EquipoRow
              key={equipo}
              equipo={equipo}
              category={category}
              subCategoryName={subCategory.name}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Componente para la categoría principal (primer nivel)
interface CategoryRowProps {
  category: CategoryConfig;
  isExpanded: boolean;
  onToggle: () => void;
  expandedSubCategories: Record<string, boolean>;
  onToggleSubCategory: (subCatName: string) => void;
}

const CategoryRow = ({ 
  category, 
  isExpanded, 
  onToggle, 
  expandedSubCategories,
  onToggleSubCategory 
}: CategoryRowProps) => {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      {/* Category Header Row */}
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          "grid transition-all duration-300 hover:scale-[1.002]",
          "border-b border-border/50"
        )} style={{ gridTemplateColumns: `180px repeat(${projects.length}, 1fr)` }}>
          {/* Category Label */}
          <div className={cn(
            "flex items-center gap-3 p-4 font-bold text-sm tracking-wider",
            "bg-gradient-to-r", category.color,
            "text-white"
          )}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {category.label}
          </div>
          
          {/* Project Summary Cells */}
          {projects.map((project) => {
            let okTotal = 0, warningTotal = 0, alertTotal = 0;
            
            category.subCategories.forEach(subCat => {
              const subCatData = matrixData[project][category.key][subCat.name];
              Object.values(subCatData).forEach(equipo => {
                if (equipo.status === "ok") okTotal++;
                else if (equipo.status === "warning") warningTotal++;
                else alertTotal++;
              });
            });
            
            return (
              <div
                key={project}
                className={cn(
                  "flex items-center justify-center gap-3 p-4",
                  category.bgLight,
                  "border-l border-border/30"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-emerald-700">{okTotal}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-sm font-bold text-amber-700">{warningTotal}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-sm font-bold text-rose-700">{alertTotal}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleTrigger>

      {/* Expanded SubCategories */}
      <CollapsibleContent>
        <div className="animate-fade-in">
          {category.subCategories.map((subCat) => (
            <SubCategoryRow
              key={subCat.name}
              subCategory={subCat}
              category={category}
              isExpanded={expandedSubCategories[`${category.key}-${subCat.name}`] || false}
              onToggle={() => onToggleSubCategory(`${category.key}-${subCat.name}`)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const GerenciaReporte = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    seguridad: false,
    disponibilidad: true,
    gestion: false,
    riesgos: false
  });
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSubCategory = (key: string) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const expandAll = () => {
    const allCategories: Record<string, boolean> = {};
    const allSubCategories: Record<string, boolean> = {};
    
    categoriesConfig.forEach(cat => {
      allCategories[cat.key] = true;
      cat.subCategories.forEach(subCat => {
        allSubCategories[`${cat.key}-${subCat.name}`] = true;
      });
    });
    
    setExpandedCategories(allCategories);
    setExpandedSubCategories(allSubCategories);
  };

  const collapseAll = () => {
    const allCategories: Record<string, boolean> = {};
    categoriesConfig.forEach(cat => {
      allCategories[cat.key] = false;
    });
    setExpandedCategories(allCategories);
    setExpandedSubCategories({});
  };

  return (
    <main className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Matriz de Reportes por Proyecto
          </h1>
        </div>
        <p className="text-muted-foreground ml-14">
          KPIs por equipo con indicadores de rendimiento vs objetivo mínimo
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
      <div className="flex flex-wrap items-center gap-6 mb-6 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
        <span className="text-sm font-medium text-muted-foreground">Estado KPI:</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground">Supera objetivo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-muted-foreground">En el límite</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-sm text-muted-foreground">Por debajo del objetivo</span>
        </div>
        <div className="h-4 w-px bg-border mx-2" />
        <div className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Ver documento</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-elevated">
        {/* Header Row */}
        <div
          className="grid bg-gradient-to-r from-sidebar-background to-sidebar-accent"
          style={{ gridTemplateColumns: `180px repeat(${projects.length}, 1fr)` }}
        >
          <div className="p-4 font-bold text-sidebar-foreground text-sm border-r border-sidebar-border/50">
            Categoría / Equipo
          </div>
          {projects.map((project) => (
            <div
              key={project}
              className={cn(
                "p-4 font-bold text-center text-sidebar-foreground text-sm",
                "border-r border-sidebar-border/50 last:border-r-0"
              )}
            >
              {project}
            </div>
          ))}
        </div>

        {/* Category Rows */}
        <div className="divide-y divide-border/30">
          {categoriesConfig.map((category) => (
            <CategoryRow
              key={category.key}
              category={category}
              isExpanded={expandedCategories[category.key]}
              onToggle={() => toggleCategory(category.key)}
              expandedSubCategories={expandedSubCategories}
              onToggleSubCategory={toggleSubCategory}
            />
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {categoriesConfig.map((category) => {
          let okCount = 0, warningCount = 0, alertCount = 0;
          projects.forEach(project => {
            category.subCategories.forEach(subCat => {
              Object.values(matrixData[project][category.key][subCat.name]).forEach(equipo => {
                if (equipo.status === "ok") okCount++;
                else if (equipo.status === "warning") warningCount++;
                else alertCount++;
              });
            });
          });
          
          return (
            <div
              key={category.key}
              className={cn(
                "p-4 rounded-xl border",
                category.bgLight,
                category.border
              )}
            >
              <div className={cn("text-lg font-bold mb-1", category.text)}>
                {category.label}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {okCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {warningCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {alertCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default GerenciaReporte;
