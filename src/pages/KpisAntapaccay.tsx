import { useState } from "react";
import { BarChart3 } from "lucide-react";

// Opción 1: Botones con Glassmorphism y Iconos
const DashboardButtonsOption1 = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "ANTAPACCAY", label: "ANTAPACCAY" },
    { id: "GU14ONE", label: "GU14ONE" },
  ];

  const rTabs = [
    { id: "R112", label: "R112" },
    { id: "R113", label: "R113" },
    { id: "R114", label: "R114" },
    { id: "R115", label: "R115" },
    { id: "R116", label: "R116" },
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

      {/* R Tabs como badges con animación */}
      <div className="flex gap-3 justify-center flex-wrap">
        {rTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 rounded-lg backdrop-blur-md border transition-all duration-300
              ${activeTab === tab.id 
                ? 'bg-primary text-primary-foreground border-primary shadow-industrial' 
                : 'bg-background/50 border-border hover:border-primary/50 hover:bg-primary/10'
              }
            `}
          >
            <span className="text-sm font-medium">{tab.label}</span>
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
    { id: "R112", label: "R112" },
    { id: "R113", label: "R113" },
    { id: "R114", label: "R114" },
    { id: "R115", label: "R115" },
    { id: "R116", label: "R116" },
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

      {/* Pills con hover elevado */}
      <div className="flex gap-2 justify-center flex-wrap">
        {rTabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`
              group relative px-5 py-2.5 rounded-full font-medium text-sm
              transition-all duration-300 animate-fade-in
              ${activeTab === tab.id 
                ? 'bg-gradient-primary text-primary-foreground shadow-elevated scale-105' 
                : 'bg-card border border-border hover:border-primary hover:shadow-industrial hover:scale-105'
              }
            `}
          >
            <span className="relative z-10">{tab.label}</span>
            {activeTab !== tab.id && (
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export const KpisAntapaccay = () => {
  const [activeTab, setActiveTab] = useState("ANTAPACCAY");
  const [viewOption, setViewOption] = useState<1 | 2>(1);

  // URLs de ejemplo para Power BI embeds
  const powerBiUrls: Record<string, string> = {
    ANTAPACCAY: "https://app.powerbi.com/view?r=ANTAPACCAY_EXAMPLE",
    GU14ONE: "https://app.powerbi.com/view?r=GU14ONE_EXAMPLE",
    R112: "https://app.powerbi.com/view?r=R112_EXAMPLE",
    R113: "https://app.powerbi.com/view?r=R113_EXAMPLE",
    R114: "https://app.powerbi.com/view?r=R114_EXAMPLE",
    R115: "https://app.powerbi.com/view?r=R115_EXAMPLE",
    R116: "https://app.powerbi.com/view?r=R116_EXAMPLE",
  };

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
