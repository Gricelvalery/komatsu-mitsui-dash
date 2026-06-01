import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Trash2, Copy, Search, Upload, FileSpreadsheet, Download } from "lucide-react";
import { cn } from "@/lib/utils";

/* =========================================================================
   Tipos y columnas
   ========================================================================= */
type RegistroRow = {
  id: string;
  // manuales (mn)
  usuario: string;
  proyecto: string;
  agrupacion: string;
  referencia: string;
  proveedor: string;
  motivo: string;
  // desde SAP
  cuentas_contables: string;
  fecha_solped: string;
  numero_solped: string;
  pos_solped: string;
  os_ceco: string;
  descripcion: string;
  moneda: string;
  cantidad: number;
  valor_uni: number;
};

type RevisionExtra = {
  mes_presupuesto: string;
  presupuesto: number;
  avance_proyectado: number;
  semaforo: "verde" | "ambar" | "rojo" | "";
  liberador: string;
  estado: string;
  estado2: string;
  avance_real_estado: number;
  fecha_revision: string;
  comentarios: string;
};

type RegCol = {
  key: keyof RegistroRow;
  label: string;
  w: number;
  type: "text" | "number" | "date";
  mn?: boolean;
};

const REG_COLS: RegCol[] = [
  { key: "usuario", label: "USUARIO", w: 140, type: "text", mn: true },
  { key: "proyecto", label: "PROYECTO", w: 130, type: "text", mn: true },
  { key: "agrupacion", label: "AGRUPACION", w: 130, type: "text", mn: true },
  { key: "cuentas_contables", label: "CUENTAS CONTABLES", w: 160, type: "text" },
  { key: "fecha_solped", label: "FECHA DE SOLPED", w: 140, type: "date" },
  { key: "numero_solped", label: "NUMERO SOLPED", w: 140, type: "text" },
  { key: "pos_solped", label: "POS SOLPED", w: 110, type: "text" },
  { key: "os_ceco", label: "OS / CECO", w: 130, type: "text" },
  { key: "descripcion", label: "DESCRIPCION", w: 260, type: "text" },
  { key: "moneda", label: "MONEDA", w: 90, type: "text" },
  { key: "cantidad", label: "CANTIDAD", w: 110, type: "number" },
  { key: "valor_uni", label: "VALOR UNI.", w: 120, type: "number" },
  { key: "referencia", label: "REFERENCIA", w: 130, type: "text", mn: true },
  { key: "proveedor", label: "PROVEEDOR", w: 160, type: "text", mn: true },
  { key: "motivo", label: "MOTIVO", w: 200, type: "text", mn: true },
];

/* Mapeo flexible de cabeceras -> campo interno
   Acepta cabeceras SAP ("Cta.mayor", "Sol.pedido"...) y también las del propio sistema
   ("USUARIO", "PROYECTO", "CUENTAS CONTABLES"...). */
const SAP_HEADER_MAP: Record<string, keyof RegistroRow> = {
  // SAP
  "creado por": "usuario",
  "cta.mayor": "cuentas_contables",
  "ctamayor": "cuentas_contables",
  "fe.sol.": "fecha_solped",
  "fesol": "fecha_solped",
  "sol.pedido": "numero_solped",
  "solpedido": "numero_solped",
  "pos.": "pos_solped",
  "pos": "pos_solped",
  "orden": "os_ceco",
  "ce.coste": "os_ceco",
  "cecoste": "os_ceco",
  "texto breve": "descripcion",
  "mon.": "moneda",
  "mon": "moneda",
  "pedida": "cantidad",
  "precvalorac/por": "valor_uni",
  "precvaloracpor": "valor_uni",
  // Sistema (labels propios)
  "usuario": "usuario",
  "proyecto": "proyecto",
  "agrupacion": "agrupacion",
  "agrupación": "agrupacion",
  "cuentas contables": "cuentas_contables",
  "cuenta contable": "cuentas_contables",
  "fecha de solped": "fecha_solped",
  "fecha solped": "fecha_solped",
  "numero solped": "numero_solped",
  "número solped": "numero_solped",
  "nro solped": "numero_solped",
  "n° solped": "numero_solped",
  "pos solped": "pos_solped",
  "os / ceco": "os_ceco",
  "os/ceco": "os_ceco",
  "os ceco": "os_ceco",
  "ceco": "os_ceco",
  "descripcion": "descripcion",
  "descripción": "descripcion",
  "moneda": "moneda",
  "cantidad": "cantidad",
  "valor uni.": "valor_uni",
  "valor uni": "valor_uni",
  "valor unitario": "valor_uni",
  "precio": "valor_uni",
  "referencia": "referencia",
  "proveedor": "proveedor",
  "motivo": "motivo",
};

const SEMAFORO_META: Record<string, { label: string; cls: string }> = {
  verde: { label: "Cumple", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40" },
  ambar: { label: "Alerta", cls: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/40" },
  rojo: { label: "Crítico", cls: "bg-destructive/15 text-destructive border-destructive/40" },
};

const ESTADO_OPTS = ["Pendiente", "En revisión", "Liberado", "Observado", "Rechazado"];

const STORAGE_KEY = "solpeds_data_v1";

const blankRegistro = (): RegistroRow => ({
  id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  usuario: "",
  proyecto: "",
  agrupacion: "",
  referencia: "",
  proveedor: "",
  motivo: "",
  cuentas_contables: "",
  fecha_solped: new Date().toISOString().slice(0, 10),
  numero_solped: "",
  pos_solped: "",
  os_ceco: "",
  descripcion: "",
  moneda: "USD",
  cantidad: 0,
  valor_uni: 0,
});

const blankRevExtra = (): RevisionExtra => ({
  mes_presupuesto: "",
  presupuesto: 0,
  avance_proyectado: 0,
  semaforo: "",
  liberador: "",
  estado: "Pendiente",
  estado2: "",
  avance_real_estado: 0,
  fecha_revision: "",
  comentarios: "",
});

/* =========================================================================
   CSV utils
   ========================================================================= */
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let cur = "", row: string[] = [], inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === "," || c === ";" || c === "\t") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c === "\r") {/* skip */}
      else cur += c;
    }
  }
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ""));
};

const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");

const toNumber = (v: string) => {
  const n = parseFloat(String(v).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
  return isFinite(n) ? n : 0;
};

/* =========================================================================
   Componente
   ========================================================================= */
export default function SolpedsGrid() {
  const [tab, setTab] = useState<"registro" | "revision">("registro");
  const [registro, setRegistro] = useState<RegistroRow[]>([]);
  const [revExtras, setRevExtras] = useState<Record<string, RevisionExtra>>({});
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setRegistro(d.registro ?? []);
        setRevExtras(d.revExtras ?? {});
      }
    } catch {}
  }, []);
  // save (con manejo de cuota)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ registro, revExtras }));
    } catch (err) {
      console.warn("localStorage lleno, no se persistirá esta sesión", err);
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  }, [registro, revExtras]);

  const updateReg = (id: string, patch: Partial<RegistroRow>) => {
    setRegistro((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const updateExtra = (id: string, patch: Partial<RevisionExtra>) => {
    setRevExtras((p) => ({ ...p, [id]: { ...(p[id] ?? blankRevExtra()), ...patch } }));
  };
  const addRow = () => setRegistro((p) => [blankRegistro(), ...p]);
  const dupRow = (id: string) => {
    const r = registro.find((x) => x.id === id);
    if (!r) return;
    setRegistro((p) => [{ ...r, id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, ...p]);
  };
  const delRow = (id: string) => {
    setRegistro((p) => p.filter((r) => r.id !== id));
    setRevExtras((p) => { const c = { ...p }; delete c[id]; return c; });
    toast.success("Fila eliminada");
  };

  const handleCSVUpload = async (file: File) => {
    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length < 2) { toast.error("CSV vacío o sin datos"); return; }
    const headers = rows[0].map((h) => normalize(h));
    const mapping: (keyof RegistroRow | null)[] = headers.map((h) => SAP_HEADER_MAP[h] ?? null);

    const matched = mapping.filter(Boolean).length;
    if (matched === 0) {
      toast.error("No se reconocieron cabeceras del SAP. Revisa el archivo.");
      return;
    }

    const imported: RegistroRow[] = rows.slice(1).map((cells) => {
      const r = blankRegistro();
      mapping.forEach((field, i) => {
        if (!field) return;
        const val = (cells[i] ?? "").trim();
        if (field === "cantidad" || field === "valor_uni") (r as any)[field] = toNumber(val);
        else (r as any)[field] = val;
      });
      return r;
    });

    setRegistro((p) => [...imported, ...p]);
    toast.success(`${imported.length} filas importadas desde SAP. Completa los campos manuales (mn).`);
  };

  const exportCSV = () => {
    const cols = REG_COLS;
    const header = cols.map((c) => c.label).join(",");
    const lines = registro.map((r) =>
      cols.map((c) => {
        const v = String((r as any)[c.key] ?? "");
        return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
      }).join(",")
    );
    const blob = new Blob([header + "\n" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `solpeds_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return registro;
    return registro.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [registro, search]);

  const cellCls = "h-8 px-2 py-0 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-none w-full outline-none";

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Portal SOLPEDs
          </h1>
          <p className="text-sm text-muted-foreground">
            Carga CSV del SAP, completa los campos manuales (<span className="font-semibold text-primary">mn</span>) y pasa a Revisión.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5">{registro.length} filas</Badge>
          <Button onClick={exportCSV} variant="outline" size="sm" disabled={!registro.length}>
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="registro"><FileSpreadsheet className="w-4 h-4 mr-1" /> Registro</TabsTrigger>
          <TabsTrigger value="revision">Revisión</TabsTrigger>
        </TabsList>

        {/* ============ REGISTRO ============ */}
        <TabsContent value="registro" className="space-y-3">
          <Card className="p-3 backdrop-blur-sm bg-card/80 border-dashed border-primary/40">
            <div className="flex flex-wrap items-center gap-3">
              <div
                onClick={() => fileRef.current?.click()}
                className="flex-1 min-w-[260px] flex items-center gap-3 p-3 rounded-lg border border-dashed border-primary/50 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
              >
                <Upload className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Cargar CSV del SAP</p>
                  <p className="text-xs text-muted-foreground">
                    Cabeceras reconocidas: Creado por, Cta.mayor, Fe.sol., Sol.pedido, Pos., Orden, Ce.coste, Texto breve, Mon., Pedida, PrecValorac/por
                  </p>
                </div>
              </div>
              <input
                ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleCSVUpload(f);
                  e.target.value = "";
                }}
              />
              <Button onClick={addRow} size="sm"><Plus className="w-4 h-4" /> Nueva fila</Button>
            </div>
          </Card>

          <Card className="p-3 flex flex-wrap items-center gap-3 backdrop-blur-sm bg-card/80">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar en todas las columnas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-380px)]">
              <table className="text-xs border-collapse min-w-full">
                <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur">
                  <tr>
                    {REG_COLS.map((c) => (
                      <th key={c.key} style={{ minWidth: c.w, width: c.w }} className="text-left font-semibold px-2 py-2 border-b border-r border-border">
                        <div className="flex items-center gap-1">
                          {c.label}
                          {c.mn && <span className="text-[9px] px-1 rounded bg-primary/15 text-primary font-bold">mn</span>}
                        </div>
                      </th>
                    ))}
                    <th className="w-20 px-2 py-2 border-b border-border text-center sticky right-0 bg-muted/95">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={REG_COLS.length + 1} className="text-center py-12 text-muted-foreground">
                      Sin filas. Carga un CSV del SAP o pulsa "Nueva fila".
                    </td></tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 hover:bg-muted/40 transition-colors">
                      {REG_COLS.map((c) => {
                        const v = (r as any)[c.key];
                        return (
                          <td key={c.key} style={{ minWidth: c.w, width: c.w }} className={cn("border-r border-border/40 p-0 align-middle", c.mn && "bg-primary/[0.03]")}>
                            {c.type === "number" ? (
                              <input type="number" step="0.01" className={cn(cellCls, "text-right tabular-nums")}
                                value={v ?? 0}
                                onChange={(e) => updateReg(r.id, { [c.key]: parseFloat(e.target.value) || 0 } as any)} />
                            ) : c.type === "date" ? (
                              <input type="date" className={cellCls} value={v ?? ""}
                                onChange={(e) => updateReg(r.id, { [c.key]: e.target.value } as any)} />
                            ) : (
                              <input className={cellCls} value={v ?? ""}
                                onChange={(e) => updateReg(r.id, { [c.key]: e.target.value } as any)} />
                            )}
                          </td>
                        );
                      })}
                      <td className="text-center sticky right-0 bg-background/80 backdrop-blur">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dupRow(r.id)} title="Duplicar"><Copy className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setConfirmDelete(r.id)} title="Eliminar"><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ============ REVISIÓN ============ */}
        <TabsContent value="revision" className="space-y-3">
          <Card className="p-3 backdrop-blur-sm bg-card/80">
            <p className="text-xs text-muted-foreground">
              Las columnas grises provienen del Registro. Las columnas con fondo claro se completan aquí.
            </p>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-300px)]">
              <table className="text-xs border-collapse min-w-full">
                <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur">
                  <tr>
                    {[
                      ["ID", 70],
                      ["USUARIO", 130],
                      ["PROYECTO", 120],
                      ["CUENTAS CONTABLES", 150],
                      ["MES PRESUPUESTO", 140],
                      ["PRESUPUESTO", 120],
                      ["FECHA DE SOLPED", 130],
                      ["NUMERO SOLPED", 130],
                      ["POS SOLPED", 100],
                      ["OS / CECO", 120],
                      ["DESCRIPCION", 240],
                      ["MONEDA", 80],
                      ["CANTIDAD", 100],
                      ["VALOR UNI.", 110],
                      ["TOTAL USD", 110],
                      ["REFERENCIA", 120],
                      ["PROVEEDOR", 150],
                      ["MOTIVO", 180],
                      ["AVANCE PROYECTADO", 140],
                      ["SEMAFORO", 110],
                      ["LIBERADOR", 130],
                      ["ESTADO", 130],
                      ["ESTADO 2", 130],
                      ["AVANCE REAL POR ESTADO", 160],
                      ["FECHA DE REVISION", 140],
                      ["COMENTARIOS", 240],
                    ].map(([l, w]) => (
                      <th key={l as string} style={{ minWidth: w as number, width: w as number }} className="text-left font-semibold px-2 py-2 border-b border-r border-border">
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registro.length === 0 && (
                    <tr><td colSpan={26} className="text-center py-12 text-muted-foreground">
                      No hay SOLPEDs registradas. Ve a la pestaña Registro.
                    </td></tr>
                  )}
                  {registro.map((r, idx) => {
                    const ex = revExtras[r.id] ?? blankRevExtra();
                    const total = (Number(r.cantidad) || 0) * (Number(r.valor_uni) || 0);
                    const ro = "bg-muted/30";
                    const ed = "bg-background";
                    return (
                      <tr key={r.id} className="border-b border-border/60 hover:bg-muted/40">
                        <td className={cn("border-r border-border/40 px-2 text-center tabular-nums", ro)}>{idx + 1}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.usuario}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.proyecto}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.cuentas_contables}</td>
                        <td className={cn("border-r border-border/40 p-0", ed)}>
                          <input className={cellCls} value={ex.mes_presupuesto} onChange={(e) => updateExtra(r.id, { mes_presupuesto: e.target.value })} placeholder="ene-2026" />
                        </td>
                        <td className={cn("border-r border-border/40 p-0", ed)}>
                          <input type="number" step="0.01" className={cn(cellCls, "text-right tabular-nums")} value={ex.presupuesto} onChange={(e) => updateExtra(r.id, { presupuesto: parseFloat(e.target.value) || 0 })} />
                        </td>
                        <td className={cn("border-r border-border/40 px-2 tabular-nums", ro)}>{r.fecha_solped}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.numero_solped}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.pos_solped}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.os_ceco}</td>
                        <td className={cn("border-r border-border/40 px-2 truncate", ro)} title={r.descripcion}>{r.descripcion}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.moneda}</td>
                        <td className={cn("border-r border-border/40 px-2 text-right tabular-nums", ro)}>{r.cantidad}</td>
                        <td className={cn("border-r border-border/40 px-2 text-right tabular-nums", ro)}>{r.valor_uni}</td>
                        <td className={cn("border-r border-border/40 px-2 text-right tabular-nums font-semibold", ro)}>
                          {total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.referencia}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.proveedor}</td>
                        <td className={cn("border-r border-border/40 px-2", ro)}>{r.motivo}</td>
                        <td className={cn("border-r border-border/40 p-0", ed)}>
                          <input type="number" step="0.01" className={cn(cellCls, "text-right tabular-nums")} value={ex.avance_proyectado} onChange={(e) => updateExtra(r.id, { avance_proyectado: parseFloat(e.target.value) || 0 })} />
                        </td>
                        <td className={cn("border-r border-border/40 p-1", ed)}>
                          <Select value={ex.semaforo || "none"} onValueChange={(v) => updateExtra(r.id, { semaforo: v === "none" ? "" : (v as any) })}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">—</SelectItem>
                              {Object.entries(SEMAFORO_META).map(([k, m]) => (
                                <SelectItem key={k} value={k}>
                                  <span className={cn("inline-block px-2 py-0.5 rounded-full border text-[10px]", m.cls)}>{m.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className={cn("border-r border-border/40 p-0", ed)}>
                          <input className={cellCls} value={ex.liberador} onChange={(e) => updateExtra(r.id, { liberador: e.target.value })} />
                        </td>
                        <td className={cn("border-r border-border/40 p-1", ed)}>
                          <Select value={ex.estado} onValueChange={(v) => updateExtra(r.id, { estado: v })}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {ESTADO_OPTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className={cn("border-r border-border/40 p-0", ed)}>
                          <input className={cellCls} value={ex.estado2} onChange={(e) => updateExtra(r.id, { estado2: e.target.value })} />
                        </td>
                        <td className={cn("border-r border-border/40 p-0", ed)}>
                          <input type="number" step="0.01" className={cn(cellCls, "text-right tabular-nums")} value={ex.avance_real_estado} onChange={(e) => updateExtra(r.id, { avance_real_estado: parseFloat(e.target.value) || 0 })} />
                        </td>
                        <td className={cn("border-r border-border/40 p-0", ed)}>
                          <input type="date" className={cellCls} value={ex.fecha_revision} onChange={(e) => updateExtra(r.id, { fecha_revision: e.target.value })} />
                        </td>
                        <td className={cn("border-r border-border/40 p-0", ed)}>
                          <input className={cellCls} value={ex.comentarios} onChange={(e) => updateExtra(r.id, { comentarios: e.target.value })} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar fila?</AlertDialogTitle>
            <AlertDialogDescription>Se eliminará también su información de Revisión.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (confirmDelete) delRow(confirmDelete); setConfirmDelete(null); }}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
