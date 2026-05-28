import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Wallet, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/solpeds";
import { cn } from "@/lib/utils";

type Project = { id: string; code: string; name: string; budget_total: number };

export default function Presupuestos() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [consumed, setConsumed] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", budget_total: "" });

  const load = async () => {
    const { data: p } = await supabase.from("projects").select("*").order("code");
    setProjects((p ?? []) as Project[]);
    const { data: s } = await supabase.from("solpeds").select("project_id,amount").eq("status", "liberado");
    const agg: Record<string, number> = {};
    (s ?? []).forEach((r: any) => { agg[r.project_id] = (agg[r.project_id] ?? 0) + Number(r.amount); });
    setConsumed(agg);
  };
  useEffect(() => { load(); }, []);

  const createProject = async () => {
    if (!form.code || !form.name) return toast.error("Código y nombre requeridos");
    const { error } = await supabase.from("projects").insert({
      code: form.code, name: form.name, budget_total: Number(form.budget_total) || 0,
    });
    if (error) return toast.error(error.message);
    toast.success("Proyecto creado");
    setOpen(false); setForm({ code: "", name: "", budget_total: "" });
    load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Presupuestos por Proyecto</h1>
          <p className="text-sm text-muted-foreground">Control financiero en tiempo real.</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4" /> Nuevo proyecto</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Crear proyecto</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Código</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="PRJ-001" /></div>
                <div><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Presupuesto total (USD)</Label><Input type="number" value={form.budget_total} onChange={(e) => setForm({ ...form, budget_total: e.target.value })} /></div>
              </div>
              <DialogFooter><Button onClick={createProject}>Crear</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {projects.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          No hay proyectos. {isAdmin ? "Crea el primero." : "Solicita a un administrador."}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const used = consumed[p.id] ?? 0;
          const total = Number(p.budget_total) || 0;
          const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
          const over = total > 0 && used > total;
          const warn = pct >= 80;
          return (
            <Card key={p.id} className={cn("hover:shadow-elevated transition-all", over && "border-destructive", warn && !over && "border-orange-500/50")}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{p.code} · {p.name}</span>
                  {over && <AlertTriangle className="w-4 h-4 text-destructive" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Wallet className="w-3 h-3" /> Total</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Consumido</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(used)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Disponible</span>
                  <span className={cn("font-semibold tabular-nums", over && "text-destructive")}>{formatCurrency(total - used)}</span>
                </div>
                <div className="space-y-1">
                  <Progress value={pct} className={cn(over && "[&>div]:bg-destructive", warn && !over && "[&>div]:bg-orange-500")} />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{pct.toFixed(1)}% utilizado</span>
                    {warn && <Badge variant="outline" className={over ? "text-destructive border-destructive" : "text-orange-700 border-orange-500"}>{over ? "Excedido" : "Alerta"}</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
