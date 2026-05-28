import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, STATUS_META } from "@/lib/solpeds";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Clock, CheckCircle2, FileText, TrendingUp } from "lucide-react";
import { differenceInHours, format, startOfMonth } from "date-fns";

export default function SolpedDashboard() {
  const [solpeds, setSolpeds] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("solpeds").select("*"),
      supabase.from("projects").select("*"),
    ]).then(([s, p]) => { setSolpeds(s.data ?? []); setProjects(p.data ?? []); });
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const pending = solpeds.filter((s) => ["pendiente", "en_revision", "observado"].includes(s.status));
    const releasedToday = solpeds.filter((s) => s.status === "liberado" && s.approved_at?.slice(0, 10) === today);
    const released = solpeds.filter((s) => s.status === "liberado" && s.approved_at);
    const avgHours = released.length
      ? released.reduce((acc, s) => acc + differenceInHours(new Date(s.approved_at), new Date(s.created_at)), 0) / released.length
      : 0;
    const totalBudget = projects.reduce((a, p) => a + Number(p.budget_total), 0);
    const consumed = solpeds.filter((s) => s.status === "liberado").reduce((a, s) => a + Number(s.amount), 0);
    return { pending: pending.length, releasedToday: releasedToday.length, avgHours, totalBudget, consumed };
  }, [solpeds, projects]);

  const byProject = useMemo(() => projects.map((p) => ({
    name: p.code,
    consumido: solpeds.filter((s) => s.project_id === p.id && s.status === "liberado").reduce((a, s) => a + Number(s.amount), 0),
    total: Number(p.budget_total),
  })), [solpeds, projects]);

  const byStatus = useMemo(() => Object.keys(STATUS_META).map((k) => ({
    name: STATUS_META[k].label, value: solpeds.filter((s) => s.status === k).length,
  })).filter((s) => s.value > 0), [solpeds]);

  const trend = useMemo(() => {
    const map: Record<string, { month: string; liberadas: number; monto: number }> = {};
    solpeds.forEach((s) => {
      const k = format(startOfMonth(new Date(s.created_at)), "MMM yy");
      if (!map[k]) map[k] = { month: k, liberadas: 0, monto: 0 };
      if (s.status === "liberado") { map[k].liberadas++; map[k].monto += Number(s.amount); }
    });
    return Object.values(map);
  }, [solpeds]);

  const COLORS = ["hsl(var(--muted-foreground))", "hsl(var(--primary))", "#10b981", "#f97316", "hsl(var(--destructive))"];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard Ejecutivo</h1>
        <p className="text-sm text-muted-foreground">Indicadores clave en tiempo real.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPI icon={FileText} label="SOLPEDs pendientes" value={stats.pending} accent="text-primary" />
        <KPI icon={CheckCircle2} label="Liberadas hoy" value={stats.releasedToday} accent="text-emerald-600" />
        <KPI icon={Clock} label="Tiempo prom. aprobación" value={`${stats.avgHours.toFixed(1)} h`} accent="text-orange-600" />
        <KPI icon={TrendingUp} label="% Presupuesto consumido" value={stats.totalBudget > 0 ? `${((stats.consumed / stats.totalBudget) * 100).toFixed(1)}%` : "—"} accent="text-accent" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Consumo por proyecto</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><BarChart data={byProject}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend />
              <Bar dataKey="total" fill="hsl(var(--muted))" name="Presupuesto" />
              <Bar dataKey="consumido" fill="hsl(var(--primary))" name="Consumido" />
            </BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Distribución por estado</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Tendencia mensual de liberaciones</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer><LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="l" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip />
              <Legend />
              <Line yAxisId="l" type="monotone" dataKey="liberadas" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line yAxisId="r" type="monotone" dataKey="monto" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart></ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, accent }: any) {
  return (
    <Card className="hover:shadow-elevated transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${accent}`}>{value}</p>
          </div>
          <div className={`p-2 rounded-lg bg-primary/10 ${accent}`}><Icon className="w-5 h-5" /></div>
        </div>
      </CardContent>
    </Card>
  );
}
