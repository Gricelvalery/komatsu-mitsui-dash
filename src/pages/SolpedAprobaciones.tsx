import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Clock, History, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_META, PRIORITY_META, formatCurrency } from "@/lib/solpeds";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type S = any;

export default function SolpedAprobaciones() {
  const { user } = useAuth();
  const [items, setItems] = useState<S[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [filterProj, setFilterProj] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionSolped, setActionSolped] = useState<S | null>(null);
  const [actionType, setActionType] = useState<"liberado" | "rechazado" | "observado" | null>(null);
  const [comment, setComment] = useState("");
  const [historyOf, setHistoryOf] = useState<S | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const [{ data: s }, { data: p }] = await Promise.all([
      supabase.from("solpeds").select("*").in("status", ["pendiente", "en_revision", "observado"]).order("created_at", { ascending: false }),
      supabase.from("projects").select("id,code,name"),
    ]);
    setItems(s ?? []); setProjects(p ?? []); setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const ch = supabase.channel("apro-rt").on("postgres_changes", { event: "*", schema: "public", table: "solpeds" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = items.filter((i) => filterProj === "all" || i.project_id === filterProj);

  const submit = async () => {
    if (!actionSolped || !actionType) return;
    if ((actionType === "rechazado" || actionType === "observado") && !comment.trim()) {
      toast.error("Comentario obligatorio"); return;
    }
    const prevStatus = actionSolped.status;
    const { error } = await supabase.from("solpeds").update({ status: actionType, observations: comment || actionSolped.observations }).eq("id", actionSolped.id);
    if (error) return toast.error(error.message);
    await supabase.from("solped_history").insert({
      solped_id: actionSolped.id, user_id: user!.id, action: actionType,
      from_status: prevStatus, to_status: actionType, comment,
    });
    toast.success(`SOLPED ${STATUS_META[actionType].label.toLowerCase()}`);
    setActionSolped(null); setActionType(null); setComment("");
    load();
  };

  const openHistory = async (s: S) => {
    setHistoryOf(s);
    const { data } = await supabase.from("solped_history").select("*").eq("solped_id", s.id).order("created_at", { ascending: false });
    setHistory(data ?? []);
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Liberación / Aprobación</h1>
        <p className="text-sm text-muted-foreground">Revisa, aprueba u observa las SOLPEDs pendientes.</p>
      </div>

      <Card className="p-3 flex items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={filterProj} onValueChange={setFilterProj}>
          <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los proyectos</SelectItem>
            {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.code} — {p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline">{filtered.length} pendientes</Badge>
      </Card>

      <div className="grid gap-3">
        {loading && <p className="text-center py-8 text-muted-foreground">Cargando...</p>}
        {!loading && filtered.length === 0 && <Card className="p-8 text-center text-muted-foreground">Nada por aprobar.</Card>}
        {filtered.map((s) => {
          const proj = projects.find((p) => p.id === s.project_id);
          return (
            <Card key={s.id} className="hover:shadow-elevated transition-all">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base">{s.code}</CardTitle>
                    <Badge variant="outline" className={STATUS_META[s.status].cls}>{STATUS_META[s.status].label}</Badge>
                    <Badge variant="outline" className={PRIORITY_META[s.priority].cls}>{PRIORITY_META[s.priority].label}</Badge>
                    {proj && <span className="text-xs text-muted-foreground">{proj.code} · {proj.name}</span>}
                  </div>
                  <p className="text-sm mt-1">{s.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums">{formatCurrency(Number(s.amount))}</p>
                  <p className="text-xs text-muted-foreground">{s.requester_name}</p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-2 pt-0">
                <div className="text-xs text-muted-foreground">
                  CC: {s.cost_center || "—"} · Fecha: {s.date}{s.observations && <> · Obs: {s.observations}</>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openHistory(s)}><History className="w-4 h-4" /> Historial</Button>
                  <Button size="sm" variant="outline" className="border-orange-500/40 text-orange-700 hover:bg-orange-500/10" onClick={() => { setActionSolped(s); setActionType("observado"); }}><AlertCircle className="w-4 h-4" /> Observar</Button>
                  <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => { setActionSolped(s); setActionType("rechazado"); }}><XCircle className="w-4 h-4" /> Rechazar</Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setActionSolped(s); setActionType("liberado"); }}><CheckCircle2 className="w-4 h-4" /> Aprobar</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!actionSolped} onOpenChange={(o) => !o && (setActionSolped(null), setActionType(null), setComment(""))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "liberado" ? "Aprobar" : actionType === "rechazado" ? "Rechazar" : "Observar"} {actionSolped?.code}</DialogTitle>
            <DialogDescription>
              {actionType === "liberado" ? "Confirma la liberación. Esto consume presupuesto." : "El comentario es obligatorio."}
            </DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Comentario..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionSolped(null)}>Cancelar</Button>
            <Button onClick={submit} className={cn(actionType === "liberado" && "bg-emerald-600 hover:bg-emerald-700 text-white", actionType === "rechazado" && "bg-destructive")}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!historyOf} onOpenChange={(o) => !o && setHistoryOf(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Historial · {historyOf?.code}</DialogTitle></DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {history.length === 0 && <p className="text-sm text-muted-foreground">Sin movimientos.</p>}
            {history.map((h) => (
              <div key={h.id} className="border-l-2 border-primary pl-3 py-1">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{format(new Date(h.created_at), "dd/MM/yyyy HH:mm")}</span>
                  <Badge variant="outline">{h.action}</Badge>
                </div>
                {h.comment && <p className="text-sm mt-1">{h.comment}</p>}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
