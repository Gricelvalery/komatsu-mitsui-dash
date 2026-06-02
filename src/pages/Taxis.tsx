import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Car, Check, X, Download, Send, MapPin, Phone, Calendar, User, FileText, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type Status = "pendiente" | "aprobado" | "rechazado";

interface TaxiRequest {
  id: string;
  solicitante: string;
  ceco: string;
  motivo: string;
  origen: string;
  destino: string;
  fechaServicio: string; // datetime-local
  telefono: string;
  liberador: string;
  fechaSolicitud: string; // ISO
  status: Status;
  comentario?: string;
}

const LIBERADORES = [
  "Juan Pérez",
  "María García",
  "Carlos Rodríguez",
  "Ana López",
  "Luis Martínez",
];

const STORAGE_KEY = "taxis_requests_v1";

const empty = {
  solicitante: "",
  ceco: "",
  motivo: "",
  origen: "",
  destino: "",
  fechaServicio: "",
  telefono: "",
  liberador: "",
};

const formatDateTime = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Taxis() {
  const [form, setForm] = useState(empty);
  const [requests, setRequests] = useState<TaxiRequest[]>([]);
  const [selected, setSelected] = useState<TaxiRequest | null>(null);
  const [tab, setTab] = useState("solicitud");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRequests(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {}
  }, [requests]);

  const aprobadas = useMemo(
    () => requests.filter((r) => r.status === "aprobado"),
    [requests]
  );

  const handleChange = (k: keyof typeof empty, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["solicitante", "ceco", "motivo", "origen", "destino", "fechaServicio", "telefono", "liberador"] as const;
    for (const k of required) {
      if (!form[k]) {
        toast.error("Completa todos los campos");
        return;
      }
    }
    const nuevo: TaxiRequest = {
      id: crypto.randomUUID(),
      ...form,
      fechaSolicitud: new Date().toISOString(),
      status: "pendiente",
    };
    setRequests((rs) => [nuevo, ...rs]);
    setForm(empty);
    toast.success("Solicitud enviada");
    setTab("solicitudes");
  };

  const decide = (id: string, status: Status, comentario?: string) => {
    setRequests((rs) =>
      rs.map((r) => (r.id === id ? { ...r, status, comentario } : r))
    );
    toast.success(status === "aprobado" ? "Solicitud aprobada" : "Solicitud rechazada");
    setSelected(null);
  };

  const exportarExcel = () => {
    if (!aprobadas.length) {
      toast.error("No hay solicitudes aprobadas");
      return;
    }
    const rows = aprobadas.map((r) => ({
      Solicitante: r.solicitante,
      CECO: r.ceco,
      "Lugar de Inicio": r.origen,
      Destino: r.destino,
      "Fecha de Solicitud": formatDateTime(r.fechaSolicitud),
      "Fecha de Servicio": formatDateTime(r.fechaServicio),
      Teléfono: r.telefono,
      Motivo: r.motivo,
      Liberador: r.liberador,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Taxis Aprobados");
    XLSX.writeFile(wb, `taxis_aprobados_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Excel exportado");
  };

  const statusVariant: Record<Status, string> = {
    pendiente: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    aprobado: "bg-green-500/20 text-green-700 border-green-500/30",
    rechazado: "bg-red-500/20 text-red-700 border-red-500/30",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-elevated">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gestión de Taxis
          </h1>
          <p className="text-sm text-muted-foreground">
            Solicitudes, aprobaciones y registro
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="solicitud">Solicitud</TabsTrigger>
          <TabsTrigger value="solicitudes">
            Solicitudes
            {requests.filter((r) => r.status === "pendiente").length > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white">
                {requests.filter((r) => r.status === "pendiente").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="aprobados">Aprobados</TabsTrigger>
        </TabsList>

        {/* SOLICITUD */}
        <TabsContent value="solicitud">
          <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50 shadow-elevated">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label><User className="w-3 h-3 inline mr-1" />Solicitante</Label>
                <Input value={form.solicitante} onChange={(e) => handleChange("solicitante", e.target.value)} placeholder="Nombre completo" />
              </div>
              <div className="space-y-2">
                <Label><Hash className="w-3 h-3 inline mr-1" />CECO</Label>
                <Input value={form.ceco} onChange={(e) => handleChange("ceco", e.target.value)} placeholder="Centro de costo" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label><FileText className="w-3 h-3 inline mr-1" />Motivo</Label>
                <Textarea value={form.motivo} onChange={(e) => handleChange("motivo", e.target.value)} placeholder="Describa el motivo del servicio" rows={2} />
              </div>
              <div className="space-y-2">
                <Label><MapPin className="w-3 h-3 inline mr-1" />Lugar de inicio</Label>
                <Input value={form.origen} onChange={(e) => handleChange("origen", e.target.value)} placeholder="Dirección de origen" />
              </div>
              <div className="space-y-2">
                <Label><MapPin className="w-3 h-3 inline mr-1" />Destino</Label>
                <Input value={form.destino} onChange={(e) => handleChange("destino", e.target.value)} placeholder="Dirección de destino" />
              </div>
              <div className="space-y-2">
                <Label><Calendar className="w-3 h-3 inline mr-1" />Fecha y hora del servicio</Label>
                <Input type="datetime-local" value={form.fechaServicio} onChange={(e) => handleChange("fechaServicio", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label><Phone className="w-3 h-3 inline mr-1" />Teléfono</Label>
                <Input type="tel" value={form.telefono} onChange={(e) => handleChange("telefono", e.target.value)} placeholder="999 999 999" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Liberador</Label>
                <Select value={form.liberador} onValueChange={(v) => handleChange("liberador", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona un liberador" /></SelectTrigger>
                  <SelectContent>
                    {LIBERADORES.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-elevated">
                  <Send className="w-4 h-4 mr-2" />
                  Solicitar Taxi
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* SOLICITUDES */}
        <TabsContent value="solicitudes">
          {requests.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              No hay solicitudes registradas
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((r) => (
                <Card
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="p-4 cursor-pointer hover:shadow-elevated hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm bg-card/80 border border-border/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{r.solicitante}</p>
                        <p className="text-xs text-muted-foreground">{r.ceco}</p>
                      </div>
                    </div>
                    <Badge className={statusVariant[r.status]} variant="outline">
                      {r.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> <span className="truncate">{r.origen} → {r.destino}</span></p>
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {formatDateTime(r.fechaServicio)}</p>
                    <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-primary" /> {r.telefono}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* APROBADOS */}
        <TabsContent value="aprobados">
          <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50 shadow-elevated">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Solicitudes Aprobadas ({aprobadas.length})</h3>
              <Button onClick={exportarExcel} variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Exportar Excel
              </Button>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Origen → Destino</TableHead>
                    <TableHead>Fecha Solicitud</TableHead>
                    <TableHead>Fecha Servicio</TableHead>
                    <TableHead>Teléfono</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aprobadas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Sin solicitudes aprobadas
                      </TableCell>
                    </TableRow>
                  ) : (
                    aprobadas.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.solicitante}</TableCell>
                        <TableCell>{r.origen} → {r.destino}</TableCell>
                        <TableCell>{formatDateTime(r.fechaSolicitud)}</TableCell>
                        <TableCell>{formatDateTime(r.fechaServicio)}</TableCell>
                        <TableCell>{r.telefono}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detalle */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" /> Detalle de Solicitud
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Solicitante</p><p className="font-medium">{selected.solicitante}</p></div>
                <div><p className="text-muted-foreground text-xs">CECO</p><p className="font-medium">{selected.ceco}</p></div>
                <div><p className="text-muted-foreground text-xs">Origen</p><p className="font-medium">{selected.origen}</p></div>
                <div><p className="text-muted-foreground text-xs">Destino</p><p className="font-medium">{selected.destino}</p></div>
                <div><p className="text-muted-foreground text-xs">Fecha servicio</p><p className="font-medium">{formatDateTime(selected.fechaServicio)}</p></div>
                <div><p className="text-muted-foreground text-xs">Teléfono</p><p className="font-medium">{selected.telefono}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground text-xs">Motivo</p><p className="font-medium">{selected.motivo}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground text-xs">Liberador</p><p className="font-medium">{selected.liberador}</p></div>
                <div className="col-span-2">
                  <Badge className={statusVariant[selected.status]} variant="outline">{selected.status}</Badge>
                </div>
              </div>

              {selected.status === "pendiente" && (
                <DialogFooter className="gap-2 pt-2">
                  <Button variant="destructive" onClick={() => decide(selected.id, "rechazado")}>
                    <X className="w-4 h-4 mr-1" /> Rechazar
                  </Button>
                  <Button onClick={() => decide(selected.id, "aprobado")} className="bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4 mr-1" /> Aprobar
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
