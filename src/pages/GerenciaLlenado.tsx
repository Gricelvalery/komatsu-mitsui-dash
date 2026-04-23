import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  color: string; // tailwind chip
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

const initialState: FormState = projectsList.reduce((acc, p) => {
  acc[p] = {};
  areas.forEach((a) => a.kpis.forEach((k) => (acc[p][k.key] = { value: "", status: "none", comment: "" })));
  return acc;
}, {} as FormState);

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
   MAIN
============================================================ */

export default function GerenciaLlenado() {
  const { toast } = useToast();
  const [mode, setMode] = useState<FillMode>("tabs");
  const [data, setData] = useState<FormState>(initialState);

  const updateCell = (project: string, kpiKey: string, patch: Partial<{ value: string; status: Status; comment: string }>) => {
    setData((prev) => ({
      ...prev,
      [project]: {
        ...prev[project],
        [kpiKey]: { ...prev[project][kpiKey], ...patch },
      },
    }));
  };

  const completion = useMemo(() => {
    const totalsByArea: Record<string, { filled: number; total: number }> = {};
    areas.forEach((a) => {
      let filled = 0;
      const total = projectsList.length * a.kpis.length;
      projectsList.forEach((p) =>
        a.kpis.forEach((k) => {
          if (data[p]?.[k.key]?.value?.trim()) filled++;
        })
      );
      totalsByArea[a.key] = { filled, total };
    });
    const totalFilled = Object.values(totalsByArea).reduce((s, x) => s + x.filled, 0);
    const totalAll = Object.values(totalsByArea).reduce((s, x) => s + x.total, 0);
    return { byArea: totalsByArea, pct: Math.round((totalFilled / totalAll) * 100) };
  }, [data]);

  const handleSave = () => {
    toast({
      title: "Datos guardados",
      description: `Avance global: ${completion.pct}%. Información sincronizada con el reporte de gerencia.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <Link
            to="/gerencia/reporte"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="h-3 w-3" /> Volver al reporte consolidado
          </Link>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-2">
            Gerencia · Llenado de Datos por Área
          </p>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
            Captura de KPIs · Seguridad · Operaciones · Costos · GH
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona el método de llenado que mejor se adapte a tu flujo de trabajo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Avance global</div>
            <div className="text-2xl font-bold text-primary">{completion.pct}%</div>
          </div>
          <Button onClick={handleSave} size="lg" className="gap-2">
            <Save className="h-4 w-4" /> Guardar
          </Button>
        </div>
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
            label="Opción 1 · Tabs por área"
            desc="Una pestaña por área. Formulario limpio enfocado para cada responsable."
          />
          <ModeBtn
            active={mode === "wizard"}
            onClick={() => setMode("wizard")}
            icon={ListChecks}
            label="Opción 2 · Wizard 4 pasos"
            desc="Asistente paso a paso con barra de progreso. Ideal para llenado mensual."
          />
          <ModeBtn
            active={mode === "modal"}
            onClick={() => setMode("modal")}
            icon={PencilLine}
            label="Opción 3 · Edición por celda"
            desc="Matriz tipo grilla; click en celda abre modal de edición. Rápido y puntual."
          />
          <ModeBtn
            active={mode === "split"}
            onClick={() => setMode("split")}
            icon={SplitSquareHorizontal}
            label="Opción 4 · Split panel"
            desc="Lista de áreas a la izquierda con pendientes; formulario por proyecto a la derecha."
          />
        </div>
      </div>

      {/* Render selected mode */}
      {mode === "tabs" && <TabsMode data={data} updateCell={updateCell} completion={completion} />}
      {mode === "wizard" && <WizardMode data={data} updateCell={updateCell} completion={completion} onSave={handleSave} />}
      {mode === "modal" && <ModalMode data={data} updateCell={updateCell} />}
      {mode === "split" && <SplitMode data={data} updateCell={updateCell} completion={completion} />}
    </div>
  );
}

/* ============================================================
   OPCIÓN 1 · TABS POR ÁREA
============================================================ */

function TabsMode({
  data,
  updateCell,
  completion,
}: {
  data: FormState;
  updateCell: (p: string, k: string, patch: any) => void;
  completion: { byArea: Record<string, { filled: number; total: number }>; pct: number };
}) {
  return (
    <Tabs defaultValue={areas[0].key} className="space-y-4">
      <TabsList className="h-auto p-1 bg-muted/50 flex-wrap">
        {areas.map((a) => {
          const A = a.icon;
          const c = completion.byArea[a.key];
          return (
            <TabsTrigger key={a.key} value={a.key} className="gap-2 data-[state=active]:bg-background">
              <A className="h-4 w-4" />
              <span>{a.label}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] h-5">
                {c.filled}/{c.total}
              </Badge>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {areas.map((a) => (
        <TabsContent key={a.key} value={a.key} className="rounded-xl border bg-card overflow-hidden">
          <div className={cn("flex items-center gap-3 px-5 py-3 border-b", a.color)}>
            <a.icon className="h-5 w-5" />
            <div>
              <h3 className="font-bold">{a.label}</h3>
              <p className="text-xs opacity-80">
                {a.kpis.length} KPI{a.kpis.length > 1 ? "s" : ""} · {projectsList.length} proyectos
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Proyecto</th>
                  {a.kpis.map((k) => (
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
                    {a.kpis.map((k) => (
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
                        status={data[p][a.kpis[0].key].status}
                        onChange={(s) => a.kpis.forEach((k) => updateCell(p, k.key, { status: s }))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

/* ============================================================
   OPCIÓN 2 · WIZARD 4 PASOS
============================================================ */

function WizardMode({
  data,
  updateCell,
  completion,
  onSave,
}: {
  data: FormState;
  updateCell: (p: string, k: string, patch: any) => void;
  completion: { byArea: Record<string, { filled: number; total: number }>; pct: number };
  onSave: () => void;
}) {
  const [step, setStep] = useState(0);
  const isLast = step === areas.length;
  const area = areas[step];

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Progress bar with steps */}
      <div className="bg-muted/30 px-5 py-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">
            Paso {Math.min(step + 1, areas.length + 1)} de {areas.length + 1}
          </div>
          <div className="text-xs text-muted-foreground">Avance global: {completion.pct}%</div>
        </div>
        <Progress value={((step + 1) / (areas.length + 1)) * 100} className="h-2" />
        <div className="flex items-center justify-between mt-3">
          {areas.map((a, idx) => {
            const A = a.icon;
            const done = idx < step;
            const active = idx === step;
            return (
              <div key={a.key} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition",
                    done && "bg-emerald-500 text-white",
                    active && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !done && !active && "bg-muted text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : <A className="h-4 w-4" />}
                </div>
                <span className={cn("text-[10px] mt-1 text-center", active && "font-semibold text-primary")}>
                  {a.label}
                </span>
              </div>
            );
          })}
          <div className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                isLast ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
              )}
            >
              <Check className="h-4 w-4" />
            </div>
            <span className={cn("text-[10px] mt-1", isLast && "font-semibold text-primary")}>Resumen</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {!isLast && area && (
          <>
            <div className={cn("flex items-center gap-3 p-3 rounded-lg mb-4", area.color)}>
              <area.icon className="h-6 w-6" />
              <div>
                <h3 className="font-bold text-lg">{area.label}</h3>
                <p className="text-xs opacity-80">Llena los {area.kpis.length} KPIs para los {projectsList.length} proyectos</p>
              </div>
            </div>
            <div className="space-y-2">
              {projectsList.map((p) => (
                <div key={p} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className="font-semibold text-sm flex items-center">{p}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {area.kpis.map((k) => (
                      <div key={k.key}>
                        <Label className="text-[11px] text-muted-foreground">
                          {k.label} ({k.unit})
                        </Label>
                        <Input
                          type="number"
                          value={data[p][k.key].value}
                          onChange={(e) => updateCell(p, k.key, { value: e.target.value })}
                          className="h-8"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {isLast && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Resumen final</h3>
            <p className="text-sm text-muted-foreground">Revisa el avance por área antes de guardar.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {areas.map((a) => {
                const c = completion.byArea[a.key];
                const pct = Math.round((c.filled / c.total) * 100);
                return (
                  <div key={a.key} className={cn("rounded-lg border p-3", a.color)}>
                    <div className="flex items-center gap-2 mb-2">
                      <a.icon className="h-4 w-4" />
                      <span className="text-sm font-semibold">{a.label}</span>
                    </div>
                    <div className="text-2xl font-bold">{pct}%</div>
                    <div className="text-[11px] opacity-80">{c.filled} de {c.total} celdas</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
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
            <Save className="h-4 w-4" /> Guardar todo
          </Button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   OPCIÓN 3 · MATRIZ + MODAL DE EDICIÓN
============================================================ */

function ModalMode({
  data,
  updateCell,
}: {
  data: FormState;
  updateCell: (p: string, k: string, patch: any) => void;
}) {
  const [editing, setEditing] = useState<{ project: string; areaKey: string; kpiKey: string } | null>(null);

  const allKpis = areas.flatMap((a) => a.kpis.map((k) => ({ ...k, areaKey: a.key, areaLabel: a.label })));

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b flex items-center justify-between">
        <div>
          <h3 className="font-bold">Matriz editable · Click en cualquier celda</h3>
          <p className="text-xs text-muted-foreground">Edita valores rápidamente sin perder vista global.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted/60">
            <tr>
              <th className="sticky left-0 bg-muted/80 backdrop-blur text-left px-3 py-2 font-bold uppercase tracking-wider">
                Proyecto
              </th>
              {areas.map((a) => (
                <th key={a.key} colSpan={a.kpis.length} className={cn("text-center px-3 py-2 font-bold uppercase tracking-wider border-l", a.color)}>
                  <div className="flex items-center justify-center gap-1.5">
                    <a.icon className="h-3.5 w-3.5" />
                    {a.label}
                  </div>
                </th>
              ))}
            </tr>
            <tr className="border-t">
              <th className="sticky left-0 bg-muted/40"></th>
              {allKpis.map((k) => (
                <th key={`${k.areaKey}-${k.key}`} className="text-center px-3 py-2 font-medium normal-case text-muted-foreground border-l">
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
                {allKpis.map((k) => {
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
                        onClick={() => setEditing({ project: p, areaKey: k.areaKey, kpiKey: k.key })}
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

      {/* Edit sheet */}
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="sm:max-w-md">
          {editing && (() => {
            const area = areas.find((a) => a.key === editing.areaKey)!;
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
   OPCIÓN 4 · SPLIT PANEL
============================================================ */

function SplitMode({
  data,
  updateCell,
  completion,
}: {
  data: FormState;
  updateCell: (p: string, k: string, patch: any) => void;
  completion: { byArea: Record<string, { filled: number; total: number }>; pct: number };
}) {
  const [areaKey, setAreaKey] = useState(areas[0].key);
  const area = areas.find((a) => a.key === areaKey)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      {/* Lista de áreas */}
      <div className="rounded-xl border bg-card overflow-hidden h-fit">
        <div className="px-4 py-3 border-b bg-muted/40">
          <h3 className="text-sm font-bold">Áreas</h3>
          <p className="text-[11px] text-muted-foreground">Selecciona un área para llenar</p>
        </div>
        <div className="p-2 space-y-1">
          {areas.map((a) => {
            const A = a.icon;
            const c = completion.byArea[a.key];
            const pending = c.total - c.filled;
            const active = areaKey === a.key;
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => setAreaKey(a.key)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                <A className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{a.label}</div>
                  <div className={cn("text-[11px]", active ? "opacity-90" : "text-muted-foreground")}>
                    {c.filled} / {c.total} llenos
                  </div>
                </div>
                {pending > 0 && (
                  <Badge variant={active ? "secondary" : "destructive"} className="text-[10px]">
                    {pending}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulario por proyecto */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className={cn("px-5 py-3 border-b flex items-center gap-3", area.color)}>
          <area.icon className="h-5 w-5" />
          <div>
            <h3 className="font-bold">{area.label}</h3>
            <p className="text-[11px] opacity-80">Expande cada proyecto para llenar sus KPIs</p>
          </div>
        </div>

        <Accordion type="multiple" className="px-2">
          {projectsList.map((p) => {
            const filledCount = area.kpis.filter((k) => data[p][k.key].value.trim()).length;
            return (
              <AccordionItem key={p} value={p} className="border-b last:border-0">
                <AccordionTrigger className="px-3 hover:no-underline hover:bg-muted/40 rounded">
                  <div className="flex items-center gap-3 flex-1">
                    <CircleDot className={cn("h-3.5 w-3.5", filledCount === area.kpis.length ? "text-emerald-500" : "text-muted-foreground/40")} />
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
    </div>
  );
}
