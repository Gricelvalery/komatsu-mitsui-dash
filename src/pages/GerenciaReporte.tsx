import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search, Filter, Sparkles, ExternalLink, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Proyectos principales
const projects = ["Antamina", "Bayovar", "Antapaccay", "Las Bambas", "Quellaveco", "Cerro Verde"];

// Resúmenes de ejemplo por categoría e item
const summaryTemplates = {
  seguridad: {
    "Inspección EPP": [
      "98% cumplimiento EPP. 2 observaciones menores en cascos.",
      "Inspección completa. Guantes reemplazados en sector B.",
      "Sin observaciones. Todo el personal con EPP vigente.",
      "Alerta: 5 trabajadores sin lentes de seguridad.",
      "Auditoría OK. Capacitación pendiente área nueva.",
      "100% conformidad. Próxima revisión en 15 días."
    ],
    "Capacitación SST": [
      "45 trabajadores capacitados en manejo defensivo.",
      "Pendiente: 12 operadores sin curso de altura.",
      "Certificación completada para todo el equipo.",
      "Programa mensual al 85% de avance.",
      "Nueva capacitación IPERC programada.",
      "Refuerzo en protocolo de emergencias."
    ],
    "Auditoría Interna": [
      "Sin hallazgos críticos. 3 oportunidades de mejora.",
      "Cierre de 8 no conformidades del mes anterior.",
      "Pendiente revisión documentación área mantto.",
      "Auditoría satisfactoria. Próxima en Q2.",
      "2 hallazgos menores en registros.",
      "Certificación ISO renovada exitosamente."
    ],
    "Protocolo LOTO": [
      "100% dispositivos verificados y operativos.",
      "Capacitación LOTO a 25 nuevos trabajadores.",
      "Actualización procedimientos completada.",
      "3 candados reemplazados por desgaste.",
      "Simulacro exitoso con todo el personal.",
      "Inventario de dispositivos actualizado."
    ],
    "Check Pre-Operacional": [
      "Todos los equipos con check completo.",
      "2 equipos detenidos por observaciones.",
      "Formato digital implementado al 100%.",
      "Reducción 30% en tiempos de revisión.",
      "Alerta: falta firma supervisor en 5 checks.",
      "Proceso optimizado y documentado."
    ],
    "Matriz IPERC": [
      "Actualización trimestral completada.",
      "15 nuevos riesgos identificados y mitigados.",
      "Capacitación al personal en nuevos controles.",
      "Pendiente revisión trabajos en caliente.",
      "Matriz digitalizada y disponible en sistema.",
      "Controles operativos al 95% implementados."
    ]
  },
  disponibilidad: {
    "Motor Principal": [
      "Disponibilidad 94.5%. Mantto preventivo OK.",
      "Cambio aceite realizado. Próximo en 500 hrs.",
      "Alerta: vibración anormal detectada.",
      "Overhaul programado para próximo mes.",
      "Sin fallas reportadas este período.",
      "Rendimiento óptimo, sin observaciones."
    ],
    "Sistema Hidráulico": [
      "Presiones dentro de parámetros normales.",
      "Fuga menor corregida en cilindro boom.",
      "Cambio filtros completado según plan.",
      "Mangueras en buen estado, vida útil 70%.",
      "Alerta: temperatura elevada en bomba.",
      "Sistema operando al 100% capacidad."
    ],
    "Transmisión": [
      "Cambio aceite y filtro completado.",
      "Sin anomalías en caja de cambios.",
      "Embrague con desgaste normal.",
      "Próximo servicio en 1000 hrs.",
      "Convertidor operando correctamente.",
      "Alerta: ruido en marcha 3ra."
    ],
    "Tren de Rodaje": [
      "Desgaste cadenas al 45%, normal.",
      "Tensión ajustada según especificación.",
      "Rodillos sin juego excesivo.",
      "Sprockets con vida útil restante OK.",
      "Alerta: eslabón dañado, reparado.",
      "Inspección completa sin hallazgos."
    ],
    "Sistema Eléctrico": [
      "Baterías con carga óptima.",
      "Alternador funcionando correctamente.",
      "Cableado revisado sin deterioro.",
      "Luces operativas al 100%.",
      "Alerta: fusible quemado reemplazado.",
      "Sistema de arranque OK."
    ],
    "Frenos": [
      "Pastillas al 60% vida útil.",
      "Sistema retardador operativo.",
      "Freno de servicio calibrado.",
      "Sin fugas en circuito neumático.",
      "Alerta: ajuste requerido en eje trasero.",
      "Pruebas de frenado satisfactorias."
    ]
  },
  gestion: {
    "Reporte Mensual": [
      "Informe entregado. KPIs superados.",
      "Pendiente cierre de indicadores área C.",
      "Consolidado enviado a gerencia.",
      "Desviación 5% en costos, justificada.",
      "Cumplimiento 98% metas operativas.",
      "Dashboard actualizado y disponible."
    ],
    "KPIs Operativos": [
      "MTBF: 450 hrs. MTTR: 4.2 hrs.",
      "Disponibilidad física: 92.3%.",
      "Utilización: 78% vs 80% meta.",
      "Productividad sobre objetivo.",
      "Alerta: tendencia negativa en OEE.",
      "Todos los KPIs en zona verde."
    ],
    "Control Combustible": [
      "Consumo: 45 gal/hr. Dentro de rango.",
      "Reducción 8% vs mes anterior.",
      "Sin fugas detectadas en sistema.",
      "Alerta: consumo elevado equipo 05.",
      "Inventario actualizado diariamente.",
      "Eficiencia combustible mejorada."
    ],
    "Horómetros": [
      "Total acumulado: 12,450 hrs.",
      "Próximo service mayor: 500 hrs.",
      "Registro actualizado en sistema.",
      "Sin discrepancias reportadas.",
      "Calibración verificada OK.",
      "Alerta: equipo cerca de overhaul."
    ],
    "Productividad": [
      "Ton/hr: 285. Meta: 270. +5.5%",
      "Ciclos/turno: 45 promedio.",
      "Rendimiento sobre presupuesto.",
      "Alerta: baja productividad turno noche.",
      "Mejora continua en tiempos carguío.",
      "Record mensual alcanzado."
    ],
    "Costos": [
      "Costo/hr: $125. Presupuesto: $130.",
      "Ahorro 3.8% en repuestos.",
      "Alerta: sobrecosto en mano obra.",
      "Control gastos implementado.",
      "Proyección anual favorable.",
      "Sin desviaciones significativas."
    ]
  },
  riesgos: {
    "Matriz de Riesgos": [
      "15 riesgos altos, 8 medios, 22 bajos.",
      "Actualización mensual completada.",
      "2 riesgos nuevos identificados.",
      "Controles verificados al 90%.",
      "Capacitación al personal realizada.",
      "Sin riesgos críticos pendientes."
    ],
    "Plan Contingencia": [
      "Simulacro trimestral ejecutado.",
      "100% personal conoce protocolo.",
      "Equipos emergencia verificados.",
      "Actualización rutas evacuación.",
      "Alerta: kit primeros auxilios incompleto.",
      "Plan aprobado por gerencia."
    ],
    "Evaluación Crítica": [
      "Sin trabajos críticos pendientes.",
      "ATS completados para tareas riesgo.",
      "Supervisión reforzada en altura.",
      "Permisos de trabajo al día.",
      "Alerta: espacio confinado sin cert.",
      "Evaluaciones al 100% cumplimiento."
    ],
    "Medidas Control": [
      "85% controles implementados.",
      "Barreras duras instaladas.",
      "Señalización actualizada.",
      "EPP específico disponible.",
      "Alerta: control pendiente área X.",
      "Verificación semanal OK."
    ],
    "Seguimiento": [
      "12 acciones cerradas este mes.",
      "5 acciones en proceso.",
      "Sin vencimientos críticos.",
      "Reunión semanal de seguimiento.",
      "Dashboard riesgos actualizado.",
      "Alerta: 2 acciones vencidas."
    ],
    "Alertas": [
      "3 alertas activas nivel medio.",
      "Ninguna alerta crítica vigente.",
      "Sistema monitoreo operativo.",
      "Notificaciones automáticas OK.",
      "Escalamiento definido.",
      "Sin incidentes este período."
    ]
  }
};

// Categorías con sus items
const categories = [
  {
    key: "seguridad" as const,
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
    key: "disponibilidad" as const,
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
    key: "gestion" as const,
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
    key: "riesgos" as const,
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

type CategoryKey = "seguridad" | "disponibilidad" | "gestion" | "riesgos";

// Generar datos para la matriz
const generateMatrixData = () => {
  const data: Record<string, Record<CategoryKey, Record<string, { summary: string; status: "ok" | "warning" | "alert"; fileUrl: string }>>> = {};
  
  projects.forEach((project, projectIdx) => {
    data[project] = {} as Record<CategoryKey, Record<string, { summary: string; status: "ok" | "warning" | "alert"; fileUrl: string }>>;
    categories.forEach(category => {
      data[project][category.key] = {};
      const categoryTemplates = summaryTemplates[category.key] as Record<string, string[]>;
      
      category.items.forEach((item, idx) => {
        const summaries = categoryTemplates[item] || ["Sin información disponible"];
        const summaryIdx = (projectIdx + idx) % summaries.length;
        const summary = summaries[summaryIdx];
        
        // Determinar status basado en el contenido
        let status: "ok" | "warning" | "alert" = "ok";
        if (summary.toLowerCase().includes("alerta") || summary.toLowerCase().includes("crítico")) {
          status = "alert";
        } else if (summary.toLowerCase().includes("pendiente") || summary.toLowerCase().includes("observacion")) {
          status = "warning";
        }
        
        data[project][category.key][item] = {
          summary,
          status,
          fileUrl: `https://sharepoint.example.com/${project}/${category.key}/${item.replace(/ /g, "_")}.pdf`
        };
      });
    });
  });
  
  return data;
};

const matrixData = generateMatrixData();

const statusStyles = {
  ok: {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-200",
    dot: "bg-emerald-500"
  },
  warning: {
    bg: "bg-amber-50 hover:bg-amber-100",
    border: "border-amber-200",
    dot: "bg-amber-500"
  },
  alert: {
    bg: "bg-rose-50 hover:bg-rose-100",
    border: "border-rose-200",
    dot: "bg-rose-500"
  }
};

interface CategoryRowProps {
  category: typeof categories[0];
  isExpanded: boolean;
  onToggle: () => void;
}

const CategoryRow = ({ category, isExpanded, onToggle }: CategoryRowProps) => {
  return (
    <TooltipProvider>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        {/* Category Header Row */}
        <CollapsibleTrigger className="w-full">
          <div className={cn(
            "grid transition-all duration-300 hover:scale-[1.005]",
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
              const items = Object.values(matrixData[project][category.key]);
              const alerts = items.filter(i => i.status === "alert").length;
              const warnings = items.filter(i => i.status === "warning").length;
              const ok = items.filter(i => i.status === "ok").length;
              
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
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-emerald-700">{ok}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-medium text-amber-700">{warnings}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-medium text-rose-700">{alerts}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleTrigger>

        {/* Expanded Items */}
        <CollapsibleContent>
          <div className="animate-fade-in">
            {category.items.map((item, idx) => (
              <div
                key={item}
                className={cn(
                  "grid border-b border-border/30"
                )}
                style={{ gridTemplateColumns: `180px repeat(${projects.length}, 1fr)` }}
              >
                {/* Item Label */}
                <div className={cn(
                  "flex items-center gap-2 p-3 pl-6 text-sm",
                  category.bgLight,
                  "border-l-4",
                  category.border
                )}>
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                    "bg-gradient-to-r", category.color, "text-white"
                  )}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-foreground text-xs truncate">{item}</span>
                </div>
                
                {/* Project Cells with Summaries */}
                {projects.map((project) => {
                  const cellData = matrixData[project][category.key][item];
                  const styles = statusStyles[cellData.status];
                  
                  return (
                    <div
                      key={project}
                      className={cn(
                        "p-1.5 border-l border-border/20",
                        "transition-all duration-200"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-lg border min-h-[80px]",
                        styles.bg,
                        styles.border,
                        "transition-all duration-200 group relative"
                      )}>
                        <div className="flex items-start gap-2 pr-6">
                          <span className={cn("w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0", styles.dot)} />
                          <p className="text-sm text-foreground leading-snug">
                            {cellData.summary}
                          </p>
                        </div>
                        
                        {/* File Link */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={cellData.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={cn(
                                "absolute top-2 right-2 p-1.5 rounded-md",
                                "bg-white/90 hover:bg-white shadow-sm border border-border/50",
                                "opacity-60 hover:opacity-100 transition-opacity",
                                "text-muted-foreground hover:text-primary"
                              )}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Abrir documento en SharePoint</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
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
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Matriz de Reportes por Proyecto
          </h1>
        </div>
        <p className="text-muted-foreground ml-14">
          Resúmenes consolidados de documentos sincronizados desde SharePoint
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
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground">OK</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-muted-foreground">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-sm text-muted-foreground">Alerta</span>
        </div>
        <div className="h-4 w-px bg-border mx-2" />
        <div className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Hover para ver enlace al archivo</span>
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
            Categoría / Proyecto
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
        {categories.map((category) => {
          let okCount = 0, warningCount = 0, alertCount = 0;
          projects.forEach(project => {
            Object.values(matrixData[project][category.key]).forEach(item => {
              if (item.status === "ok") okCount++;
              else if (item.status === "warning") warningCount++;
              else alertCount++;
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
