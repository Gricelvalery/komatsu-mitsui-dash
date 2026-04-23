import { useState, useMemo, ReactNode } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Shield,
  Activity,
  DollarSign,
  Users,
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

const PREVIOUS_CUTOFFS = [
  new Date(2026, 3, 14),
  new Date(2026, 2, 31),
  new Date(2026, 2, 17),
];

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
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Shield;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all",
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
    )}
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
    {active && <Check className="h-3 w-3" />}
  </button>
);

/* ============================================================
   DIALOG
============================================================ */

interface LlenadoDialogProps {
  trigger: ReactNode;
}

export default function LlenadoDialog({ trigger }: LlenadoDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<FillMode>("tabs");
  const [data, setData] = useState<FormState>(buildInitialState());

  const [cutoffHistory, setCutoffHistory] = useState<Date[]>(PREVIOUS_CUTOFFS);
  const [cutoffDate, setCutoffDate] = useState<Date>(getNextCutoff(PREVIOUS_CUTOFFS));

  // Selección de área dentro del dialog (combobox)
  const [lockedAreaKey, setLockedAreaKey] = useState<string>("");
  const lockedArea = useMemo(
    () => areas.find((a) => a.key === lockedAreaKey) || null,
    [lockedAreaKey]
  );

  const updateCell = (
    project: string,
    kpiKey: string,
    patch: Partial<{ value: string; status: Status; comment: string }>
  ) => {
    setData((prev) => ({
      ...prev,
      [project]: {
        ...prev[project],
        [kpiKey]: { ...prev[project][kpiKey], ...patch },
      },
    }));
  };

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
    setCutoffHistory((h) => {
      const updated = [cutoffDate, ...h].slice(0, 6);
      setCutoffDate(addDays(cutoffDate, 14));
      return updated;
    });
    toast({
      title: `Datos de ${lockedArea.label} guardados`,
      description: `Corte ${format(cutoffDate, "dd/MM/yyyy")} registrado · Avance: ${completion.pct}% · Próximo: ${format(addDays(cutoffDate, 14), "dd/MM/yyyy")}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2 mb-1">
            <PencilLine className="h-4 w-4 text-primary" />
            <DialogTitle>Llenado de Datos · Gerencia</DialogTitle>
          </div>
          <DialogDescription>
            Selecciona tu área, llena los KPIs de tus proyectos y registra el corte quincenal.
          </DialogDescription>

          {/* Selector de área + fecha */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 mt-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" /> Área a llenar (control por rol)
              </Label>
              <Select value={lockedAreaKey} onValueChange={setLockedAreaKey}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el área que te corresponde…" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => {
                    const A = a.icon;
                    return (
                      <SelectItem key={a.key} value={a.key}>
                        <div className="flex items-center gap-2">
                          <A className="h-4 w-4" />
                          {a.label}
                          <span className="text-xs text-muted-foreground">
                            · {a.kpis.length} KPI{a.kpis.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-10">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">
                      Fecha de corte
                    </div>
                    <div className="font-bold text-sm">{format(cutoffDate, "dd/MM/yyyy")}</div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[100]" align="end">
                <div className="p-3 border-b text-xs text-muted-foreground max-w-[260px]">
                  Sugerida automáticamente (+14 días desde {format(cutoffHistory[0], "dd/MM/yyyy")}).
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

            <Button
              onClick={handleSave}
              disabled={!lockedArea}
              className="gap-2 h-10"
            >
              <Save className="h-4 w-4" /> Guardar corte
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {!lockedArea ? (
            <EmptyAreaState />
          ) : (
            <>
              {/* Banner área activa */}
              <div className={cn("flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border", lockedArea.color)}>
                <div className="flex items-center gap-2">
                  <lockedArea.icon className="h-5 w-5" />
                  <div>
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      {lockedArea.label}
                      <Lock className="h-3 w-3 opacity-60" />
                    </div>
                    <div className="text-[11px] opacity-80">
                      Solo visible para responsables de esta área · {projectsList.length} proyectos
                    </div>
                  </div>
                </div>
                <div className="sm:ml-auto flex items-center gap-3 w-full sm:w-auto">
                  <Progress value={completion.pct} className="h-2 flex-1 sm:w-40" />
                  <span className="text-xs font-bold whitespace-nowrap">
                    {completion.pct}% · {completion.filled}/{completion.total}
                  </span>
                </div>
              </div>

              {/* Modo de llenado */}
              <div className="rounded-lg border bg-card p-2.5 space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Modo
                  </span>
                  <Badge variant="secondary" className="text-[10px]">4 opciones</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ModeBtn active={mode === "tabs"} onClick={() => setMode("tabs")} icon={LayoutPanelLeft} label="Tabla" />
                  <ModeBtn active={mode === "wizard"} onClick={() => setMode("wizard")} icon={ListChecks} label="Wizard" />
                  <ModeBtn active={mode === "modal"} onClick={() => setMode("modal")} icon={PencilLine} label="Grilla + Modal" />
                  <ModeBtn active={mode === "split"} onClick={() => setMode("split")} icon={SplitSquareHorizontal} label="Acordeón" />
                </div>
              </div>

              {/* Render mode */}
              {mode === "tabs" && <SingleAreaTable area={lockedArea} data={data} updateCell={updateCell} />}
              {mode === "wizard" && <SingleAreaWizard area={lockedArea} data={data} updateCell={updateCell} onSave={handleSave} />}
              {mode === "modal" && <SingleAreaGrid area={lockedArea} data={data} updateCell={updateCell} />}
              {mode === "split" && <SingleAreaAccordion area={lockedArea} data={data} updateCell={updateCell} />}

              {/* Historial */}
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-foreground mb-2">
                  <History className="h-3 w-3" /> Historial de cortes
                  <Badge variant="outline" className="ml-auto gap-1 text-[10px] font-normal">
                    <RefreshCw className="h-2.5 w-2.5" /> Auto +14 días
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cutoffHistory.map((d, i) => (
                    <Badge key={i} variant={i === 0 ? "default" : "secondary"} className="text-[10px]">
                      {format(d, "dd/MM/yyyy", { locale: es })}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-[10px] gap-1 border-dashed">
                    <CalendarIcon className="h-2.5 w-2.5" /> Próximo: {format(addDays(cutoffDate, 14), "dd/MM/yyyy")}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyAreaState() {
  return (
    <div className="rounded-xl border-2 border-dashed bg-muted/20 p-10 text-center space-y-3">
      <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <Lock className="h-7 w-7" />
      </div>
      <h3 className="font-bold text-lg">Selecciona un área para comenzar</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        El formulario se adaptará automáticamente a los KPIs de tu área. Cada responsable solo ve y llena los datos
        de su área; las demás permanecen privadas.
      </p>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {areas.map((a) => {
          const A = a.icon;
          return (
            <Badge key={a.key} variant="outline" className={cn("gap-1.5 py-1.5 px-3", a.color)}>
              <A className="h-3.5 w-3.5" />
              {a.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   OPCIÓN 1 · TABLA
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
                <td className="px-4 py-2 font-medium whitespace-nowrap">{p}</td>
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
   OPCIÓN 2 · WIZARD
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
      <div className="bg-muted/30 px-5 py-3 border-b">
        <div className="flex items-center justify-between mb-2">
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
        )}

        {isLast && (
          <div className="space-y-3 text-center py-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl">Llenado completado</h3>
            <p className="text-sm text-muted-foreground">
              Has revisado los {projectsList.length} proyectos para {area.label}.
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
        <SheetContent className="sm:max-w-md z-[100]">
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
   OPCIÓN 4 · ACORDEÓN
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
