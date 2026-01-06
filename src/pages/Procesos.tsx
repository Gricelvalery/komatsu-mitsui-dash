import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Proceso = {
  id: string;
  nombre: string;
  descripcion?: string;
};

type AreaData = {
  nombre: string;
  color: string;
  bgColor: string;
  procesos: Proceso[];
  matriz: {
    hacelo: Proceso[];
    frutasAlcance: Proceso[];
    tiroALuna: Proceso[];
    noLoHagas: Proceso[];
  };
};

const areasData: Record<string, AreaData> = {
  planeamiento: {
    nombre: "Planeamiento",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    procesos: [
      { id: "P1", nombre: "Planificación Estratégica" },
      { id: "P2", nombre: "Gestión de Proyectos" },
      { id: "P3", nombre: "Control de Cronogramas" },
      { id: "P4", nombre: "Análisis de Riesgos" },
      { id: "P5", nombre: "Presupuesto Anual" },
      { id: "P6", nombre: "KPIs y Métricas" },
      { id: "P7", nombre: "Reportes Ejecutivos" },
      { id: "P8", nombre: "Forecasting" },
    ],
    matriz: {
      hacelo: [
        { id: "H1", nombre: "Control de Cronogramas" },
        { id: "H2", nombre: "Automatización Reportes" },
      ],
      frutasAlcance: [
        { id: "F1", nombre: "Dashboard KPIs" },
        { id: "F2", nombre: "Alertas Automáticas" },
      ],
      tiroALuna: [
        { id: "T1", nombre: "IA Predictiva" },
      ],
      noLoHagas: [
        { id: "N1", nombre: "Manual Excel" },
      ],
    },
  },
  administracion: {
    nombre: "Administración",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    procesos: [
      { id: "A1", nombre: "Compras" },
      { id: "A2", nombre: "Budget" },
      { id: "A3", nombre: "Cierres Mensuales AGI CAPEX - OPEX" },
      { id: "A4", nombre: "Opex" },
      { id: "A5", nombre: "Ventas & GF" },
      { id: "A6", nombre: "CAPEX" },
      { id: "A7", nombre: "Gestión, Producción, Presupuestaria, HMR, DRL areas" },
      { id: "A8", nombre: "Habilitación de personal" },
      { id: "A9", nombre: "Caja Chica y posición fondo fijo" },
      { id: "A10", nombre: "Reposiciones" },
      { id: "A11", nombre: "Rendiciones" },
      { id: "A12", nombre: "Provisiones y Facturación" },
      { id: "A13", nombre: "Transportes, headcount & mercadería" },
      { id: "A14", nombre: "Wholesalle" },
      { id: "A15", nombre: "Requisición, OMs, Cotizaciones y programaciones" },
      { id: "A16", nombre: "SSOMA" },
      { id: "A17", nombre: "Servicios terceros" },
      { id: "A18", nombre: "Subcontratos" },
      { id: "A19", nombre: "Calibración y renta de herramientas y/o activos" },
      { id: "A20", nombre: "Gestión contratos proveedores" },
      { id: "A21", nombre: "Gestión contrato cliente" },
      { id: "A22", nombre: "Rebate" },
      { id: "A23", nombre: "Componentes" },
      { id: "A24", nombre: "Viajes" },
    ],
    matriz: {
      hacelo: [
        { id: "H1", nombre: "Control de Costos" },
        { id: "H2", nombre: "Control de Activos: Capex, Compra, Calibración, Reparación, Baja" },
      ],
      frutasAlcance: [
        { id: "F1", nombre: "Frutas al alcance de la mano" },
      ],
      tiroALuna: [
        { id: "T1", nombre: "Tiro a la luna" },
      ],
      noLoHagas: [
        { id: "N1", nombre: "No lo hagas" },
      ],
    },
  },
  confiabilidad: {
    nombre: "Confiabilidad",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    procesos: [
      { id: "C1", nombre: "Mantenimiento Preventivo" },
      { id: "C2", nombre: "Análisis de Fallas" },
      { id: "C3", nombre: "Gestión de Activos" },
      { id: "C4", nombre: "Indicadores MTBF/MTTR" },
      { id: "C5", nombre: "Planes de Contingencia" },
      { id: "C6", nombre: "Auditorías Técnicas" },
      { id: "C7", nombre: "Certificaciones" },
      { id: "C8", nombre: "Capacitación Técnica" },
    ],
    matriz: {
      hacelo: [
        { id: "H1", nombre: "Monitoreo en Tiempo Real" },
        { id: "H2", nombre: "Alertas Predictivas" },
      ],
      frutasAlcance: [
        { id: "F1", nombre: "Checklist Digital" },
        { id: "F2", nombre: "Historial de Equipos" },
      ],
      tiroALuna: [
        { id: "T1", nombre: "Mantenimiento Autónomo IA" },
      ],
      noLoHagas: [
        { id: "N1", nombre: "Registros en Papel" },
      ],
    },
  },
};

const ProcesoCard = ({ proceso }: { proceso: Proceso }) => (
  <div className="group relative bg-emerald-400/90 hover:bg-emerald-500 transition-all duration-300 rounded-lg p-3 cursor-pointer hover:scale-105 hover:shadow-lg">
    <p className="text-xs font-medium text-emerald-950 text-center leading-tight">
      {proceso.nombre}
    </p>
    <ExternalLink className="absolute top-1 right-1 w-3 h-3 text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

const MatrizPriorizacion = ({ matriz, areaColor }: { matriz: AreaData["matriz"]; areaColor: string }) => (
  <div className="relative">
    {/* Eje Y Label */}
    <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-muted-foreground tracking-widest">
      FACTIBILIDAD
    </div>
    
    {/* Eje X Label */}
    <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground tracking-widest">
      IMPACTO
    </div>
    
    {/* Indicadores de ejes */}
    <div className="absolute -left-2 top-0 text-emerald-500 font-bold text-lg">+</div>
    <div className="absolute -left-2 bottom-0 text-red-500 font-bold text-lg">−</div>
    <div className="absolute right-0 bottom-[-20px] text-emerald-500 font-bold text-lg">+</div>
    <div className="absolute left-4 bottom-[-20px] text-red-500 font-bold text-lg">−</div>
    
    <div className="grid grid-cols-2 gap-1 ml-4">
      {/* Frutas al alcance - Alto Factibilidad, Bajo Impacto */}
      <div className="bg-emerald-200 dark:bg-emerald-900/40 rounded-tl-xl p-4 min-h-[140px]">
        <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" />
          Frutas al alcance de la mano
        </h4>
        <div className="space-y-1">
          {matriz.frutasAlcance.map((p) => (
            <Badge key={p.id} variant="secondary" className="text-[10px] bg-emerald-300/50 dark:bg-emerald-800/50 mr-1">
              {p.nombre}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* ¡Hacelo! - Alto Factibilidad, Alto Impacto */}
      <div className="bg-blue-300 dark:bg-blue-900/40 rounded-tr-xl p-4 min-h-[140px]">
        <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2">¡Hacelo!</h4>
        <div className="space-y-1">
          {matriz.hacelo.map((p) => (
            <Badge key={p.id} variant="secondary" className="text-[10px] bg-blue-400/50 dark:bg-blue-800/50 mr-1 mb-1">
              {p.nombre}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* No lo hagas - Bajo Factibilidad, Bajo Impacto */}
      <div className="bg-amber-200 dark:bg-amber-900/40 rounded-bl-xl p-4 min-h-[140px]">
        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">No lo hagas</h4>
        <div className="space-y-1">
          {matriz.noLoHagas.map((p) => (
            <Badge key={p.id} variant="secondary" className="text-[10px] bg-amber-300/50 dark:bg-amber-800/50 mr-1">
              {p.nombre}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Tiro a la luna - Bajo Factibilidad, Alto Impacto */}
      <div className="bg-rose-200 dark:bg-rose-900/40 rounded-br-xl p-4 min-h-[140px]">
        <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 mb-2">Tiro a la luna</h4>
        <div className="space-y-1">
          {matriz.tiroALuna.map((p) => (
            <Badge key={p.id} variant="secondary" className="text-[10px] bg-rose-300/50 dark:bg-rose-800/50 mr-1">
              {p.nombre}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AreaSection = ({ area, areaKey }: { area: AreaData; areaKey: string }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardHeader className={`cursor-pointer hover:bg-muted/50 transition-colors bg-gradient-to-r ${area.color} text-white`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                Procesos {area.nombre}
              </CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {area.procesos.length} procesos
              </Badge>
            </div>
            <p className="text-sm text-white/80 ml-7">Listar procesos del área</p>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 space-y-8">
            {/* Grilla de Procesos */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Listado de Procesos
              </h3>
              <div className={`${area.bgColor} rounded-2xl p-6`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {area.procesos.map((proceso) => (
                    <ProcesoCard key={proceso.id} proceso={proceso} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Matriz de Priorización */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Priorización de Procesos por Área
              </h3>
              <div className="flex justify-center">
                <div className="w-full max-w-2xl p-8">
                  <MatrizPriorizacion matriz={area.matriz} areaColor={area.color} />
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

const Procesos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Gestión de Procesos
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualiza y prioriza los procesos por área organizacional
        </p>
      </div>

      {/* Tabs para las áreas */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="all">Todas las Áreas</TabsTrigger>
          <TabsTrigger value="planeamiento">Planeamiento</TabsTrigger>
          <TabsTrigger value="administracion">Administración</TabsTrigger>
          <TabsTrigger value="confiabilidad">Confiabilidad</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries(areasData).map(([key, area]) => (
            <AreaSection key={key} area={area} areaKey={key} />
          ))}
        </TabsContent>

        {Object.entries(areasData).map(([key, area]) => (
          <TabsContent key={key} value={key}>
            <AreaSection area={area} areaKey={key} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Procesos;
