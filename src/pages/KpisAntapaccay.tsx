import { useState } from "react";
import { BarChart3, ChevronDown, ChevronRight, Factory, TrendingUp, Settings, Shield, Truck, Package, Wrench, Zap, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// Opción 1: Botones con Glassmorphism y Iconos
const DashboardButtonsOption1 = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "ANTAPACCAY", label: "ANTAPACCAY" },
    { id: "GU14ONE", label: "GU14ONE" },
  ];

  const rTabs = [
    { id: "R112", label: "R112 - Extracción Mineral Primario" },
    { id: "R113", label: "R113 - Transporte de Material" },
    { id: "R114", label: "R114 - Procesamiento y Trituración" },
    { id: "R115", label: "R115 - Control de Calidad" },
    { id: "R116", label: "R116 - Gestión de Inventarios" },
    { id: "R117", label: "R117 - Mantenimiento Preventivo" },
    { id: "R118", label: "R118 - Seguridad y Medio Ambiente" },
    { id: "R119", label: "R119 - Logística y Distribución" },
    { id: "R120", label: "R120 - Recursos Humanos" },
    { id: "R121", label: "R121 - Análisis Financiero" },
    { id: "R122", label: "R122 - Producción General" },
    { id: "R123", label: "R123 - Eficiencia Operativa" },
    { id: "R124", label: "R124 - Costos Operacionales" },
    { id: "R125", label: "R125 - Indicadores de Rendimiento" },
    { id: "R126", label: "R126 - Consumo Energético" },
    { id: "R127", label: "R127 - Gestión de Residuos" },
    { id: "R128", label: "R128 - Planificación Estratégica" },
    { id: "R129", label: "R129 - Cumplimiento Normativo" },
    { id: "R130", label: "R130 - Innovación y Mejora" },
    { id: "R131", label: "R131 - Reportes Ejecutivos" },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs principales con glassmorphism */}
      <div className="flex gap-4 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              group relative px-8 py-4 rounded-xl backdrop-blur-xl border-2 transition-all duration-500
              ${activeTab === tab.id 
                ? 'bg-primary/20 border-primary shadow-elevated scale-105' 
                : 'bg-white/10 dark:bg-white/5 border-white/20 hover:border-primary/50 hover:scale-105'
              }
            `}
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl" />
            <div className="relative flex items-center gap-3">
              <BarChart3 className={`h-5 w-5 transition-transform duration-300 ${activeTab === tab.id ? 'text-primary scale-110' : 'text-foreground group-hover:scale-110'}`} />
              <span className={`text-lg font-semibold ${activeTab === tab.id ? 'text-primary' : 'text-foreground'}`}>
                {tab.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* R Tabs en grid responsive */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {rTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-4 py-3 rounded-lg backdrop-blur-md border transition-all duration-300
              ${activeTab === tab.id 
                ? 'bg-primary text-primary-foreground border-primary shadow-industrial' 
                : 'bg-background/50 border-border hover:border-primary/50 hover:bg-primary/10'
              }
            `}
          >
            <span className="text-xs font-medium line-clamp-2 text-left">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Opción 2: Botones con Tabs Segmentados Modernos
const DashboardButtonsOption2 = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "ANTAPACCAY", label: "ANTAPACCAY" },
    { id: "GU14ONE", label: "GU14ONE" },
  ];

  const rTabs = [
    { id: "R112", label: "R112 - Extracción Mineral Primario" },
    { id: "R113", label: "R113 - Transporte de Material" },
    { id: "R114", label: "R114 - Procesamiento y Trituración" },
    { id: "R115", label: "R115 - Control de Calidad" },
    { id: "R116", label: "R116 - Gestión de Inventarios" },
    { id: "R117", label: "R117 - Mantenimiento Preventivo" },
    { id: "R118", label: "R118 - Seguridad y Medio Ambiente" },
    { id: "R119", label: "R119 - Logística y Distribución" },
    { id: "R120", label: "R120 - Recursos Humanos" },
    { id: "R121", label: "R121 - Análisis Financiero" },
    { id: "R122", label: "R122 - Producción General" },
    { id: "R123", label: "R123 - Eficiencia Operativa" },
    { id: "R124", label: "R124 - Costos Operacionales" },
    { id: "R125", label: "R125 - Indicadores de Rendimiento" },
    { id: "R126", label: "R126 - Consumo Energético" },
    { id: "R127", label: "R127 - Gestión de Residuos" },
    { id: "R128", label: "R128 - Planificación Estratégica" },
    { id: "R129", label: "R129 - Cumplimiento Normativo" },
    { id: "R130", label: "R130 - Innovación y Mejora" },
    { id: "R131", label: "R131 - Reportes Ejecutivos" },
  ];

  return (
    <div className="space-y-6">
      {/* Segmented control principal */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-muted/50 backdrop-blur-sm border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-foreground hover:text-primary'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-lg" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid compacto con scroll */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {rTabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{ animationDelay: `${index * 30}ms` }}
              className={`
                group relative px-3 py-2.5 rounded-lg font-medium text-xs
                transition-all duration-300 animate-fade-in
                ${activeTab === tab.id 
                  ? 'bg-gradient-primary text-primary-foreground shadow-elevated' 
                  : 'bg-card border border-border hover:border-primary hover:shadow-industrial hover:scale-[1.02]'
                }
              `}
            >
              <span className="relative z-10 line-clamp-2 text-left">{tab.label}</span>
              {activeTab !== tab.id && (
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Opción 3: Sidebar con Categorías Expandibles
const DashboardButtonsOption3 = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "ANTAPACCAY", label: "ANTAPACCAY" },
    { id: "GU14ONE", label: "GU14ONE" },
  ];

  const categories = [
    {
      id: "operaciones",
      label: "Operaciones Mineras",
      icon: Factory,
      items: [
        { id: "R112", label: "Extracción Mineral Primario" },
        { id: "R113", label: "Transporte de Material" },
        { id: "R114", label: "Procesamiento y Trituración" },
      ]
    },
    {
      id: "control",
      label: "Control y Calidad",
      icon: Shield,
      items: [
        { id: "R115", label: "Control de Calidad" },
        { id: "R116", label: "Gestión de Inventarios" },
        { id: "R125", label: "Indicadores de Rendimiento" },
      ]
    },
    {
      id: "logistica",
      label: "Logística y Mantenimiento",
      icon: Truck,
      items: [
        { id: "R117", label: "Mantenimiento Preventivo" },
        { id: "R119", label: "Logística y Distribución" },
      ]
    },
    {
      id: "seguridad",
      label: "Seguridad y Ambiente",
      icon: Settings,
      items: [
        { id: "R118", label: "Seguridad y Medio Ambiente" },
        { id: "R127", label: "Gestión de Residuos" },
        { id: "R129", label: "Cumplimiento Normativo" },
      ]
    },
    {
      id: "gestion",
      label: "Gestión Empresarial",
      icon: TrendingUp,
      items: [
        { id: "R120", label: "Recursos Humanos" },
        { id: "R121", label: "Análisis Financiero" },
        { id: "R124", label: "Costos Operacionales" },
      ]
    },
    {
      id: "produccion",
      label: "Producción y Eficiencia",
      icon: Zap,
      items: [
        { id: "R122", label: "Producción General" },
        { id: "R123", label: "Eficiencia Operativa" },
        { id: "R126", label: "Consumo Energético" },
      ]
    },
    {
      id: "estrategia",
      label: "Estrategia y Reportes",
      icon: FileText,
      items: [
        { id: "R128", label: "Planificación Estratégica" },
        { id: "R130", label: "Innovación y Mejora" },
        { id: "R131", label: "Reportes Ejecutivos" },
      ]
    }
  ];

  const [expandedCategories, setExpandedCategories] = useState<string[]>(["operaciones"]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const powerBiUrls: Record<string, string> = {
    ANTAPACCAY: "https://app.powerbi.com/view?r=ANTAPACCAY_EXAMPLE",
    GU14ONE: "https://app.powerbi.com/view?r=GU14ONE_EXAMPLE",
    R112: "https://app.powerbi.com/view?r=R112_EXAMPLE",
    R113: "https://app.powerbi.com/view?r=R113_EXAMPLE",
    R114: "https://app.powerbi.com/view?r=R114_EXAMPLE",
    R115: "https://app.powerbi.com/view?r=R115_EXAMPLE",
    R116: "https://app.powerbi.com/view?r=R116_EXAMPLE",
    R117: "https://app.powerbi.com/view?r=R117_EXAMPLE",
    R118: "https://app.powerbi.com/view?r=R118_EXAMPLE",
    R119: "https://app.powerbi.com/view?r=R119_EXAMPLE",
    R120: "https://app.powerbi.com/view?r=R120_EXAMPLE",
    R121: "https://app.powerbi.com/view?r=R121_EXAMPLE",
    R122: "https://app.powerbi.com/view?r=R122_EXAMPLE",
    R123: "https://app.powerbi.com/view?r=R123_EXAMPLE",
    R124: "https://app.powerbi.com/view?r=R124_EXAMPLE",
    R125: "https://app.powerbi.com/view?r=R125_EXAMPLE",
    R126: "https://app.powerbi.com/view?r=R126_EXAMPLE",
    R127: "https://app.powerbi.com/view?r=R127_EXAMPLE",
    R128: "https://app.powerbi.com/view?r=R128_EXAMPLE",
    R129: "https://app.powerbi.com/view?r=R129_EXAMPLE",
    R130: "https://app.powerbi.com/view?r=R130_EXAMPLE",
    R131: "https://app.powerbi.com/view?r=R131_EXAMPLE",
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Dashboards</h2>
          
          {/* Main tabs */}
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-background/50 hover:bg-muted text-foreground"
                )}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const Icon = category.icon;
            
            return (
              <div key={category.id} className="space-y-1">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-3 py-2 rounded-lg flex items-center justify-between gap-2 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-foreground">{category.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="ml-6 space-y-1 animate-fade-in">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                          "w-full px-3 py-2 rounded-md text-left text-sm transition-all duration-200",
                          activeTab === item.id
                            ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-6">
          <h1 className="text-3xl font-bold text-foreground">
            KPIs Antapaccay
          </h1>
          <p className="text-muted-foreground mt-1">
            Dashboard: {activeTab}
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="bg-card rounded-2xl shadow-elevated overflow-hidden animate-fade-in h-full">
            <div className="h-full bg-muted/20 flex items-center justify-center">
              {/* Power BI Embed iframe */}
              <div className="text-center space-y-4">
                <BarChart3 className="h-16 w-16 text-primary mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Dashboard: {activeTab}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Aquí se mostrará el dashboard de Power BI embebido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KpisAntapaccay = () => {
  const [activeTab, setActiveTab] = useState("ANTAPACCAY");
  const [viewOption, setViewOption] = useState<1 | 2 | 3>(1);

  // URLs de ejemplo para Power BI embeds
  const powerBiUrls: Record<string, string> = {
    ANTAPACCAY: "https://app.powerbi.com/view?r=ANTAPACCAY_EXAMPLE",
    GU14ONE: "https://app.powerbi.com/view?r=GU14ONE_EXAMPLE",
    R112: "https://app.powerbi.com/view?r=R112_EXAMPLE",
    R113: "https://app.powerbi.com/view?r=R113_EXAMPLE",
    R114: "https://app.powerbi.com/view?r=R114_EXAMPLE",
    R115: "https://app.powerbi.com/view?r=R115_EXAMPLE",
    R116: "https://app.powerbi.com/view?r=R116_EXAMPLE",
    R117: "https://app.powerbi.com/view?r=R117_EXAMPLE",
    R118: "https://app.powerbi.com/view?r=R118_EXAMPLE",
    R119: "https://app.powerbi.com/view?r=R119_EXAMPLE",
    R120: "https://app.powerbi.com/view?r=R120_EXAMPLE",
    R121: "https://app.powerbi.com/view?r=R121_EXAMPLE",
    R122: "https://app.powerbi.com/view?r=R122_EXAMPLE",
    R123: "https://app.powerbi.com/view?r=R123_EXAMPLE",
    R124: "https://app.powerbi.com/view?r=R124_EXAMPLE",
    R125: "https://app.powerbi.com/view?r=R125_EXAMPLE",
    R126: "https://app.powerbi.com/view?r=R126_EXAMPLE",
    R127: "https://app.powerbi.com/view?r=R127_EXAMPLE",
    R128: "https://app.powerbi.com/view?r=R128_EXAMPLE",
    R129: "https://app.powerbi.com/view?r=R129_EXAMPLE",
    R130: "https://app.powerbi.com/view?r=R130_EXAMPLE",
    R131: "https://app.powerbi.com/view?r=R131_EXAMPLE",
  };

  // Si es opción 3, usar el diseño completo con sidebar
  if (viewOption === (3 as 1 | 2 | 3)) {
    return <DashboardButtonsOption3 activeTab={activeTab} onTabChange={setActiveTab} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                KPIs Antapaccay
              </h1>
              <p className="text-muted-foreground">
                Dashboards de monitoreo y análisis
              </p>
            </div>
            
            {/* Selector de opciones */}
            <div className="flex gap-2 p-1 rounded-lg bg-muted/30">
              <button
                onClick={() => setViewOption(1)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewOption === 1 ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                }`}
              >
                Opción 1
              </button>
              <button
                onClick={() => setViewOption(2)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewOption === 2 ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                }`}
              >
                Opción 2
              </button>
              <button
                onClick={() => setViewOption(3 as 1 | 2 | 3)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewOption === 3 ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                }`}
              >
                Opción 3
              </button>
            </div>
          </div>

          {/* Botones de navegación */}
          {viewOption === 1 ? (
            <DashboardButtonsOption1 activeTab={activeTab} onTabChange={setActiveTab} />
          ) : (
            <DashboardButtonsOption2 activeTab={activeTab} onTabChange={setActiveTab} />
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-8">
        <div className="bg-card rounded-2xl shadow-elevated overflow-hidden animate-fade-in">
          <div className="aspect-video bg-muted/20 flex items-center justify-center">
            {/* Power BI Embed iframe */}
            <div className="text-center space-y-4">
              <BarChart3 className="h-16 w-16 text-primary mx-auto" />
              <div>
                <p className="text-lg font-semibold text-foreground mb-2">
                  Dashboard: {activeTab}
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Aquí se mostrará el dashboard de Power BI embebido.
                  <br />
                  URL: {powerBiUrls[activeTab]}
                </p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg inline-block">
                Reemplaza con: &lt;iframe src="{powerBiUrls[activeTab]}" /&gt;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
