import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  Shield,
  Activity,
  DollarSign,
  Users,
  ExternalLink,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Flame,
  Columns3,
  PencilLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "matrix" | "cards" | "heatmap" | "kanban";

/* ============================================================
   DATA – BU Servicios Minería y KRCP (Excel Abr-26)
============================================================ */

type Trend = "up" | "down" | "flat";
type Status = "good" | "warn" | "bad" | "none";

interface Cell {
  value: string;          // valor a mostrar
  raw?: number | null;    // numérico para cálculos
  status: Status;         // semáforo
  trend?: Trend;          // tendencia
}

interface Project {
  name: string;
  data: Record<string, Cell>;
}

const fmtPct = (v: number | null) => (v === null ? "—" : `${v.toFixed(1)}%`);
const fmtNum = (v: number | null) =>
  v === null ? "—" : v.toLocaleString("en-US", { maximumFractionDigits: 2 });

/** helpers para construir celdas rápidamente */
const c = (
  raw: number | null,
  status: Status,
  trend: Trend = "flat",
  formatter: (v: number | null) => string = fmtNum
): Cell => ({
  value: formatter(raw),
  raw,
  status,
  trend,
});

/** Datos exactos del Excel */
const projects: Project[] = [
  {
    name: "Antamina",
    data: {
      cuasi: c(10, "bad", "down"),
      negativa: c(167, "bad", "up"),
      dispCam: c(91.9, "good", "flat", fmtPct),
      dispPalas: c(93.1, "good", "flat", fmtPct),
      ventaBP: c(126.2, "good", "up", fmtPct),
      gpBP: c(68, "bad", "down", fmtPct),
      aporteHrs: c(3.6, "good", "flat", fmtPct),
      sobretiempoH: c(8775.32, "warn", "up"),
      sobretiempoP: c(114.56, "good", "down"),
    },
  },
  {
    name: "Antapaccay",
    data: {
      cuasi: c(3, "warn", "down"),
      negativa: c(3, "good", "down"),
      dispCam: c(90.2, "good", "flat", fmtPct),
      dispPalas: c(94.9, "good", "flat", fmtPct),
      ventaBP: c(101.3, "good", "flat", fmtPct),
      gpBP: c(52, "bad", "down", fmtPct),
      aporteHrs: c(0.9, "good", "flat", fmtPct),
      sobretiempoH: c(2192.85, "good", "flat"),
      sobretiempoP: c(701.73, "warn", "up"),
    },
  },
  {
    name: "Bayovar",
    data: {
      cuasi: c(151, "bad", "up"),
      negativa: c(30, "warn", "flat"),
      dispCam: c(86.5, "bad", "down", fmtPct),
      dispPalas: c(82.3, "bad", "down", fmtPct),
      ventaBP: c(105.1, "good", "up", fmtPct),
      gpBP: c(111, "good", "up", fmtPct),
      aporteHrs: c(6.2, "warn", "up", fmtPct),
      sobretiempoH: c(15030.93, "bad", "up"),
      sobretiempoP: c(2730.7, "bad", "up"),
    },
  },
  {
    name: "Las Bambas",
    data: {
      cuasi: c(1, "good", "down"),
      negativa: c(5, "good", "down"),
      dispCam: c(85.1, "bad", "down", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(100.3, "good", "flat", fmtPct),
      gpBP: c(46, "bad", "down", fmtPct),
      aporteHrs: c(5.2, "warn", "flat", fmtPct),
      sobretiempoH: c(12614.75, "bad", "up"),
      sobretiempoP: c(0, "good", "flat"),
    },
  },
  {
    name: "Toromocho",
    data: {
      cuasi: c(0, "good", "down"),
      negativa: c(6, "good", "down"),
      dispCam: c(86.7, "bad", "down", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(103.9, "good", "flat", fmtPct),
      gpBP: c(75, "warn", "flat", fmtPct),
      aporteHrs: c(1.5, "good", "flat", fmtPct),
      sobretiempoH: c(3598.95, "good", "flat"),
      sobretiempoP: c(6.74, "good", "flat"),
    },
  },
  {
    name: "SPCC - Cuajone",
    data: {
      cuasi: c(0, "good", "down"),
      negativa: c(0, "good", "down"),
      dispCam: c(88.5, "warn", "flat", fmtPct),
      dispPalas: c(92.4, "good", "flat", fmtPct),
      ventaBP: c(null, "none", "flat", fmtPct),
      gpBP: c(53, "bad", "down", fmtPct),
      aporteHrs: c(0.2, "good", "flat", fmtPct),
      sobretiempoH: c(597.15, "good", "flat"),
      sobretiempoP: c(0, "good", "flat"),
    },
  },
  {
    name: "SPCC - Toquepala",
    data: {
      cuasi: c(2, "warn", "down"),
      negativa: c(1, "good", "down"),
      dispCam: c(90.8, "good", "flat", fmtPct),
      dispPalas: c(92.6, "good", "flat", fmtPct),
      ventaBP: c(43.0, "bad", "down", fmtPct),
      gpBP: c(102, "good", "up", fmtPct),
      aporteHrs: c(0.6, "good", "flat", fmtPct),
      sobretiempoH: c(1521.28, "good", "flat"),
      sobretiempoP: c(65, "good", "flat"),
    },
  },
  {
    name: "Cerro Verde",
    data: {
      cuasi: c(3, "warn", "down"),
      negativa: c(4, "good", "down"),
      dispCam: c(88.8, "warn", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(106.5, "good", "up", fmtPct),
      gpBP: c(38, "bad", "down", fmtPct),
      aporteHrs: c(1.8, "good", "flat", fmtPct),
      sobretiempoH: c(4248.33, "warn", "flat"),
      sobretiempoP: c(74.69, "good", "flat"),
    },
  },
  {
    name: "Quellaveco",
    data: {
      cuasi: c(1, "good", "down"),
      negativa: c(15, "warn", "flat"),
      dispCam: c(null, "none", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(96.3, "good", "flat", fmtPct),
      gpBP: c(103, "good", "up", fmtPct),
      aporteHrs: c(2.7, "good", "flat", fmtPct),
      sobretiempoH: c(6620.06, "warn", "flat"),
      sobretiempoP: c(396.59, "warn", "up"),
    },
  },
  {
    name: "Marcobre",
    data: {
      cuasi: c(0, "good", "down"),
      negativa: c(9, "warn", "flat"),
      dispCam: c(null, "none", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(124.2, "good", "up", fmtPct),
      gpBP: c(172, "good", "up", fmtPct),
      aporteHrs: c(1.2, "good", "flat", fmtPct),
      sobretiempoH: c(2859.36, "good", "flat"),
      sobretiempoP: c(null, "none", "flat"),
    },
  },
  {
    name: "Taller Estructural LJ",
    data: {
      cuasi: c(2, "warn", "down"),
      negativa: c(0, "good", "down"),
      dispCam: c(null, "none", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(45.6, "bad", "down", fmtPct),
      gpBP: c(17, "bad", "down", fmtPct),
      aporteHrs: c(7.1, "warn", "up", fmtPct),
      sobretiempoH: c(17176.12, "bad", "up"),
      sobretiempoP: c(1009.7, "bad", "up"),
    },
  },
  {
    name: "Armados Camiones",
    data: {
      cuasi: c(2, "warn", "down"),
      negativa: c(2, "good", "down"),
      dispCam: c(null, "none", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(102.4, "good", "up", fmtPct),
      gpBP: c(65, "bad", "down", fmtPct),
      aporteHrs: c(2.1, "good", "flat", fmtPct),
      sobretiempoH: c(5051.94, "warn", "flat"),
      sobretiempoP: c(1.25, "good", "flat"),
    },
  },
  {
    name: "Armados Palas",
    data: {
      cuasi: c(1, "good", "down"),
      negativa: c(0, "good", "down"),
      dispCam: c(null, "none", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(71.1, "warn", "down", fmtPct),
      gpBP: c(39, "bad", "down", fmtPct),
      aporteHrs: c(8.5, "warn", "up", fmtPct),
      sobretiempoH: c(20706.21, "bad", "up"),
      sobretiempoP: c(0, "good", "flat"),
    },
  },
  {
    name: "KRCP La Joya",
    data: {
      cuasi: c(3, "warn", "down"),
      negativa: c(7, "warn", "down"),
      dispCam: c(null, "none", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(123.4, "good", "up", fmtPct),
      gpBP: c(144, "good", "up", fmtPct),
      aporteHrs: c(23.3, "bad", "up", fmtPct),
      sobretiempoH: c(56500.25, "bad", "up"),
      sobretiempoP: c(2203.95, "bad", "up"),
    },
  },
  {
    name: "KRCP Callao",
    data: {
      cuasi: c(7, "bad", "up"),
      negativa: c(2, "good", "down"),
      dispCam: c(null, "none", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(91.4, "good", "flat", fmtPct),
      gpBP: c(95, "good", "flat", fmtPct),
      aporteHrs: c(29.7, "bad", "up", fmtPct),
      sobretiempoH: c(71943.54, "bad", "up"),
      sobretiempoP: c(3658.42, "bad", "up"),
    },
  },
  {
    name: "Operaciones Centralizadas",
    data: {
      cuasi: c(1, "good", "down"),
      negativa: c(0, "good", "down"),
      dispCam: c(null, "none", "flat", fmtPct),
      dispPalas: c(null, "none", "flat", fmtPct),
      ventaBP: c(null, "none", "flat", fmtPct),
      gpBP: c(null, "none", "flat", fmtPct),
      aporteHrs: c(5.3, "warn", "flat", fmtPct),
      sobretiempoH: c(12955.28, "bad", "up"),
      sobretiempoP: c(494.86, "warn", "flat"),
    },
  },
];

/** Definición de columnas KPI agrupadas por categoría */
interface KpiCol {
  key: string;
  label: string;
  sub?: string;
}
interface KpiGroup {
  key: string;
  label: string;
  icon: typeof Shield;
  accent: string; // bg de la cabecera del grupo
  kpis: KpiCol[];
}

const groups: KpiGroup[] = [
  {
    key: "seg",
    label: "Seguridad",
    icon: Shield,
    accent: "bg-emerald-700",
    kpis: [
      { key: "cuasi", label: "Cuasi Accidentes", sub: "N°" },
      { key: "negativa", label: "Negativa Responsable", sub: "N°" },
    ],
  },
  {
    key: "ope",
    label: "Operaciones",
    icon: Activity,
    accent: "bg-sky-700",
    kpis: [
      { key: "dispCam", label: "Disp. Camiones", sub: "Promedio" },
      { key: "dispPalas", label: "Disp. Palas", sub: "Promedio" },
    ],
  },
  {
    key: "cost",
    label: "Costos y Presupuesto",
    icon: DollarSign,
    accent: "bg-sky-600",
    kpis: [
      { key: "ventaBP", label: "Venta BP vs Reales", sub: "%" },
      { key: "gpBP", label: "GP BP vs Reales", sub: "%" },
    ],
  },
  {
    key: "rrhh",
    label: "Gestión Humana",
    icon: Users,
    accent: "bg-slate-600",
    kpis: [
      { key: "aporteHrs", label: "Aporte de Horas", sub: "%" },
      { key: "sobretiempoH", label: "Sobretiempo Acumulado", sub: "Horas 04/25-03/26" },
      { key: "sobretiempoP", label: "Sobretiempo Período", sub: "01/04 al 14/04 2026" },
    ],
  },
];

/* ============================================================
   UI HELPERS
============================================================ */

const StatusDot = ({ status }: { status: Status }) => {
  if (status === "none") return <span className="inline-block h-3 w-3 rounded-full bg-muted" />;
  const map: Record<Exclude<Status, "none">, string> = {
    good: "bg-emerald-500 shadow-[0_0_0_3px_hsl(var(--background))]",
    warn: "bg-amber-400 shadow-[0_0_0_3px_hsl(var(--background))]",
    bad: "bg-red-500 shadow-[0_0_0_3px_hsl(var(--background))]",
  };
  return <span className={cn("inline-block h-3 w-3 rounded-full ring-1 ring-black/10", map[status])} />;
};

const TrendIcon = ({ trend, status }: { trend?: Trend; status: Status }) => {
  if (!trend || status === "none") return <Minus className="h-3.5 w-3.5 text-muted-foreground/50" />;
  if (trend === "up")
    return (
      <ArrowUp
        className={cn(
          "h-3.5 w-3.5",
          status === "good" ? "text-emerald-600" : status === "warn" ? "text-amber-500" : "text-red-600"
        )}
      />
    );
  if (trend === "down")
    return (
      <ArrowDown
        className={cn(
          "h-3.5 w-3.5",
          status === "good" ? "text-emerald-600" : status === "warn" ? "text-amber-500" : "text-red-600"
        )}
      />
    );
  return <Minus className="h-3.5 w-3.5 text-muted-foreground/50" />;
};

/* ============================================================
   COMPONENT
============================================================ */

export default function GerenciaReporte() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("matrix");

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  // Resumen global
  const summary = useMemo(() => {
    let good = 0, warn = 0, bad = 0;
    projects.forEach((p) => {
      Object.values(p.data).forEach((cell) => {
        if (cell.status === "good") good++;
        else if (cell.status === "warn") warn++;
        else if (cell.status === "bad") bad++;
      });
    });
    return { good, warn, bad, total: good + warn + bad };
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Panel · Gerencia · Reporte Consolidado
          </p>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
            BU Servicios Minería y KRCP
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Matriz consolidada de KPIs por proyecto · Corte: <span className="font-semibold text-foreground">14/04/2026</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyecto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <LlenadoDialog
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                <PencilLine className="h-4 w-4" /> Llenar datos
              </Button>
            }
          />
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Exportar
          </Button>
          <Button size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" /> SharePoint
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Proyectos" value={projects.length.toString()} accent="bg-primary/10 text-primary" />
        <SummaryCard
          label="KPIs en Verde"
          value={`${summary.good}`}
          sub={`${((summary.good / summary.total) * 100).toFixed(0)}% del total`}
          accent="bg-emerald-100 text-emerald-700"
          dot="bg-emerald-500"
        />
        <SummaryCard
          label="En Alerta"
          value={`${summary.warn}`}
          sub={`${((summary.warn / summary.total) * 100).toFixed(0)}% del total`}
          accent="bg-amber-100 text-amber-700"
          dot="bg-amber-400"
        />
        <SummaryCard
          label="Críticos"
          value={`${summary.bad}`}
          sub={`${((summary.bad / summary.total) * 100).toFixed(0)}% del total`}
          accent="bg-red-100 text-red-700"
          dot="bg-red-500"
        />
      </div>

      {/* View selector */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border bg-card">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">Vista:</span>
        <ViewBtn active={view === "matrix"} onClick={() => setView("matrix")} icon={TableIcon} label="Matriz" />
        <ViewBtn active={view === "cards"} onClick={() => setView("cards")} icon={LayoutGrid} label="Opción 1 · Tarjetas" />
        <ViewBtn active={view === "heatmap"} onClick={() => setView("heatmap")} icon={Flame} label="Opción 2 · Heatmap" />
        <ViewBtn active={view === "kanban"} onClick={() => setView("kanban")} icon={Columns3} label="Opción 3 · Kanban" />
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 rounded-lg border bg-card text-sm">
        <span className="font-semibold text-foreground">Leyenda:</span>
        <span className="flex items-center gap-2"><StatusDot status="good" /> Cumple</span>
        <span className="flex items-center gap-2"><StatusDot status="warn" /> En alerta</span>
        <span className="flex items-center gap-2"><StatusDot status="bad" /> Crítico</span>
        <span className="flex items-center gap-2"><StatusDot status="none" /> Sin dato</span>
        <span className="flex items-center gap-2 ml-auto text-muted-foreground">
          <ArrowUp className="h-3.5 w-3.5" /> sube · <ArrowDown className="h-3.5 w-3.5" /> baja · <Minus className="h-3.5 w-3.5" /> estable
        </span>
      </div>

      {/* Matrix */}
      <TooltipProvider delayDuration={150}>
        {view === "matrix" && <MatrixView filtered={filtered} />}
        {view === "cards" && <CardsView filtered={filtered} />}
        {view === "heatmap" && <HeatmapView filtered={filtered} />}
        {view === "kanban" && <KanbanView filtered={filtered} />}
      </TooltipProvider>

      {/* Notas */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-foreground">Notas</div>
        <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
          <li>Negativa Responsable contabilizada desde Setiembre 2025.</li>
          <li>Sobretiempo acumulado del período 04/2025 al 03/2026 (corte 31/03/2026).</li>
          <li>Disponibilidades de Camiones y Palas: promedio del período hasta 14/04/2026.</li>
        </ul>
      </div>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
============================================================ */

function SummaryCard({
  label,
  value,
  sub,
  accent,
  dot,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
  dot?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
      <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center font-bold text-lg", accent)}>
        {dot ? <span className={cn("h-3 w-3 rounded-full", dot)} /> : value.charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold text-foreground leading-tight">{value}</div>
        {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------- View Switch Button ---------- */
function ViewBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutGrid;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/* ============================================================
   VIEW: MATRIX (proyectos verticales, KPIs en columnas)
============================================================ */
function MatrixView({ filtered }: { filtered: Project[] }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="sticky left-0 z-30 bg-card border-b border-r px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[220px]"
              >
                Proyecto / KPI
              </th>
              {groups.map((g) => (
                <th
                  key={g.key}
                  colSpan={g.kpis.length}
                  className={cn(
                    "border-b border-r px-3 py-2 text-white text-xs font-bold uppercase tracking-wider text-center",
                    g.accent
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <g.icon className="h-4 w-4" />
                    {g.label}
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              {groups.flatMap((g) =>
                g.kpis.map((kpi) => (
                  <th
                    key={kpi.key}
                    className="border-b border-r px-3 py-2 bg-primary/5 text-[11px] font-semibold text-primary whitespace-nowrap align-bottom"
                  >
                    <div className="leading-tight">{kpi.label}</div>
                    {kpi.sub && (
                      <div className="text-[10px] font-normal text-muted-foreground normal-case">
                        {kpi.sub}
                      </div>
                    )}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr
                key={p.name}
                className={cn(
                  "transition-colors hover:bg-muted/40 group",
                  idx % 2 === 1 && "bg-muted/20"
                )}
              >
                <td className="sticky left-0 z-20 bg-card group-hover:bg-muted/40 border-r border-b px-4 py-2.5 font-semibold text-foreground text-[13px] whitespace-nowrap">
                  {p.name}
                </td>
                {groups.flatMap((g) =>
                  g.kpis.map((kpi) => {
                    const cell = p.data[kpi.key];
                    if (!cell)
                      return (
                        <td key={kpi.key} className="border-r border-b px-3 py-2.5 text-center text-muted-foreground">
                          —
                        </td>
                      );
                    return (
                      <td key={kpi.key} className="border-r border-b px-3 py-2.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center gap-2 cursor-default">
                              <StatusDot status={cell.status} />
                              <span
                                className={cn(
                                  "font-mono font-semibold tabular-nums text-[13px]",
                                  cell.status === "bad" && "text-red-600",
                                  cell.status === "warn" && "text-amber-600",
                                  cell.status === "good" && "text-foreground",
                                  cell.status === "none" && "text-muted-foreground"
                                )}
                              >
                                {cell.value}
                              </span>
                              <TrendIcon trend={cell.trend} status={cell.status} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <div className="text-xs">
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-muted-foreground">{kpi.label}: {cell.value}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   VIEW A · CARDS (un scorecard por proyecto)
============================================================ */
function CardsView({ filtered }: { filtered: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map((p) => {
        const cells = Object.values(p.data);
        const good = cells.filter((c) => c.status === "good").length;
        const total = cells.filter((c) => c.status !== "none").length;
        const health = total ? Math.round((good / total) * 100) : 0;
        const healthColor =
          health >= 70 ? "bg-emerald-500" : health >= 40 ? "bg-amber-400" : "bg-red-500";

        return (
          <div key={p.name} className="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
            {/* Card header */}
            <div className="px-4 py-3 border-b bg-primary/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-sm">{p.name}</h3>
                <p className="text-[11px] text-muted-foreground">Salud General</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary tabular-nums">{health}%</div>
              </div>
            </div>
            {/* Health bar */}
            <div className="h-1.5 bg-muted">
              <div className={cn("h-full transition-all", healthColor)} style={{ width: `${health}%` }} />
            </div>
            {/* KPIs grid */}
            <div className="p-3 grid grid-cols-3 gap-2 flex-1">
              {groups.flatMap((g) =>
                g.kpis.map((kpi) => {
                  const cell = p.data[kpi.key];
                  if (!cell) return null;
                  return (
                    <div
                      key={kpi.key}
                      className={cn(
                        "rounded-lg border p-2 flex flex-col gap-1 transition-colors",
                        cell.status === "good" && "border-emerald-200 bg-emerald-50/50",
                        cell.status === "warn" && "border-amber-200 bg-amber-50/50",
                        cell.status === "bad" && "border-red-200 bg-red-50/50",
                        cell.status === "none" && "border-border bg-muted/30"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <StatusDot status={cell.status} />
                        <TrendIcon trend={cell.trend} status={cell.status} />
                      </div>
                      <div className="font-mono font-bold text-sm tabular-nums leading-tight">{cell.value}</div>
                      <div className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{kpi.label}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   VIEW B · HEATMAP (densa, fondo de color por celda)
============================================================ */
function HeatmapView({ filtered }: { filtered: Project[] }) {
  const cellBg = (s: Status) =>
    s === "good"
      ? "bg-emerald-500/15 hover:bg-emerald-500/25"
      : s === "warn"
      ? "bg-amber-400/20 hover:bg-amber-400/30"
      : s === "bad"
      ? "bg-red-500/20 hover:bg-red-500/30"
      : "bg-muted/30 hover:bg-muted/50";

  return (
    <div className="rounded-xl border bg-[hsl(220_15%_12%)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs font-mono">
          <thead>
            <tr>
              <th className="sticky left-0 z-30 bg-[hsl(220_15%_12%)] border-b border-white/10 px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-white/60 min-w-[200px]">
                PROYECTO
              </th>
              {groups.flatMap((g) =>
                g.kpis.map((kpi) => (
                  <th
                    key={kpi.key}
                    className="border-b border-l border-white/10 px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 whitespace-nowrap text-center"
                  >
                    {kpi.label}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.name} className="border-b border-white/5">
                <td className="sticky left-0 z-20 bg-[hsl(220_15%_12%)] px-3 py-2 font-bold text-white text-[12px] uppercase tracking-wide">
                  {p.name}
                </td>
                {groups.flatMap((g) =>
                  g.kpis.map((kpi) => {
                    const cell = p.data[kpi.key];
                    if (!cell)
                      return (
                        <td key={kpi.key} className="border-l border-white/5 px-2 py-2 text-center text-white/30">
                          —
                        </td>
                      );
                    return (
                      <td
                        key={kpi.key}
                        className={cn(
                          "border-l border-white/5 px-2 py-2 text-center transition-colors cursor-default",
                          cellBg(cell.status)
                        )}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center gap-1">
                              <span
                                className={cn(
                                  "font-bold tabular-nums",
                                  cell.status === "bad" && "text-red-300",
                                  cell.status === "warn" && "text-amber-200",
                                  cell.status === "good" && "text-emerald-200",
                                  cell.status === "none" && "text-white/40"
                                )}
                              >
                                {cell.value}
                              </span>
                              {cell.trend === "up" && <ArrowUp className="h-3 w-3 text-white/60" />}
                              {cell.trend === "down" && <ArrowDown className="h-3 w-3 text-white/60" />}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-muted-foreground">{kpi.label}: {cell.value}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   VIEW C · KANBAN (3 columnas por estado)
============================================================ */
function KanbanView({ filtered }: { filtered: Project[] }) {
  type Item = { project: string; kpi: string; group: string; cell: Cell };
  const items: Item[] = [];
  filtered.forEach((p) => {
    groups.forEach((g) => {
      g.kpis.forEach((kpi) => {
        const cell = p.data[kpi.key];
        if (cell && cell.status !== "none") {
          items.push({ project: p.name, kpi: kpi.label, group: g.label, cell });
        }
      });
    });
  });

  const cols: { key: Status; label: string; color: string; border: string }[] = [
    { key: "bad", label: "Críticos", color: "bg-red-500", border: "border-red-200" },
    { key: "warn", label: "En alerta", color: "bg-amber-400", border: "border-amber-200" },
    { key: "good", label: "Cumple", color: "bg-emerald-500", border: "border-emerald-200" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {cols.map((col) => {
        const colItems = items.filter((i) => i.cell.status === col.key);
        return (
          <div key={col.key} className="rounded-xl border bg-card overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <span className={cn("h-3 w-3 rounded-full", col.color)} />
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">{col.label}</h3>
              </div>
              <Badge variant="secondary" className="font-mono">{colItems.length}</Badge>
            </div>
            <div className="p-3 space-y-2 max-h-[700px] overflow-y-auto">
              {colItems.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">Sin elementos</p>
              )}
              {colItems.map((it, idx) => (
                <div
                  key={`${it.project}-${it.kpi}-${idx}`}
                  className={cn("rounded-lg border bg-background p-3 hover:shadow-md transition-shadow", col.border)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-semibold text-foreground text-sm leading-tight">{it.project}</div>
                    <TrendIcon trend={it.cell.trend} status={it.cell.status} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mb-1">{it.group} · {it.kpi}</div>
                  <div className="font-mono font-bold text-lg tabular-nums text-foreground">{it.cell.value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
