import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Shield,
  Activity,
  DollarSign,
  Users,
  ArrowLeft,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutPanelLeft,
  ListChecks,
  PencilLine,
  SplitSquareHorizontal,
  CircleDot,
  CalendarIcon,
  Lock,
  History,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/* ============================================================
   TYPES & DATA
============================================================ */

type Status = "good" | "warn" | "bad" | "none";
type FillMode = "tabs" | "wizard" | "modal" | "split";

interface KpiDef {
  key: string;
  label: string;
  unit: string;
}

interface AreaDef {
  key: string;
  label: string;
  icon: typeof Shield;
  color: string;
  kpis: KpiDef[];
}

const areas: AreaDef[] = [
  {
    key: "seg",
    label: "Seguridad",
    icon: Shield,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    kpis: [
      { key: "cuasi", label: "Cuasi Accidentes", unit: "N°" },
      { key: "negativa", label: "Negativa Responsable", unit: "N°" },
    ],
  },
  {
    key: "ope",
    label: "Operaciones",
    icon: Activity,
    color: "bg-sky-100 text-sky-700 border-sky-200",
    kpis: [
      { key: "dispCam", label: "Disp. Camiones", unit: "%" },
      { key: "dispPalas", label: "Disp. Palas", unit: "%" },
    ],
  },
  {
    key: "cost",
    label: "Costos y Presupuesto",
    icon: DollarSign,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    kpis: [
      { key: "ventaBP", label: "Venta BP vs Reales", unit: "%" },
      { key: "gpBP", label: "GP BP vs Reales", unit: "%" },
    ],
  },
  {
    key: "rrhh",
    label: "Gestión Humana",
    icon: Users,
    color: "bg-slate-100 text-slate-700 border-slate-200",
    kpis: [
      { key: "aporteHrs", label: "Aporte de Horas", unit: "%" },
      { key: "sobretiempoH", label: "Sobretiempo Acumulado", unit: "Hrs" },
      { key: "sobretiempoP", label: "Sobretiempo Período", unit: "Hrs" },
    ],
  },
];

const projectsList = [
  "Antamina",
  "Las Bambas",
  "Quellaveco",
  "Cerro Verde",
  "Antapaccay",
  "Chinalco",
  "Taller Estructural LJ",
  "Armados Camiones",
  "Armados Palas",
  "KRCP La Joya",
  "KRCP Callao",
  "Operaciones Centralizadas",
];

type FormState = Record<string, Record<string, { value: string; status: Status; comment: string }>>;

const buildInitialState = (): FormState =>
  projectsList.reduce((acc, p) => {
    acc[p] = {};
    areas.forEach((a) => a.kpis.forEach((k) => (acc[p][k.key] = { value: "", status: "none", comment: "" })));
    return acc;
  }, {} as FormState);

/** Historial simulado de fechas de corte (más reciente al inicio) */
const PREVIOUS_CUTOFFS = [
  new Date(2026, 3, 14), // 14/04/2026
  new Date(2026, 2, 31), // 31/03/2026
  new Date(2026, 2, 17), // 17/03/2026
];

/** Calcula la siguiente fecha de corte sumando 14 días a la última */
const getNextCutoff = (history: Date[]) => addDays(history[0], 14);

/* ============================================================
   SHARED UI
============================================================ */

const StatusPill = ({
  status,
  onChange,
}: {
  status: Status;
  onChange: (s: Status) => void;
}) => {
  const opts: { v: Status; label: string; cls: string }[] = [
    { v: "good", label: "Cumple", cls: "bg-emerald-500" },
    { v: "warn", label: "Alerta", cls: "bg-amber-400" },
    { v: "bad", label: "Crítico", cls: "bg-red-500" },
  ];
  return (
    <div className="inline-flex rounded-md border bg-muted/40 p-0.5">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 text-xs rounded transition",
            status === o.v ? "bg-background shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", o.cls)} />
          {o.label}
        </button>
      ))}
    </div>
  );
};

const ModeBtn = ({
  active,
  onClick,
  icon: Icon,
  label,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Shield;
  label: string;
  desc: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex-1 min-w-[180px] text-left rounded-lg border-2 p-3 transition-all",
      active
        ? "border-primary bg-primary/5 shadow-sm"
        : "border-border hover:border-primary/40 hover:bg-muted/40"
    )}
  >
    <div className="flex items-center gap-2 mb-1">
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
      <span className={cn("text-sm font-semibold", active ? "text-primary" : "text-foreground")}>
        {label}
      </span>
      {active && <Check className="h-3.5 w-3.5 text-primary ml-auto" />}
    </div>
    <p className="text-[11px] text-muted-foreground leading-tight">{desc}</p>
  </button>
);

/* ============================================================
   GATE · Selección de área
============================================================ */

function AreaGate({
  cutoffDate,
  onPick,
  cutoffHistory,
}: {
  cutoffDate: Date;
  onPick: (areaKey: string) => void;
  cutoffHistory: Date[];
}) {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/gerencia/reporte"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="h-3 w-3" /> Volver al reporte consolidado
          </Link>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Gerencia · Llenado de Datos
          </p>
          <h1 className="text-3xl font-bold text-foreground">Selecciona tu área</h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Cada responsable solo accede a los KPIs de su área. La información del resto permanece privada.
          </p>
        </div>

        {/* Cutoff banner */}
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Fecha de corte vigente
              </div>
              <div className="text-xl font-bold text-primary">
                {format(cutoffDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Última registrada: {format(cutoffHistory[0], "dd/MM/yyyy")} · ciclo quincenal (+14 días)
              </div>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <RefreshCw className="h-3 w-3" /> Auto-actualizable
          </Badge>
        </div>

        {/* Grid de áreas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {areas.map((a) => {
            const A = a.icon;
            return (
              <button
                key={a.key}
                onClick={() => onPick(a.key)}
                className="group rounded-xl border-2 bg-card p-5 text-left transition-all hover:border-primary hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center mb-3", a.color)}>
                  <A className="h-6 w-6" />
                </div>
                <div className="font-bold text-foreground">{a.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {a.kpis.length} KPI{a.kpis.length > 1 ? "s" : ""} · {projectsList.length} proyectos
                </div>
                <div className="mt-3 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                  Entrar <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Historial */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <History className="h-3.5 w-3.5" /> Últimas fechas de corte
          </div>
          <div className="flex flex-wrap gap-2">
            {cutoffHistory.map((d, i) => (
              <Badge key={i} variant={i === 0 ? "default" : "secondary"} className="text-xs">
                {format(d, "dd/MM/yyyy")} {i === 0 && "· vigente reporte"}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN
============================================================ */

export default function GerenciaLlenado() {
  const { toast } = useToast();
  const [mode, setMode] = useState<FillMode>("tabs");
  const [data, setData] = useState<FormState>(buildInitialState());

  // Fechas de corte
  const [cutoffHistory, setCutoffHistory] = useState<Date[]>(PREVIOUS_CUTOFFS);
  const [cutoffDate, setCutoffDate] = useState<Date>(getNextCutoff(PREVIOUS_CUTOFFS));

  // Área activa (lock). Null = pantalla de selección.
  const [lockedAreaKey, setLockedAreaKey] = useState<string | null>(null);

  const lockedArea = useMemo(
    () => areas.find((a) => a.key === lockedAreaKey) || null,
    [lockedAreaKey]
  );

  const updateCell = (project: string, kpiKey: string, patch: Partial<{ value: string; status: Status; comment: string }>) => {
    setData((prev) => ({
      ...prev,
      [project]: {
        ...prev[project],
        [kpiKey]: { ...prev[project][kpiKey], ...patch },
      },
    }));
  };

  // Avance solo del área activa
  const completion = useMemo(() => {
    if (!lockedArea) return { filled: 0, total: 0, pct: 0 };
    let filled = 0;
    const total = projectsList.length * lockedArea.kpis.length;
    projectsList.forEach((p) =>
      lockedArea.kpis.forEach((k) => {
        if (data[p]?.[k.key]?.value?.trim()) filled++;
      })
    );
    return { filled, total, pct: Math.round((filled / total) * 100) };
  }, [data, lockedArea]);

  const handleSave = () => {
    if (!lockedArea) return;
    // Registra la fecha de corte en el historial y avanza la próxima 14 días
    setCutoffHistory((h) => {
      const updated = [cutoffDate, ...h].slice(0, 6);
      setCutoffDate(addDays(cutoffDate, 14));
      return updated;
    });
    toast({
      title: `Datos de ${lockedArea.label} guardados`,
      description: `Corte ${format(cutoffDate, "dd/MM/yyyy")} registrado · Avance: ${completion.pct}% · Próximo corte: ${format(addDays(cutoffDate, 14), "dd/MM/yyyy")}`,
    });
  };

  // Pantalla de selección
  if (!lockedArea) {
    return <AreaGate cutoffDate={cutoffDate} onPick={setLockedAreaKey} cutoffHistory={cutoffHistory} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <button
            onClick={() => setLockedAreaKey(null)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="h-3 w-3" /> Cambiar área
          </button>
          <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-lg mt-2 border", lockedArea.color)}>
            <lockedArea.icon className="h-4 w-4" />
            <span className="font-bold text-sm">{lockedArea.label}</span>
            <Lock className="h-3 w-3 opacity-60" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-2">
            Captura de KPIs · {lockedArea.label}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Solo ves los KPIs de tu área. Las demás áreas son privadas y se llenan por sus respectivos responsables.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Selector de fecha de corte */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-auto py-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Fecha de corte</div>
                  <div className="font-bold text-sm">{format(cutoffDate, "dd/MM/yyyy")}</div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b text-xs text-muted-foreground">
                Sugerida automáticamente (+14 días desde {format(cutoffHistory[0], "dd/MM/yyyy")}).
                Puedes ajustarla si es necesario.
              </div>
              <Calendar
                mode="single"
                selected={cutoffDate}
                onSelect={(d) => d && setCutoffDate(d)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Avance del área</div>
              <div className="text-2xl font-bold text-primary">{completion.pct}%</div>
            </div>
            <Button onClick={handleSave} size="lg" className="gap-2">
              <Save className="h-4 w-4" /> Guardar corte
            </Button>
          </div>
        </div>
      </div>

      {/* Cinta de progreso del área */}
      <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
        <Progress value={completion.pct} className="h-2 flex-1" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {completion.filled} / {completion.total} celdas llenas
        </span>
      </div>

      {/* Mode selector */}
      <div className="rounded-xl border bg-card p-3 space-y-2">
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Modo de llenado
          </span>
          <Badge variant="secondary" className="text-[10px]">4 opciones</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <ModeBtn
            active={mode === "tabs"}
            onClick={() => setMode("tabs")}
            icon={LayoutPanelLeft}
            label="Opción 1 · Tabla simple"
            desc="Tabla limpia: filas = proyectos, columnas = KPIs del área."
          />
          <ModeBtn
            active={mode === "wizard"}
            onClick={() => setMode("wizard")}
            icon={ListChecks}
            label="Opción 2 · Wizard por proyecto"
            desc="Asistente paso a paso, un proyecto a la vez con barra de progreso."
          />
          <ModeBtn
            active={mode === "modal"}
            onClick={() => setMode("modal")}
            icon={PencilLine}
            label="Opción 3 · Edición por celda"
            desc="Grilla compacta; click en celda abre panel lateral con detalle."
          />
          <ModeBtn
            active={mode === "split"}
            onClick={() => setMode("split")}
            icon={SplitSquareHorizontal}
            label="Opción 4 · Acordeón por proyecto"
            desc="Cada proyecto se expande para mostrar sus KPIs en tarjetas."
          />
        </div>
      </div>

      {/* Render selected mode (siempre solo el área bloqueada) */}
      {mode === "tabs" && <SingleAreaTable area={lockedArea} data={data} updateCell={updateCell} />}
      {mode === "wizard" && <SingleAreaWizard area={lockedArea} data={data} updateCell={updateCell} onSave={handleSave} />}
      {mode === "modal" && <SingleAreaGrid area={lockedArea} data={data} updateCell={updateCell} />}
      {mode === "split" && <SingleAreaAccordion area={lockedArea} data={data} updateCell={updateCell} />}

      {/* Historial de cortes */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground mb-2">
          <History className="h-3.5 w-3.5" /> Historial de cortes registrados
        </div>
        <div className="flex flex-wrap gap-2">
          {cutoffHistory.map((d, i) => (
            <Badge key={i} variant={i === 0 ? "default" : "secondary"} className="text-xs">
              {format(d, "dd/MM/yyyy")}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs gap-1 border-dashed">
            <CalendarIcon className="h-3 w-3" /> Próximo: {format(addDays(cutoffDate, 14), "dd/MM/yyyy")}
          </Badge>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   OPCIÓN 1 · TABLA SIMPLE (un área)
============================================================ */

function SingleAreaTable({
  area,
  data,
  updateCell,
}: {
  area: AreaDef;
  data: FormState;
  updateCell: (p: string, k: string, patch: any) => void;
}) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className={cn("flex items-center gap-3 px-5 py-3 border-b", area.color)}>
        <area.icon className="h-5 w-5" />
        <div>
          <h3 className="font-bold">{area.label}</h3>
          <p className="text-xs opacity-80">
            {area.kpis.length} KPI{area.kpis.length > 1 ? "s" : ""} · {projectsList.length} proyectos
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Proyecto</th>
              {area.kpis.map((k) => (
                <th key={k.key} className="text-left px-4 py-2 font-semibold">
                  {k.label} <span className="text-muted-foreground/60">({k.unit})</span>
                </th>
              ))}
              <th className="text-left px-4 py-2 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {projectsList.map((p, i) => (
              <tr key={p} className={cn("border-t", i % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                <td className="px-4 py-2 font-medium">{p}</td>
                {area.kpis.map((k) => (
                  <td key={k.key} className="px-4 py-2">
                    <Input
                      type="number"
                      value={data[p][k.key].value}
                      onChange={(e) => updateCell(p, k.key, { value: e.target.value })}
                      className="h-8 w-28"
                      placeholder="0"
                    />
                  </td>
                ))}
                <td className="px-4 py-2">
                  <StatusPill
                    status={data[p][area.kpis[0].key].status}
                    onChange={(s) => area.kpis.forEach((k) => updateCell(p, k.key, { status: s }))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   OPCIÓN 2 · WIZARD POR PROYECTO
============================================================ */

function SingleAreaWizard({
  area,
  data,
  updateCell,
  onSave,
}: {
  area: AreaDef;
  data: FormState;
  updateCell: (p: string, k: string, patch: any) => void;
  onSave: () => void;
}) {
  const [step, setStep] = useState(0);
  const isLast = step === projectsList.length;
  const project = projectsList[step];

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="bg-muted/30 px-5 py-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">
            Proyecto {Math.min(step + 1, projectsList.length)} de {projectsList.length}
            {!isLast && project && <span className="text-muted-foreground"> · {project}</span>}
          </div>
          <div className="text-xs text-muted-foreground">{area.label}</div>
        </div>
        <Progress value={((step + 1) / (projectsList.length + 1)) * 100} className="h-2" />
      </div>

      <div className="p-5">
        {!isLast && project && (
          <>
            <div className={cn("flex items-center gap-3 p-3 rounded-lg mb-4", area.color)}>
              <area.icon className="h-6 w-6" />
              <div>
                <h3 className="font-bold text-lg">{project}</h3>
                <p className="text-xs opacity-80">Llena los {area.kpis.length} KPIs de {area.label}</p>
              </div>
            </div>
            <div className="space-y-3">
              {area.kpis.map((k) => (
                <div key={k.key} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                  <Label className="text-sm font-semibold">
                    {k.label} <span className="text-muted-foreground">({k.unit})</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                    <Input
                      type="number"
                      value={data[project][k.key].value}
                      onChange={(e) => updateCell(project, k.key, { value: e.target.value })}
                      placeholder="0"
                    />
                    <StatusPill
                      status={data[project][k.key].status}
                      onChange={(s) => updateCell(project, k.key, { status: s })}
                    />
                  </div>
                  <Textarea
                    value={data[project][k.key].comment}
                    onChange={(e) => updateCell(project, k.key, { comment: e.target.value })}
                    placeholder="Comentario opcional..."
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {isLast && (
          <div className="space-y-3 text-center py-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl">Llenado completado</h3>
            <p className="text-sm text-muted-foreground">
              Has revisado los {projectsList.length} proyectos para {area.label}. Guarda para registrar el corte.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-3">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        {!isLast ? (
          <Button onClick={() => setStep((s) => s + 1)} className="gap-2">
            Siguiente <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onSave} className="gap-2">
            <Save className="h-4 w-4" /> Guardar corte
          </Button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   OPCIÓN 3 · GRILLA + MODAL
============================================================ */

function SingleAreaGrid({
  area,
  data,
  updateCell,
}: {
  area: AreaDef;
  data: FormState;
  updateCell: (p: string, k: string, patch: any) => void;
}) {
  const [editing, setEditing] = useState<{ project: string; kpiKey: string } | null>(null);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className={cn("px-5 py-3 border-b flex items-center gap-3", area.color)}>
        <area.icon className="h-5 w-5" />
        <div>
          <h3 className="font-bold">{area.label} · Grilla editable</h3>
          <p className="text-xs opacity-80">Click en cualquier celda para editar valor, estado y comentario.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/60">
            <tr>
              <th className="sticky left-0 bg-muted/80 backdrop-blur text-left px-3 py-2 font-bold uppercase tracking-wider">
                Proyecto
              </th>
              {area.kpis.map((k) => (
                <th key={k.key} className="text-center px-3 py-2 font-medium text-muted-foreground border-l">
                  {k.label}
                  <div className="text-[10px] opacity-60">({k.unit})</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectsList.map((p, i) => (
              <tr key={p} className={cn("border-t", i % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                <td className="sticky left-0 bg-inherit px-3 py-2 font-semibold whitespace-nowrap">{p}</td>
                {area.kpis.map((k) => {
                  const cell = data[p][k.key];
                  const dotMap: Record<Status, string> = {
                    good: "bg-emerald-500",
                    warn: "bg-amber-400",
                    bad: "bg-red-500",
                    none: "bg-muted",
                  };
                  return (
                    <td key={k.key} className="px-1 py-1 border-l">
                      <button
                        type="button"
                        onClick={() => setEditing({ project: p, kpiKey: k.key })}
                        className="w-full px-2 py-1.5 rounded hover:bg-primary/10 hover:ring-1 hover:ring-primary transition flex items-center justify-between gap-2 group"
                      >
                        <span className={cn("font-mono", !cell.value && "text-muted-foreground/50 italic")}>
                          {cell.value || "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className={cn("h-2 w-2 rounded-full", dotMap[cell.status])} />
                          <PencilLine className="h-3 w-3 opacity-0 group-hover:opacity-60 transition" />
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="sm:max-w-md">
          {editing && (() => {
            const kpi = area.kpis.find((k) => k.key === editing.kpiKey)!;
            const cell = data[editing.project][editing.kpiKey];
            return (
              <>
                <SheetHeader>
                  <div className={cn("inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold w-fit", area.color)}>
                    <area.icon className="h-3.5 w-3.5" /> {area.label}
                  </div>
                  <SheetTitle>{kpi.label}</SheetTitle>
                  <SheetDescription>
                    Proyecto: <span className="font-semibold text-foreground">{editing.project}</span>
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 mt-6">
                  <div>
                    <Label>Valor ({kpi.unit})</Label>
                    <Input
                      type="number"
                      value={cell.value}
                      onChange={(e) => updateCell(editing.project, editing.kpiKey, { value: e.target.value })}
                      className="mt-1"
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label>Estado / Semáforo</Label>
                    <div className="mt-2">
                      <StatusPill status={cell.status} onChange={(s) => updateCell(editing.project, editing.kpiKey, { status: s })} />
                    </div>
                  </div>
                  <div>
                    <Label>Comentario (opcional)</Label>
                    <Textarea
                      value={cell.comment}
                      onChange={(e) => updateCell(editing.project, editing.kpiKey, { comment: e.target.value })}
                      placeholder="Justifica el valor o describe el contexto..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <SheetFooter className="mt-6">
                  <Button onClick={() => setEditing(null)} className="w-full gap-2">
                    <Check className="h-4 w-4" /> Aplicar
                  </Button>
                </SheetFooter>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ============================================================
   OPCIÓN 4 · ACORDEÓN POR PROYECTO
============================================================ */

function SingleAreaAccordion({
  area,
  data,
  updateCell,
}: {
  area: AreaDef;
  data: FormState;
  updateCell: (p: string, k: string, patch: any) => void;
}) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className={cn("px-5 py-3 border-b flex items-center gap-3", area.color)}>
        <area.icon className="h-5 w-5" />
        <div>
          <h3 className="font-bold">{area.label} · Acordeón por proyecto</h3>
          <p className="text-[11px] opacity-80">Expande cada proyecto para llenar sus KPIs</p>
        </div>
      </div>

      <Accordion type="multiple" className="px-2">
        {projectsList.map((p) => {
          const filledCount = area.kpis.filter((k) => data[p][k.key].value.trim()).length;
          const complete = filledCount === area.kpis.length;
          return (
            <AccordionItem key={p} value={p} className="border-b last:border-0">
              <AccordionTrigger className="px-3 hover:no-underline hover:bg-muted/40 rounded">
                <div className="flex items-center gap-3 flex-1">
                  <CircleDot className={cn("h-3.5 w-3.5", complete ? "text-emerald-500" : "text-muted-foreground/40")} />
                  <span className="font-semibold text-sm">{p}</span>
                  <Badge variant="outline" className="ml-auto mr-2 text-[10px]">
                    {filledCount}/{area.kpis.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {area.kpis.map((k) => (
                    <div key={k.key} className="rounded-lg border bg-muted/20 p-3 space-y-2">
                      <Label className="text-xs font-semibold">
                        {k.label} <span className="text-muted-foreground">({k.unit})</span>
                      </Label>
                      <Input
                        type="number"
                        value={data[p][k.key].value}
                        onChange={(e) => updateCell(p, k.key, { value: e.target.value })}
                        placeholder="0"
                      />
                      <StatusPill
                        status={data[p][k.key].status}
                        onChange={(s) => updateCell(p, k.key, { status: s })}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
