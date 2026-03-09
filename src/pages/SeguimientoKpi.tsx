import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Clock, Timer, AlertTriangle, CheckCircle2, TrendingDown, Gauge, CalendarClock, Wrench, ShieldAlert, Activity,
} from "lucide-react";

// ── Data from the Excel ──
interface HerramientaKpi {
  id: number;
  proyecto: string;
  placa: string;
  descripcion: string;
  marca: string;
  tipoHerramienta: string;
  motivo: string;
  proveedor: string;
  statusServicio: string;
  diasTranscurridosLlegada: number;
  tiempoCotizacion: number;
  diasEsperaAprobacion: number;
  diasSinAtencionSolped: number;
  tiempoInicioServicio: number;
  tiempoAtencionDias: number;
  tiempoTotalServicio: number;
  alertaCalibracion: string;
  diasCalibracion: number;
}

const herramientasKpi: HerramientaKpi[] = [
  { id: 1, proyecto: "ANTAMINA", placa: "KM0050264", descripcion: "MULTIMETRO", marca: "FLUKE", tipoHerramienta: "ELECTRÓNICA", motivo: "CALIBRACION", proveedor: "FERRIER", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 8, diasEsperaAprobacion: 0, diasSinAtencionSolped: 6, tiempoInicioServicio: 2, tiempoAtencionDias: 5, tiempoTotalServicio: 72, alertaCalibracion: "VENCIDO", diasCalibracion: 1081 },
  { id: 2, proyecto: "ANTAMINA", placa: "KM0055741", descripcion: "TORQUIMETRO 100 LB", marca: "URREA", tipoHerramienta: "MECÁNICA", motivo: "CALIBRACION", proveedor: "IGARDI", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 1, diasEsperaAprobacion: 5, diasSinAtencionSolped: 0, tiempoInicioServicio: 2, tiempoAtencionDias: 4, tiempoTotalServicio: 25, alertaCalibracion: "VENCIDO", diasCalibracion: 1126 },
  { id: 3, proyecto: "ANTAMINA", placa: "KM0049008", descripcion: "TACOMETRO", marca: "SNAP ON", tipoHerramienta: "ELECTRÓNICA", motivo: "CALIBRACION", proveedor: "IGARDI", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 7, diasEsperaAprobacion: 4, diasSinAtencionSolped: 24, tiempoInicioServicio: 9, tiempoAtencionDias: 19, tiempoTotalServicio: 72, alertaCalibracion: "DE BAJA", diasCalibracion: 0 },
  { id: 4, proyecto: "ANTAMINA", placa: "KM0049004", descripcion: "PIROMETRO", marca: "FLUKE", tipoHerramienta: "ELECTRÓNICA", motivo: "CALIBRACION", proveedor: "FERRIER", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 8, diasEsperaAprobacion: 0, diasSinAtencionSolped: 6, tiempoInicioServicio: 2, tiempoAtencionDias: 5, tiempoTotalServicio: 72, alertaCalibracion: "VENCIDO", diasCalibracion: 1081 },
  { id: 5, proyecto: "ANTAMINA", placa: "KM0057921", descripcion: "PISTOLA IMPACTO 1/2", marca: "BLUE POINT", tipoHerramienta: "ELECTRÓNICA", motivo: "CALIBRACION", proveedor: "O&P SERVICIOS", statusServicio: "REPARADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 20, diasEsperaAprobacion: 4, diasSinAtencionSolped: 0, tiempoInicioServicio: 2, tiempoAtencionDias: 48, tiempoTotalServicio: 72, alertaCalibracion: "VENCIDO", diasCalibracion: 0 },
  { id: 6, proyecto: "ANTAMINA", placa: "S/C", descripcion: "PINZA AMPERIMÉTRICA", marca: "URREA", tipoHerramienta: "ELECTRÓNICA", motivo: "CALIBRACION", proveedor: "J LI REPRESENTACIONES", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 1, diasEsperaAprobacion: 7, diasSinAtencionSolped: 5, tiempoInicioServicio: 0, tiempoAtencionDias: 0, tiempoTotalServicio: 133, alertaCalibracion: "VENCIDO", diasCalibracion: 1039 },
  { id: 7, proyecto: "ANTAMINA", placa: "KM0048910", descripcion: "MEGOMETRO", marca: "FLUKE", tipoHerramienta: "ELECTRÓNICA", motivo: "CALIBRACION", proveedor: "FERRIER", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 10, diasEsperaAprobacion: 0, diasSinAtencionSolped: 6, tiempoInicioServicio: 0, tiempoAtencionDias: 11, tiempoTotalServicio: 72, alertaCalibracion: "VENCIDO", diasCalibracion: 1078 },
  { id: 8, proyecto: "ANTAMINA", placa: "KM0048908", descripcion: "CABEZAL HYD 1 1/2\"", marca: "RAPITORC", tipoHerramienta: "HIDRÁULICA", motivo: "MANTENIMIENTO", proveedor: "O&P SERVICIOS", statusServicio: "REPARADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 7, diasEsperaAprobacion: 14, diasSinAtencionSolped: 1, tiempoInicioServicio: 0, tiempoAtencionDias: 26, tiempoTotalServicio: 146, alertaCalibracion: "N/A", diasCalibracion: 0 },
  { id: 9, proyecto: "ANTAMINA", placa: "KMP010493", descripcion: "LUMINARIA PORTATIL", marca: "PELICAN", tipoHerramienta: "ELECTRÓNICA", motivo: "MANTENIMIENTO", proveedor: "THERMOTEK", statusServicio: "REPARADO", diasTranscurridosLlegada: 7, tiempoCotizacion: 17, diasEsperaAprobacion: 10, diasSinAtencionSolped: 3, tiempoInicioServicio: 2, tiempoAtencionDias: 11, tiempoTotalServicio: 55, alertaCalibracion: "N/A", diasCalibracion: 0 },
  { id: 10, proyecto: "ANTAMINA", placa: "KM0052471", descripcion: "MULTIMETRO DIGITAL", marca: "FLUKE", tipoHerramienta: "ELECTRÓNICA", motivo: "CALIBRACION", proveedor: "FERRIER", statusServicio: "REPARADO", diasTranscurridosLlegada: 7, tiempoCotizacion: 5, diasEsperaAprobacion: 3, diasSinAtencionSolped: 14, tiempoInicioServicio: 0, tiempoAtencionDias: 11, tiempoTotalServicio: 41, alertaCalibracion: "VENCIDO", diasCalibracion: 698 },
  { id: 11, proyecto: "ANTAMINA", placa: "KM0056042", descripcion: "LLAVE DE TORQUE", marca: "RAPIC TORC", tipoHerramienta: "MECÁNICA", motivo: "MANTTO / CALIBRACION", proveedor: "MULTITORQ", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 4, tiempoCotizacion: 20, diasEsperaAprobacion: 0, diasSinAtencionSolped: 0, tiempoInicioServicio: 1, tiempoAtencionDias: 25, tiempoTotalServicio: 53, alertaCalibracion: "VENCIDO", diasCalibracion: 622 },
  { id: 12, proyecto: "ANTAMINA", placa: "KM0048878", descripcion: "PIROMETRO", marca: "FLUKE", tipoHerramienta: "ELECTRÓNICA", motivo: "MANTTO / CALIBRACION", proveedor: "J LI METROLOGY", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 4, tiempoCotizacion: 7, diasEsperaAprobacion: 0, diasSinAtencionSolped: 12, tiempoInicioServicio: 1, tiempoAtencionDias: 5, tiempoTotalServicio: 27, alertaCalibracion: "VENCIDO", diasCalibracion: 664 },
  { id: 13, proyecto: "ANTAMINA", placa: "KM0063570", descripcion: "GATA TRANSMISION", marca: "ENERPAC", tipoHerramienta: "NEUMÁTICA", motivo: "MANTTO / CALIBRACION", proveedor: "O&P SERVICIOS", statusServicio: "REPARADO", diasTranscurridosLlegada: 4, tiempoCotizacion: 1, diasEsperaAprobacion: 5, diasSinAtencionSolped: 3, tiempoInicioServicio: 3, tiempoAtencionDias: 7, tiempoTotalServicio: 20, alertaCalibracion: "N/A", diasCalibracion: 0 },
  { id: 14, proyecto: "ANTAMINA", placa: "KM0057625", descripcion: "TACOMETRO DIGITAL", marca: "SNAPON", tipoHerramienta: "ELECTRÓNICA", motivo: "CALIBRACION", proveedor: "ENERGOTEC", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 4, tiempoCotizacion: 7, diasEsperaAprobacion: 5, diasSinAtencionSolped: 9, tiempoInicioServicio: 2, tiempoAtencionDias: 14, tiempoTotalServicio: 62, alertaCalibracion: "VENCIDO", diasCalibracion: 597 },
  { id: 15, proyecto: "ANTAMINA", placa: "KM0048922", descripcion: "BOMBA HIDRAULICA", marca: "HYDROMAQ", tipoHerramienta: "HIDRÁULICA", motivo: "MANTENIMIENTO", proveedor: "MULTITORQ", statusServicio: "REPARADO", diasTranscurridosLlegada: 4, tiempoCotizacion: 16, diasEsperaAprobacion: 14, diasSinAtencionSolped: 4, tiempoInicioServicio: 21, tiempoAtencionDias: 19, tiempoTotalServicio: 82, alertaCalibracion: "N/A", diasCalibracion: 0 },
  { id: 16, proyecto: "ANTAMINA", placa: "KM0056042", descripcion: "LLAVE DE TORQUE", marca: "RAPIC TORC", tipoHerramienta: "HIDRÁULICA", motivo: "REPARACION /MANTENIMIENTO", proveedor: "MULTITORQ", statusServicio: "REPARADO", diasTranscurridosLlegada: 16, tiempoCotizacion: 10, diasEsperaAprobacion: 7, diasSinAtencionSolped: 5, tiempoInicioServicio: 1, tiempoAtencionDias: -2, tiempoTotalServicio: 25, alertaCalibracion: "VENCIDO", diasCalibracion: 45718 },
  { id: 17, proyecto: "ANTAMINA", placa: "S/P", descripcion: "PISTOLA NEUMATICA 3/4", marca: "INGERSOL", tipoHerramienta: "NEUMÁTICA", motivo: "MANTENIMIENTO", proveedor: "O&P SERVICIOS", statusServicio: "DE BAJA", diasTranscurridosLlegada: 40, tiempoCotizacion: 8, diasEsperaAprobacion: 5, diasSinAtencionSolped: 0, tiempoInicioServicio: 0, tiempoAtencionDias: 20, tiempoTotalServicio: 35, alertaCalibracion: "DE BAJA", diasCalibracion: 0 },
  { id: 18, proyecto: "ANTAMINA", placa: "S/P", descripcion: "TORQUIMETRO 1/2", marca: "CDI", tipoHerramienta: "MECÁNICA", motivo: "CALIBRACION", proveedor: "J LI METROLOGY", statusServicio: "CALIBRADO", diasTranscurridosLlegada: 40, tiempoCotizacion: 3, diasEsperaAprobacion: 5, diasSinAtencionSolped: 0, tiempoInicioServicio: 0, tiempoAtencionDias: 20, tiempoTotalServicio: 35, alertaCalibracion: "VENCIDO", diasCalibracion: 395 },
  { id: 19, proyecto: "ANTAMINA", placa: "BMK106939", descripcion: "CALEFACTOR", marca: "SOLE", tipoHerramienta: "MECÁNICA", motivo: "MANTENIMIENTO", proveedor: "O&P SERVICIOS", statusServicio: "DE BAJA", diasTranscurridosLlegada: 4, tiempoCotizacion: 35, diasEsperaAprobacion: 0, diasSinAtencionSolped: 1, tiempoInicioServicio: 22, tiempoAtencionDias: 7, tiempoTotalServicio: 77, alertaCalibracion: "DE BAJA", diasCalibracion: 0 },
  { id: 20, proyecto: "ANTAMINA", placa: "KM0064977", descripcion: "LUMINARIA PORTATIL", marca: "PELICAN", tipoHerramienta: "ELECTRÓNICA", motivo: "MANTENIMIENTO", proveedor: "THERMOTEK", statusServicio: "REPARADO", diasTranscurridosLlegada: 4, tiempoCotizacion: 20, diasEsperaAprobacion: 7, diasSinAtencionSolped: 22, tiempoInicioServicio: 21, tiempoAtencionDias: 19, tiempoTotalServicio: 116, alertaCalibracion: "N/A", diasCalibracion: 0 },
];

const COLORS = {
  primary: "hsl(238, 85%, 34%)",
  primaryLight: "hsl(238, 75%, 50%)",
  success: "hsl(142, 71%, 35%)",
  warning: "hsl(38, 92%, 50%)",
  danger: "hsl(0, 84%, 60%)",
  info: "hsl(200, 80%, 50%)",
  muted: "hsl(232, 25%, 70%)",
};

const GaugeChart = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
  const pct = Math.min((value / max) * 100, 100);
  const isGood = pct <= 40;
  const isMid = pct > 40 && pct <= 70;
  const gaugeColor = isGood ? COLORS.success : isMid ? COLORS.warning : COLORS.danger;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-16 overflow-hidden">
        <svg viewBox="0 0 120 60" className="w-full h-full">
          <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" strokeLinecap="round" />
          <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke={gaugeColor} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${pct * 1.57} 157`} />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-0">
          <span className="text-lg font-bold text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-medium text-center">{label}</span>
    </div>
  );
};

const getSemaforoColor = (dias: number, tipo: "llegada" | "cotizacion" | "aprobacion" | "servicio" | "total") => {
  const thresholds: Record<string, [number, number]> = {
    llegada: [7, 20],
    cotizacion: [5, 15],
    aprobacion: [5, 10],
    servicio: [10, 25],
    total: [30, 60],
  };
  const [green, yellow] = thresholds[tipo];
  if (dias <= green) return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
  if (dias <= yellow) return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
  return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
};

const SeguimientoKpi = () => {
  const [filtroProveedor, setFiltroProveedor] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  const proveedores = useMemo(() => ["Todos", ...new Set(herramientasKpi.map(h => h.proveedor))], []);
  const tipos = useMemo(() => ["Todos", ...new Set(herramientasKpi.map(h => h.tipoHerramienta))], []);
  const statuses = useMemo(() => ["Todos", ...new Set(herramientasKpi.map(h => h.statusServicio))], []);

  const filtered = useMemo(() => herramientasKpi.filter(h => {
    if (filtroProveedor !== "Todos" && h.proveedor !== filtroProveedor) return false;
    if (filtroTipo !== "Todos" && h.tipoHerramienta !== filtroTipo) return false;
    if (filtroStatus !== "Todos" && h.statusServicio !== filtroStatus) return false;
    return true;
  }), [filtroProveedor, filtroTipo, filtroStatus]);

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const validTotals = filtered.map(h => h.tiempoTotalServicio).filter(v => v > 0);

  const kpis = {
    avgLlegada: avg(filtered.map(h => h.diasTranscurridosLlegada)),
    avgCotizacion: avg(filtered.map(h => h.tiempoCotizacion)),
    avgAprobacion: avg(filtered.map(h => h.diasEsperaAprobacion)),
    avgSolped: avg(filtered.map(h => h.diasSinAtencionSolped)),
    avgInicioServicio: avg(filtered.map(h => h.tiempoInicioServicio)),
    avgAtencion: avg(filtered.map(h => h.tiempoAtencionDias).filter(v => v >= 0)),
    avgTotal: avg(validTotals),
    totalHerramientas: filtered.length,
    vencidas: filtered.filter(h => h.alertaCalibracion === "VENCIDO").length,
    deBaja: filtered.filter(h => h.alertaCalibracion === "DE BAJA" || h.statusServicio === "DE BAJA").length,
    calibradas: filtered.filter(h => h.statusServicio === "CALIBRADO").length,
    reparadas: filtered.filter(h => h.statusServicio === "REPARADO").length,
  };

  const eficienciaATiempo = filtered.filter(h => h.tiempoTotalServicio <= 45).length;
  const pctEficiencia = filtered.length ? Math.round((eficienciaATiempo / filtered.length) * 100) : 0;

  // Chart data
  const statusPieData = [
    { name: "Calibrado", value: kpis.calibradas, color: COLORS.success },
    { name: "Reparado", value: kpis.reparadas, color: COLORS.info },
    { name: "De Baja", value: kpis.deBaja, color: COLORS.danger },
  ].filter(d => d.value > 0);

  const proveedorBarData = useMemo(() => {
    const map = new Map<string, number[]>();
    filtered.forEach(h => {
      if (!map.has(h.proveedor)) map.set(h.proveedor, []);
      map.get(h.proveedor)!.push(h.tiempoTotalServicio);
    });
    return Array.from(map.entries()).map(([name, vals]) => ({
      name: name.length > 12 ? name.slice(0, 12) + "…" : name,
      promedio: avg(vals),
    })).sort((a, b) => b.promedio - a.promedio);
  }, [filtered]);

  const timelineData = useMemo(() => {
    return filtered.slice(0, 10).map(h => ({
      name: h.descripcion.length > 15 ? h.descripcion.slice(0, 15) + "…" : h.descripcion,
      llegada: h.diasTranscurridosLlegada,
      cotizacion: h.tiempoCotizacion,
      aprobacion: h.diasEsperaAprobacion,
      servicio: h.tiempoAtencionDias > 0 ? h.tiempoAtencionDias : 0,
    }));
  }, [filtered]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filtroProveedor} onValueChange={setFiltroProveedor}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Proveedor" /></SelectTrigger>
          <SelectContent>{proveedores.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>{tipos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Badge variant="secondary" className="ml-auto">{filtered.length} herramientas</Badge>
      </div>

      {/* KPI Cards Row 1 - Time metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { label: "Prom. Llegada", value: `${kpis.avgLlegada}d`, icon: Clock, desc: "Días transcurridos" },
          { label: "Prom. Cotización", value: `${kpis.avgCotizacion}d`, icon: Timer, desc: "Entrega cotización" },
          { label: "Prom. Aprobación", value: `${kpis.avgAprobacion}d`, icon: CalendarClock, desc: "Espera aprobación" },
          { label: "Prom. SOLPED", value: `${kpis.avgSolped}d`, icon: AlertTriangle, desc: "Sin atención" },
          { label: "Inicio Servicio", value: `${kpis.avgInicioServicio}d`, icon: Activity, desc: "Tiempo inicio" },
          { label: "Prom. Atención", value: `${kpis.avgAtencion}d`, icon: Wrench, desc: "Días servicio" },
          { label: "Total General", value: `${kpis.avgTotal}d`, icon: TrendingDown, desc: "Ciclo completo" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center gap-2">
                <kpi.icon className="w-4 h-4 text-primary" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2 - Gauges + Status Pie + Alert cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gauges */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary" /> Eficiencia por Fase (días promedio)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4 pb-4">
            <GaugeChart value={kpis.avgLlegada} max={40} label="Llegada" color={COLORS.primary} />
            <GaugeChart value={kpis.avgCotizacion} max={30} label="Cotización" color={COLORS.info} />
            <GaugeChart value={kpis.avgAprobacion} max={15} label="Aprobación" color={COLORS.warning} />
            <GaugeChart value={kpis.avgAtencion} max={30} label="Atención" color={COLORS.success} />
          </CardContent>
        </Card>

        {/* Status Pie */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Distribución por Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alert summary */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-destructive" /> Alertas de Calibración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Vencidas</span>
              <Badge className="bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30">{kpis.vencidas}</Badge>
            </div>
            <Progress value={(kpis.vencidas / filtered.length) * 100} className="h-2 [&>div]:bg-destructive" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">De Baja</span>
              <Badge variant="secondary">{kpis.deBaja}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Eficiencia (≤45d)</span>
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30 hover:bg-green-500/30">{pctEficiencia}%</Badge>
            </div>
            <Progress value={pctEficiencia} className="h-2 [&>div]:bg-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline por Herramienta</TabsTrigger>
          <TabsTrigger value="proveedor">Tiempo por Proveedor</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Desglose de Fases por Herramienta (días)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={timelineData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="llegada" name="Llegada" stackId="a" fill={COLORS.primary} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="cotizacion" name="Cotización" stackId="a" fill={COLORS.info} />
                  <Bar dataKey="aprobacion" name="Aprobación" stackId="a" fill={COLORS.warning} />
                  <Bar dataKey="servicio" name="Servicio" stackId="a" fill={COLORS.success} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proveedor">
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tiempo Promedio Total por Proveedor (días)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={proveedorBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="promedio" name="Prom. días" fill={COLORS.primaryLight} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tabla Semáforo */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Tabla Detallada con Semáforo de Tiempos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/90 hover:bg-primary/90">
                  {["#", "Placa", "Descripción", "Tipo", "Proveedor", "Llegada", "Cotización", "Aprobación", "SOLPED", "Atención", "Total (d)", "Status", "Calibración"].map(h => (
                    <TableHead key={h} className="text-primary-foreground font-semibold text-xs whitespace-nowrap">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((h, i) => (
                  <TableRow key={h.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <TableCell className="font-mono text-xs">{h.id}</TableCell>
                    <TableCell className="font-mono text-xs">{h.placa}</TableCell>
                    <TableCell className="text-xs max-w-[140px] truncate">{h.descripcion}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{h.tipoHerramienta}</Badge></TableCell>
                    <TableCell className="text-xs">{h.proveedor}</TableCell>
                    <TableCell><Badge className={`text-[10px] border ${getSemaforoColor(h.diasTranscurridosLlegada, "llegada")}`}>{h.diasTranscurridosLlegada}d</Badge></TableCell>
                    <TableCell><Badge className={`text-[10px] border ${getSemaforoColor(h.tiempoCotizacion, "cotizacion")}`}>{h.tiempoCotizacion}d</Badge></TableCell>
                    <TableCell><Badge className={`text-[10px] border ${getSemaforoColor(h.diasEsperaAprobacion, "aprobacion")}`}>{h.diasEsperaAprobacion}d</Badge></TableCell>
                    <TableCell><Badge className={`text-[10px] border ${getSemaforoColor(h.diasSinAtencionSolped, "aprobacion")}`}>{h.diasSinAtencionSolped}d</Badge></TableCell>
                    <TableCell><Badge className={`text-[10px] border ${getSemaforoColor(Math.max(h.tiempoAtencionDias, 0), "servicio")}`}>{h.tiempoAtencionDias}d</Badge></TableCell>
                    <TableCell><Badge className={`text-[10px] border font-bold ${getSemaforoColor(h.tiempoTotalServicio, "total")}`}>{h.tiempoTotalServicio}d</Badge></TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${
                        h.statusServicio === "CALIBRADO" ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                        h.statusServicio === "REPARADO" ? "bg-blue-500/20 text-blue-700 dark:text-blue-400" :
                        "bg-red-500/20 text-red-700 dark:text-red-400"
                      }`}>{h.statusServicio}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${
                        h.alertaCalibracion === "VENCIDO" ? "bg-red-500/20 text-red-700 dark:text-red-400" :
                        h.alertaCalibracion === "DE BAJA" ? "bg-muted text-muted-foreground" :
                        "bg-green-500/20 text-green-700 dark:text-green-400"
                      }`}>
                        {h.alertaCalibracion === "VENCIDO" ? `⚠ ${h.diasCalibracion}d` : h.alertaCalibracion}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeguimientoKpi;
