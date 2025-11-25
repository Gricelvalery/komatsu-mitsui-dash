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

// Opción 4: Lista Vertical Compacta con Iconos y Badges
const DashboardButtonsOption4 = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "ANTAPACCAY", label: "ANTAPACCAY" },
    { id: "GU14ONE", label: "GU14ONE" },
  ];

  const rTabs = [
    { id: "R112", label: "R112 - Extracción Mineral Primario", icon: Factory },
    { id: "R113", label: "R113 - Transporte de Material", icon: Truck },
    { id: "R114", label: "R114 - Procesamiento y Trituración", icon: Settings },
    { id: "R115", label: "R115 - Control de Calidad", icon: Shield },
    { id: "R116", label: "R116 - Gestión de Inventarios", icon: Package },
    { id: "R117", label: "R117 - Mantenimiento Preventivo", icon: Wrench },
    { id: "R118", label: "R118 - Seguridad y Medio Ambiente", icon: Shield },
    { id: "R119", label: "R119 - Logística y Distribución", icon: Truck },
    { id: "R120", label: "R120 - Recursos Humanos", icon: Settings },
    { id: "R121", label: "R121 - Análisis Financiero", icon: TrendingUp },
    { id: "R122", label: "R122 - Producción General", icon: Factory },
    { id: "R123", label: "R123 - Eficiencia Operativa", icon: Zap },
    { id: "R124", label: "R124 - Costos Operacionales", icon: TrendingUp },
    { id: "R125", label: "R125 - Indicadores de Rendimiento", icon: BarChart3 },
    { id: "R126", label: "R126 - Consumo Energético", icon: Zap },
    { id: "R127", label: "R127 - Gestión de Residuos", icon: Package },
    { id: "R128", label: "R128 - Planificación Estratégica", icon: FileText },
    { id: "R129", label: "R129 - Cumplimiento Normativo", icon: Shield },
    { id: "R130", label: "R130 - Innovación y Mejora", icon: TrendingUp },
    { id: "R131", label: "R131 - Reportes Ejecutivos", icon: FileText },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs principales con diseño pill */}
      <div className="flex gap-2 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300",
              activeTab === tab.id
                ? "bg-gradient-primary text-primary-foreground shadow-elevated scale-105"
                : "bg-card border border-border hover:border-primary hover:scale-105"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista vertical con scroll */}
      <div className="max-w-4xl mx-auto max-h-96 overflow-y-auto space-y-2 px-4">
        {rTabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{ animationDelay: `${index * 20}ms` }}
              className={cn(
                "w-full group relative flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 animate-fade-in",
                activeTab === tab.id
                  ? "bg-gradient-primary text-primary-foreground shadow-elevated scale-[1.02]"
                  : "bg-card border border-border hover:border-primary hover:shadow-industrial hover:scale-[1.01]"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0",
                activeTab === tab.id ? "text-primary-foreground" : "text-primary"
              )} />
              <span className="text-left text-sm font-medium flex-1">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Opción 5: Diseño de Tarjetas con Hover Reveal
const DashboardButtonsOption5 = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "ANTAPACCAY", label: "ANTAPACCAY" },
    { id: "GU14ONE", label: "GU14ONE" },
  ];

  const rTabs = [
    { id: "R112", label: "Extracción Mineral Primario", code: "R112", icon: Factory, color: "from-blue-500 to-cyan-500" },
    { id: "R113", label: "Transporte de Material", code: "R113", icon: Truck, color: "from-green-500 to-emerald-500" },
    { id: "R114", label: "Procesamiento y Trituración", code: "R114", icon: Settings, color: "from-orange-500 to-amber-500" },
    { id: "R115", label: "Control de Calidad", code: "R115", icon: Shield, color: "from-purple-500 to-violet-500" },
    { id: "R116", label: "Gestión de Inventarios", code: "R116", icon: Package, color: "from-pink-500 to-rose-500" },
    { id: "R117", label: "Mantenimiento Preventivo", code: "R117", icon: Wrench, color: "from-yellow-500 to-orange-500" },
    { id: "R118", label: "Seguridad y Medio Ambiente", code: "R118", icon: Shield, color: "from-teal-500 to-cyan-500" },
    { id: "R119", label: "Logística y Distribución", code: "R119", icon: Truck, color: "from-indigo-500 to-blue-500" },
    { id: "R120", label: "Recursos Humanos", code: "R120", icon: Settings, color: "from-red-500 to-pink-500" },
    { id: "R121", label: "Análisis Financiero", code: "R121", icon: TrendingUp, color: "from-lime-500 to-green-500" },
    { id: "R122", label: "Producción General", code: "R122", icon: Factory, color: "from-cyan-500 to-blue-500" },
    { id: "R123", label: "Eficiencia Operativa", code: "R123", icon: Zap, color: "from-amber-500 to-yellow-500" },
    { id: "R124", label: "Costos Operacionales", code: "R124", icon: TrendingUp, color: "from-violet-500 to-purple-500" },
    { id: "R125", label: "Indicadores de Rendimiento", code: "R125", icon: BarChart3, color: "from-rose-500 to-pink-500" },
    { id: "R126", label: "Consumo Energético", code: "R126", icon: Zap, color: "from-emerald-500 to-teal-500" },
    { id: "R127", label: "Gestión de Residuos", code: "R127", icon: Package, color: "from-orange-500 to-red-500" },
    { id: "R128", label: "Planificación Estratégica", code: "R128", icon: FileText, color: "from-blue-500 to-indigo-500" },
    { id: "R129", label: "Cumplimiento Normativo", code: "R129", icon: Shield, color: "from-green-500 to-lime-500" },
    { id: "R130", label: "Innovación y Mejora", code: "R130", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
    { id: "R131", label: "Reportes Ejecutivos", code: "R131", icon: FileText, color: "from-cyan-500 to-teal-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs principales con efecto deslizante */}
      <div className="flex gap-3 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative overflow-hidden px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-card border-2 border-border hover:border-primary"
            )}
          >
            <span className="relative z-10">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Grid de tarjetas con gradientes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rTabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{ animationDelay: `${index * 25}ms` }}
              className={cn(
                "group relative overflow-hidden rounded-xl transition-all duration-500 animate-fade-in aspect-square",
                activeTab === tab.id
                  ? "shadow-elevated scale-105"
                  : "shadow-md hover:shadow-elevated hover:scale-105"
              )}
            >
              {/* Fondo con gradiente */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-300",
                tab.color,
                activeTab === tab.id ? "opacity-100" : "opacity-70 group-hover:opacity-90"
              )} />
              
              {/* Contenido */}
              <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
                <Icon className="h-8 w-8 mb-2 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-xs font-bold mb-1">{tab.code}</span>
                <span className="text-xs text-center line-clamp-2 opacity-90">{tab.label}</span>
              </div>

              {/* Brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Indicador activo */}
              {activeTab === tab.id && (
                <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-white shadow-lg animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Opción 6: Sidebar Vertical con Panel de Dashboard
const DashboardButtonsOption6 = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "ANTAPACCAY", label: "ANTAPACCAY" },
    { id: "GU14ONE", label: "GU14ONE" },
  ];

  const rTabs = [
    { id: "R112", label: "R112 - Extracción Mineral Primario", icon: BarChart3 },
    { id: "R113", label: "R113 - Transporte de Material", icon: Truck },
    { id: "R114", label: "R114 - Procesamiento y Trituración", icon: Settings },
    { id: "R115", label: "R115 - Control de Calidad", icon: Shield },
    { id: "R116", label: "R116 - Gestión de Inventarios", icon: Package },
    { id: "R117", label: "R117 - Mantenimiento Preventivo", icon: Wrench },
    { id: "R118", label: "R118 - Seguridad y Medio Ambiente", icon: Shield },
    { id: "R119", label: "R119 - Logística y Distribución", icon: Truck },
    { id: "R120", label: "R120 - Recursos Humanos", icon: Settings },
    { id: "R121", label: "R121 - Análisis Financiero", icon: TrendingUp },
    { id: "R122", label: "R122 - Producción General", icon: Factory },
    { id: "R123", label: "R123 - Eficiencia Operativa", icon: Zap },
    { id: "R124", label: "R124 - Costos Operacionales", icon: TrendingUp },
    { id: "R125", label: "R125 - Indicadores de Rendimiento", icon: BarChart3 },
    { id: "R126", label: "R126 - Consumo Energético", icon: Zap },
    { id: "R127", label: "R127 - Gestión de Residuos", icon: Package },
    { id: "R128", label: "R128 - Planificación Estratégica", icon: FileText },
    { id: "R129", label: "R129 - Cumplimiento Normativo", icon: Shield },
    { id: "R130", label: "R130 - Innovación y Mejora", icon: TrendingUp },
    { id: "R131", label: "R131 - Reportes Ejecutivos", icon: FileText },
  ];

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
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar izquierdo */}
      <div className="w-80 border-r border-border bg-card flex flex-col overflow-hidden">
        {/* Tabs principales */}
        <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-background border border-border hover:bg-muted hover:border-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de dashboards con scroll */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {rTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted/50 text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                  <span className="text-sm font-medium flex-1">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel derecho - Dashboard */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header del panel */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-6">
          <h1 className="text-2xl font-bold text-foreground">
            {rTabs.find(t => t.id === activeTab)?.label || activeTab}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dashboard de Power BI
          </p>
        </div>

        {/* Contenido del dashboard */}
        <div className="flex-1 overflow-auto p-6 bg-muted/10">
          <div className="h-full bg-card rounded-xl shadow-lg overflow-hidden border border-border">
            <div className="h-full flex items-center justify-center">
              {/* Placeholder para Power BI */}
              <div className="text-center space-y-4 p-8">
                <BarChart3 className="h-20 w-20 text-primary mx-auto" />
                <div>
                  <p className="text-xl font-bold text-foreground mb-2">
                    Dashboard: {activeTab}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Aquí se mostrará el dashboard de Power BI embebido.
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-4 font-mono bg-muted/30 px-4 py-2 rounded-lg inline-block">
                    URL: {powerBiUrls[activeTab]}
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
  const [viewOption, setViewOption] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

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

  // Si es opción 3 o 6, usar el diseño completo con sidebar
  if (viewOption === 3) {
    return <DashboardButtonsOption3 activeTab={activeTab} onTabChange={setActiveTab} />;
  }
  
  if (viewOption === 6) {
    return <DashboardButtonsOption6 activeTab={activeTab} onTabChange={setActiveTab} />;
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
              {[1, 2, 3, 4, 5, 6].map((option) => (
                <button
                  key={option}
                  onClick={() => setViewOption(option as 1 | 2 | 3 | 4 | 5 | 6)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewOption === option ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  Opción {option}
                </button>
              ))}
            </div>
          </div>

          {/* Botones de navegación */}
          {viewOption === 1 && <DashboardButtonsOption1 activeTab={activeTab} onTabChange={setActiveTab} />}
          {viewOption === 2 && <DashboardButtonsOption2 activeTab={activeTab} onTabChange={setActiveTab} />}
          {viewOption === 4 && <DashboardButtonsOption4 activeTab={activeTab} onTabChange={setActiveTab} />}
          {viewOption === 5 && <DashboardButtonsOption5 activeTab={activeTab} onTabChange={setActiveTab} />}
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
