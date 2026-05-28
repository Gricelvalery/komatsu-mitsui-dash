import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Trash2, Copy, Search, Save, RefreshCw, Loader2 } from "lucide-react";
import {
  STATUS_META, PRIORITY_META, STATUS_OPTIONS, PRIORITY_OPTIONS,
  formatCurrency, generateSolpedCode,
} from "@/lib/solpeds";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  project_id: string | null;
  code: string;
  date: string;
  requester_id: string;
  requester_name: string | null;
  cost_center: string | null;
  description: string | null;
  amount: number;
  priority: string;
  status: string;
  observations: string | null;
  _dirty?: boolean;
  _saving?: boolean;
  _new?: boolean;
};

const COLUMNS = [
  { key: "code", label: "Código SOLPED", w: 140, type: "text" as const },
  { key: "date", label: "Fecha", w: 130, type: "date" as const },
  { key: "project_id", label: "Proyecto", w: 180, type: "project" as const },
  { key: "requester_name", label: "Solicitante", w: 160, type: "text" as const },
  { key: "cost_center", label: "Centro de costo", w: 140, type: "text" as const },
  { key: "description", label: "Descripción", w: 280, type: "text" as const },
  { key: "amount", label: "Monto", w: 130, type: "number" as const },
  { key: "priority", label: "Prioridad", w: 130, type: "priority" as const },
  { key: "status", label: "Estado", w: 140, type: "status" as const },
  { key: "observations", label: "Observaciones", w: 220, type: "text" as const },
];

export default function SolpedsGrid() {
  const { user, isAdmin } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [projects, setProjects] = useState<{ id: string; code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: ps }, { data: ss }] = await Promise.all([
      supabase.from("projects").select("id,code,name").order("code"),
      supabase.from("solpeds").select("*").order("created_at", { ascending: false }),
    ]);
    setProjects(ps ?? []);
    setRows((ss ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Realtime
  useEffect(() => {
    const ch = supabase.channel("solpeds-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "solpeds" }, (payload) => {
        setRows((prev) => {
          if (payload.eventType === "DELETE") return prev.filter((r) => r.id !== (payload.old as any).id);
          const next = payload.new as Row;
          const idx = prev.findIndex((r) => r.id === next.id);
          if (idx === -1) return [next, ...prev];
          const copy = [...prev]; copy[idx] = { ...copy[idx], ...next, _dirty: false }; return copy;
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((r) => {
      if (q) {
        const blob = `${r.code} ${r.description ?? ""} ${r.requester_name ?? ""} ${r.cost_center ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      for (const [k, v] of Object.entries(filters)) {
        if (v && String((r as any)[k] ?? "") !== v) return false;
      }
      return true;
    });
  }, [rows, search, filters]);

  const updateLocal = (id: string, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch, _dirty: true } : r)));
  };

  const saveRow = async (id: string) => {
    const r = rows.find((x) => x.id === id);
    if (!r || !r._dirty) return;
    if (!r.project_id) { toast.error("Selecciona un proyecto"); return; }
    setRows((prev) => prev.map((x) => (x.id === id ? { ...x, _saving: true } : x)));
    const payload: any = {
      project_id: r.project_id,
      code: r.code || generateSolpedCode(),
      date: r.date,
      requester_id: user!.id,
      requester_name: r.requester_name,
      cost_center: r.cost_center,
      description: r.description,
      amount: Number(r.amount) || 0,
      priority: r.priority,
      status: r.status,
      observations: r.observations,
    };
    let res;
    if (r._new) {
      res = await supabase.from("solpeds").insert(payload).select().single();
    } else {
      res = await supabase.from("solpeds").update(payload).eq("id", id).select().single();
    }
    if (res.error) {
      toast.error("Error al guardar: " + res.error.message);
      setRows((prev) => prev.map((x) => (x.id === id ? { ...x, _saving: false } : x)));
    } else {
      const saved = res.data as Row;
      setRows((prev) => prev.map((x) => (x.id === id ? { ...saved, _dirty: false, _saving: false, _new: false } : x)));
      toast.success("SOLPED guardada", { duration: 1500 });
    }
  };

  const addRow = () => {
    const tempId = `tmp-${Date.now()}`;
    setRows((prev) => [
      {
        id: tempId,
        project_id: projects[0]?.id ?? null,
        code: generateSolpedCode(),
        date: new Date().toISOString().slice(0, 10),
        requester_id: user!.id,
        requester_name: user!.email ?? "",
        cost_center: "",
        description: "",
        amount: 0,
        priority: "media",
        status: "pendiente",
        observations: "",
        _new: true,
        _dirty: true,
      },
      ...prev,
    ]);
  };

  const duplicateRow = (id: string) => {
    const r = rows.find((x) => x.id === id);
    if (!r) return;
    setRows((prev) => [
      { ...r, id: `tmp-${Date.now()}`, code: generateSolpedCode(), _new: true, _dirty: true, status: "pendiente" },
      ...prev,
    ]);
  };

  const deleteRow = async (id: string) => {
    const r = rows.find((x) => x.id === id);
    if (!r) return;
    if (r._new) { setRows((prev) => prev.filter((x) => x.id !== id)); return; }
    const { error } = await supabase.from("solpeds").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      setRows((prev) => prev.filter((x) => x.id !== id));
      toast.success("Eliminado");
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    if (!text.includes("\t") && !text.includes("\n")) return;
    e.preventDefault();
    const lines = text.trim().split(/\r?\n/);
    const newRows: Row[] = lines.map((line) => {
      const cells = line.split("\t");
      const [code, date, projectCode, requester, cc, desc, amount, prio, status, obs] = cells;
      const proj = projects.find((p) => p.code === projectCode || p.name === projectCode);
      return {
        id: `tmp-${Date.now()}-${Math.random()}`,
        project_id: proj?.id ?? projects[0]?.id ?? null,
        code: code || generateSolpedCode(),
        date: date || new Date().toISOString().slice(0, 10),
        requester_id: user!.id,
        requester_name: requester || user!.email || "",
        cost_center: cc || "",
        description: desc || "",
        amount: parseFloat(amount?.replace(/[^\d.-]/g, "") || "0") || 0,
        priority: PRIORITY_OPTIONS.includes(prio) ? prio : "media",
        status: STATUS_OPTIONS.includes(status) ? status : "pendiente",
        observations: obs || "",
        _new: true,
        _dirty: true,
      };
    });
    setRows((prev) => [...newRows, ...prev]);
    toast.success(`${newRows.length} filas pegadas. Pulsa "Guardar todo" para enviar.`);
  };

  const saveAll = async () => {
    const dirty = rows.filter((r) => r._dirty);
    if (dirty.length === 0) { toast.info("No hay cambios"); return; }
    for (const r of dirty) await saveRow(r.id);
  };

  const cellInputClass = "h-8 px-2 py-0 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-none w-full";

  const dirtyCount = rows.filter((r) => r._dirty).length;

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Registro de SOLPEDs
          </h1>
          <p className="text-sm text-muted-foreground">
            Edición tipo Excel. Pega desde Excel, navega con Tab, autoguarda al salir de la celda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirtyCount > 0 && <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-500/30">{dirtyCount} sin guardar</Badge>}
          <Button onClick={saveAll} variant="default" size="sm" disabled={dirtyCount === 0}>
            <Save className="w-4 h-4" /> Guardar todo
          </Button>
          <Button onClick={fetchAll} variant="outline" size="sm"><RefreshCw className="w-4 h-4" /></Button>
        </div>
      </div>

      <Card className="p-3 flex flex-wrap items-center gap-3 backdrop-blur-sm bg-card/80">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar código, descripción, solicitante..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filters.status ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, status: v === "all" ? "" : v }))}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.project_id ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, project_id: v === "all" ? "" : v }))}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Proyecto" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los proyectos</SelectItem>
            {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.code} — {p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={addRow} size="sm" disabled={projects.length === 0}><Plus className="w-4 h-4" /> Nueva fila</Button>
      </Card>

      {projects.length === 0 && !loading && (
        <Card className="p-4 border-orange-500/40 bg-orange-500/5">
          <p className="text-sm">
            No hay proyectos aún. {isAdmin ? <>Crea uno en <a href="/presupuestos" className="text-primary underline">Presupuestos</a>.</> : "Pide a un administrador que cree proyectos."}
          </p>
        </Card>
      )}

      <Card className="overflow-hidden" onPaste={handlePaste}>
        <div className="overflow-auto max-h-[calc(100vh-300px)]" ref={containerRef}>
          <table className="text-xs border-collapse min-w-full">
            <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur">
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c.key} style={{ minWidth: c.w, width: c.w }} className="text-left font-semibold px-2 py-2 border-b border-r border-border">
                    {c.label}
                  </th>
                ))}
                <th className="w-20 px-2 py-2 border-b border-border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={COLUMNS.length + 1} className="text-center py-12"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Cargando...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={COLUMNS.length + 1} className="text-center py-12 text-muted-foreground">Sin SOLPEDs. Pulsa "Nueva fila" o pega desde Excel.</td></tr>
              )}
              {filtered.map((r) => {
                const statusMeta = STATUS_META[r.status];
                return (
                  <tr key={r.id} className={cn("border-b border-border/60 hover:bg-muted/40 transition-colors", r._dirty && "bg-orange-500/5")}>
                    {COLUMNS.map((c) => {
                      const val = (r as any)[c.key];
                      return (
                        <td key={c.key} style={{ minWidth: c.w, width: c.w }} className="border-r border-border/40 p-0 align-middle">
                          {c.type === "text" && (
                            <input className={cellInputClass} value={val ?? ""} onChange={(e) => updateLocal(r.id, { [c.key]: e.target.value } as any)} onBlur={() => saveRow(r.id)} />
                          )}
                          {c.type === "date" && (
                            <input type="date" className={cellInputClass} value={val ?? ""} onChange={(e) => updateLocal(r.id, { date: e.target.value })} onBlur={() => saveRow(r.id)} />
                          )}
                          {c.type === "number" && (
                            <input type="number" step="0.01" className={cn(cellInputClass, "text-right tabular-nums")} value={val ?? 0} onChange={(e) => updateLocal(r.id, { amount: parseFloat(e.target.value) || 0 })} onBlur={() => saveRow(r.id)} title={formatCurrency(Number(val))} />
                          )}
                          {c.type === "project" && (
                            <select className={cellInputClass} value={val ?? ""} onChange={(e) => { updateLocal(r.id, { project_id: e.target.value }); }} onBlur={() => saveRow(r.id)}>
                              <option value="">—</option>
                              {projects.map((p) => <option key={p.id} value={p.id}>{p.code}</option>)}
                            </select>
                          )}
                          {c.type === "priority" && (
                            <select className={cn(cellInputClass, PRIORITY_META[val]?.cls, "font-medium")} value={val} onChange={(e) => updateLocal(r.id, { priority: e.target.value })} onBlur={() => saveRow(r.id)}>
                              {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
                            </select>
                          )}
                          {c.type === "status" && (
                            <div className="px-1.5">
                              <span className={cn("inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold", statusMeta?.cls)}>{statusMeta?.label}</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {r._saving && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateRow(r.id)} title="Duplicar"><Copy className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setConfirmDelete(r.id)} title="Eliminar"><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Tips: <kbd className="px-1.5 py-0.5 rounded border bg-muted">Tab</kbd> moverse · <kbd className="px-1.5 py-0.5 rounded border bg-muted">Ctrl+V</kbd> pegar desde Excel (columnas en orden: Código, Fecha, Cod.Proyecto, Solicitante, CC, Descripción, Monto, Prioridad, Estado, Observaciones)
      </p>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar SOLPED?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (confirmDelete) deleteRow(confirmDelete); setConfirmDelete(null); }}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
