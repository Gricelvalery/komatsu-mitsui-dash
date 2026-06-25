import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, CameraOff, Scan, RotateCcw, Package, ArrowRightLeft, Shirt, BarChart3, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

// Catálogo de herramientas
const TOOLS: Record<string, { name: string; ceco: string }> = {
  KMMP123456: { name: "Taladro Hilti TE-7", ceco: "CECO-ANTAPACCAY-001" },
  KMMP123457: { name: "Amoladora Bosch GWS", ceco: "CECO-ANTAPACCAY-002" },
  KMMP123458: { name: "Llave Torque 1/2", ceco: "CECO-QUELLAVECO-010" },
  KMMP123459: { name: "Multímetro Fluke 87V", ceco: "CECO-BAMBAS-005" },
};

// Catálogo de suministros (EPPs, consumibles)
const SUPPLIES: Record<string, { name: string; unidad: string }> = {
  "SUP-TYVEK": { name: "Traje Tyvek", unidad: "und" },
  "SUP-GUANTE": { name: "Guantes de nitrilo", unidad: "par" },
  "SUP-LENTES": { name: "Lentes de seguridad", unidad: "und" },
  "SUP-CASCO": { name: "Casco de seguridad", unidad: "und" },
  "SUP-MASCARILLA": { name: "Mascarilla N95", unidad: "und" },
  "SUP-TAPONES": { name: "Tapones auditivos", unidad: "par" },
};

// Usuarios por DNI
const USERS: Record<string, { name: string; ceco: string }> = {
  "12345678": { name: "Juan Pérez", ceco: "CECO-ANTAPACCAY-001" },
  "87654321": { name: "María Gómez", ceco: "CECO-ANTAPACCAY-002" },
  "11223344": { name: "Carlos Ruiz", ceco: "CECO-QUELLAVECO-010" },
  "44332211": { name: "Ana Torres", ceco: "CECO-BAMBAS-005" },
};

type LoanType = "interno" | "prestamo";
interface Loan {
  id: string;
  barcode: string;
  toolName: string;
  toolCeco: string;
  dni: string;
  userName: string;
  userCeco: string;
  type: LoanType;
  status: "activo" | "devuelto";
  createdAt: string;
  returnedAt?: string;
}

interface Delivery {
  id: string;
  supplyCode: string;
  supplyName: string;
  unidad: string;
  cantidad: number;
  dni: string;
  userName: string;
  userCeco: string;
  createdAt: string;
}

const STORAGE_LOANS = "tiny_loans_v1";
const STORAGE_DELIVERIES = "tiny_deliveries_v1";

function load<T>(k: string): T[] { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch { return []; } }
function save<T>(k: string, v: T[]) { localStorage.setItem(k, JSON.stringify(v)); }

function Scanner({ onDetected, label }: { onDetected: (code: string) => void; label: string }) {
  const [active, setActive] = useState(false);
  const [manual, setManual] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const divId = useRef(`scanner-${Math.random().toString(36).slice(2)}`).current;

  useEffect(() => () => { stop(); }, []); // eslint-disable-line

  const start = async () => {
    try {
      const html5 = new Html5Qrcode(divId);
      scannerRef.current = html5;
      await html5.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 280, height: 140 } },
        (decoded) => { onDetected(decoded.trim()); stop(); },
        () => {}
      );
      setActive(true);
    } catch (e: any) {
      toast.error("No se pudo iniciar la cámara: " + (e?.message || e));
    }
  };

  const stop = async () => {
    try { if (scannerRef.current) { await scannerRef.current.stop(); await scannerRef.current.clear(); scannerRef.current = null; } } catch {}
    setActive(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {!active ? (
          <Button onClick={start} className="gap-2"><Camera className="w-4 h-4" /> Activar cámara</Button>
        ) : (
          <Button variant="destructive" onClick={stop} className="gap-2"><CameraOff className="w-4 h-4" /> Detener</Button>
        )}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div id={divId} className="w-full max-w-md rounded-lg overflow-hidden border bg-muted/20" />
      <div className="flex items-center gap-2 pt-2 border-t">
        <Input
          placeholder="O ingresa el código manualmente"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && manual.trim()) { onDetected(manual.trim()); setManual(""); } }}
        />
        <Button variant="outline" onClick={() => { if (manual.trim()) { onDetected(manual.trim()); setManual(""); } }}>
          <Scan className="w-4 h-4 mr-2" /> Usar
        </Button>
      </div>
    </div>
  );
}

export default function Tiny() {
  const [loans, setLoans] = useState<Loan[]>(load<Loan>(STORAGE_LOANS));
  const [deliveries, setDeliveries] = useState<Delivery[]>(load<Delivery>(STORAGE_DELIVERIES));

  useEffect(() => { save(STORAGE_LOANS, loans); }, [loans]);
  useEffect(() => { save(STORAGE_DELIVERIES, deliveries); }, [deliveries]);

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="herramientas">
        <TabsList>
          <TabsTrigger value="herramientas"><Package className="w-4 h-4 mr-2" />Herramientas</TabsTrigger>
          <TabsTrigger value="suministros"><Shirt className="w-4 h-4 mr-2" />Suministros / EPPs</TabsTrigger>
        </TabsList>

        <TabsContent value="herramientas">
          <HerramientasSection loans={loans} setLoans={setLoans} />
        </TabsContent>

        <TabsContent value="suministros">
          <SuministrosSection deliveries={deliveries} setDeliveries={setDeliveries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============== HERRAMIENTAS ============== */
function HerramientasSection({ loans, setLoans }: { loans: Loan[]; setLoans: (l: Loan[]) => void }) {
  const [tool, setTool] = useState<{ barcode: string; name: string; ceco: string } | null>(null);
  const [loanType, setLoanType] = useState<LoanType | null>(null);
  const [dni, setDni] = useState("");
  const [user, setUser] = useState<{ name: string; ceco: string } | null>(null);

  const handleToolScan = (code: string) => {
    const t = TOOLS[code.toUpperCase()];
    if (!t) { toast.error(`Herramienta no encontrada: ${code}`); return; }
    setTool({ barcode: code.toUpperCase(), ...t });
    setLoanType(null); setDni(""); setUser(null);
    toast.success(`Herramienta detectada: ${t.name}`);
  };

  const handleDniLookup = (value: string) => {
    setDni(value);
    setUser(USERS[value.trim()] || null);
  };

  const registerLoan = () => {
    if (!tool || !loanType || !user) { toast.error("Completa todos los datos"); return; }
    setLoans([{
      id: crypto.randomUUID(), barcode: tool.barcode, toolName: tool.name, toolCeco: tool.ceco,
      dni, userName: user.name, userCeco: user.ceco, type: loanType, status: "activo",
      createdAt: new Date().toISOString(),
    }, ...loans]);
    toast.success("Entrega registrada");
    setTool(null); setLoanType(null); setDni(""); setUser(null);
  };

  const handleReturn = (code: string) => {
    const upper = code.toUpperCase();
    const idx = loans.findIndex((l) => l.barcode === upper && l.status === "activo");
    if (idx < 0) { toast.error("No hay préstamo activo para esta herramienta"); return; }
    const copy = [...loans];
    copy[idx] = { ...copy[idx], status: "devuelto", returnedAt: new Date().toISOString() };
    setLoans(copy);
    toast.success(`Devolución registrada: ${copy[idx].toolName}`);
  };

  const internos = loans.filter((l) => l.type === "interno");
  const prestamos = loans.filter((l) => l.type === "prestamo");

  return (
    <Tabs defaultValue="entrega" className="mt-4">
      <TabsList>
        <TabsTrigger value="entrega"><Package className="w-4 h-4 mr-2" />Entrega</TabsTrigger>
        <TabsTrigger value="devolucion"><RotateCcw className="w-4 h-4 mr-2" />Devolución</TabsTrigger>
        <TabsTrigger value="visualizacion"><ArrowRightLeft className="w-4 h-4 mr-2" />Visualización</TabsTrigger>
      </TabsList>

      <TabsContent value="entrega" className="space-y-4">
        <Card>
          <CardHeader><CardTitle>1. Escanear código de barras</CardTitle></CardHeader>
          <CardContent><Scanner onDetected={handleToolScan} label="Apunta al código (ej. KMMP123456)" /></CardContent>
        </Card>

        {tool && (
          <Card>
            <CardHeader><CardTitle>2. Datos de la herramienta</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><Label className="text-muted-foreground">Código</Label><div className="font-mono font-semibold">{tool.barcode}</div></div>
                <div><Label className="text-muted-foreground">Nombre</Label><div className="font-semibold">{tool.name}</div></div>
                <div><Label className="text-muted-foreground">CECO origen</Label><div className="font-semibold">{tool.ceco}</div></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant={loanType === "interno" ? "default" : "outline"} onClick={() => { setLoanType("interno"); setDni(""); setUser(null); }}>
                  Uso dentro del proyecto
                </Button>
                <Button variant={loanType === "prestamo" ? "default" : "outline"} onClick={() => { setLoanType("prestamo"); setDni(""); setUser(null); }}>
                  Préstamo a otro proyecto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {tool && loanType && (
          <Card>
            <CardHeader><CardTitle>3. Usuario que recibe</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div><Label>DNI</Label><Input value={dni} onChange={(e) => handleDniLookup(e.target.value)} placeholder="Ej. 12345678" /></div>
                <div><Label>Nombre</Label><Input value={user?.name || ""} readOnly placeholder="Auto" className="bg-muted" /></div>
                <div><Label>CECO del usuario</Label><Input value={user?.ceco || ""} readOnly placeholder="Auto" className="bg-muted" /></div>
              </div>
              {dni && !user && <p className="text-sm text-destructive">DNI no encontrado</p>}
              <Button onClick={registerLoan} disabled={!user}>Registrar entrega</Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="devolucion">
        <Card>
          <CardHeader><CardTitle>Escanear herramienta para devolver</CardTitle></CardHeader>
          <CardContent><Scanner onDetected={handleReturn} label="Si no tiene código, ingrésalo manualmente" /></CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="visualizacion" className="space-y-6">
        <LoanTable title="Uso dentro del proyecto" rows={internos} />
        <LoanTable title="Préstamos a otros proyectos" rows={prestamos} />
      </TabsContent>
    </Tabs>
  );
}

function LoanTable({ title, rows }: { title: string; rows: Loan[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title} ({rows.length})</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Código</TableHead><TableHead>Herramienta</TableHead><TableHead>CECO origen</TableHead>
            <TableHead>DNI</TableHead><TableHead>Usuario</TableHead><TableHead>CECO usuario</TableHead>
            <TableHead>Entrega</TableHead><TableHead>Devolución</TableHead><TableHead>Estado</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground">Sin registros</TableCell></TableRow>
            ) : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono">{r.barcode}</TableCell>
                <TableCell>{r.toolName}</TableCell>
                <TableCell>{r.toolCeco}</TableCell>
                <TableCell>{r.dni}</TableCell>
                <TableCell>{r.userName}</TableCell>
                <TableCell>{r.userCeco}</TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                <TableCell>{r.returnedAt ? new Date(r.returnedAt).toLocaleString() : "—"}</TableCell>
                <TableCell><Badge variant={r.status === "activo" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ============== SUMINISTROS ============== */
function SuministrosSection({ deliveries, setDeliveries }: { deliveries: Delivery[]; setDeliveries: (d: Delivery[]) => void }) {
  const [supplyCode, setSupplyCode] = useState<string>("");
  const [cantidad, setCantidad] = useState(1);
  const [dni, setDni] = useState("");
  const user = USERS[dni.trim()] || null;
  const supply = SUPPLIES[supplyCode] || null;

  const handleSupplyScan = (code: string) => {
    const upper = code.toUpperCase();
    if (!SUPPLIES[upper]) { toast.error(`Suministro no encontrado: ${code}`); return; }
    setSupplyCode(upper);
    toast.success(`Suministro: ${SUPPLIES[upper].name}`);
  };

  const register = () => {
    if (!supply || !user || cantidad < 1) { toast.error("Completa todos los datos"); return; }
    setDeliveries([{
      id: crypto.randomUUID(), supplyCode, supplyName: supply.name, unidad: supply.unidad,
      cantidad, dni, userName: user.name, userCeco: user.ceco, createdAt: new Date().toISOString(),
    }, ...deliveries]);
    toast.success(`Entrega registrada: ${cantidad} ${supply.unidad} de ${supply.name}`);
    setSupplyCode(""); setCantidad(1); setDni("");
  };

  // Resumen mensual por suministro y por colaborador
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyBySupply = useMemo(() => {
    const map = new Map<string, number>();
    deliveries.filter(d => d.createdAt.slice(0, 7) === currentMonth).forEach(d => {
      map.set(d.supplyName, (map.get(d.supplyName) || 0) + d.cantidad);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [deliveries, currentMonth]);

  const monthlyByUserSupply = useMemo(() => {
    const map = new Map<string, { user: string; dni: string; supply: string; total: number; veces: number }>();
    deliveries.filter(d => d.createdAt.slice(0, 7) === currentMonth).forEach(d => {
      const key = `${d.dni}__${d.supplyName}`;
      const prev = map.get(key);
      if (prev) { prev.total += d.cantidad; prev.veces += 1; }
      else map.set(key, { user: d.userName, dni: d.dni, supply: d.supplyName, total: d.cantidad, veces: 1 });
    });
    return Array.from(map.values()).sort((a, b) => b.veces - a.veces);
  }, [deliveries, currentMonth]);

  return (
    <Tabs defaultValue="entrega" className="mt-4">
      <TabsList>
        <TabsTrigger value="entrega"><Package className="w-4 h-4 mr-2" />Entrega</TabsTrigger>
        <TabsTrigger value="historial"><ArrowRightLeft className="w-4 h-4 mr-2" />Historial</TabsTrigger>
        <TabsTrigger value="resumen"><BarChart3 className="w-4 h-4 mr-2" />Resumen mensual</TabsTrigger>
      </TabsList>

      <TabsContent value="entrega" className="space-y-4">
        <Card>
          <CardHeader><CardTitle>1. Suministro a entregar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Scanner onDetected={handleSupplyScan} label="Escanea código del suministro o selecciónalo" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Suministro</Label>
                <Select value={supplyCode} onValueChange={setSupplyCode}>
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPLIES).map(([code, s]) => (
                      <SelectItem key={code} value={code}>{s.name} ({code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cantidad {supply ? `(${supply.unidad})` : ""}</Label>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => setCantidad(Math.max(1, cantidad - 1))}><Minus className="w-4 h-4" /></Button>
                  <Input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))} className="text-center" />
                  <Button size="icon" variant="outline" onClick={() => setCantidad(cantidad + 1)}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Colaborador</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div><Label>DNI</Label><Input value={dni} onChange={(e) => setDni(e.target.value)} placeholder="Ej. 12345678" /></div>
              <div><Label>Nombre</Label><Input value={user?.name || ""} readOnly className="bg-muted" /></div>
              <div><Label>CECO</Label><Input value={user?.ceco || ""} readOnly className="bg-muted" /></div>
            </div>
            {dni && !user && <p className="text-sm text-destructive">DNI no encontrado</p>}
            <Button onClick={register} disabled={!user || !supply}>Registrar entrega</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="historial">
        <Card>
          <CardHeader><CardTitle>Historial de entregas ({deliveries.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Fecha</TableHead><TableHead>Suministro</TableHead><TableHead>Cant.</TableHead>
                <TableHead>DNI</TableHead><TableHead>Colaborador</TableHead><TableHead>CECO</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {deliveries.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Sin registros</TableCell></TableRow>
                ) : deliveries.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{new Date(d.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{d.supplyName}</TableCell>
                    <TableCell>{d.cantidad} {d.unidad}</TableCell>
                    <TableCell>{d.dni}</TableCell>
                    <TableCell>{d.userName}</TableCell>
                    <TableCell>{d.userCeco}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="resumen" className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Total por suministro — mes {currentMonth}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Suministro</TableHead><TableHead className="text-right">Veces solicitado / cantidad total</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {monthlyBySupply.length === 0 ? (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Sin entregas este mes</TableCell></TableRow>
                ) : monthlyBySupply.map(([name, total]) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell className="text-right"><Badge>{total}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Por colaborador — mes {currentMonth}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>DNI</TableHead><TableHead>Colaborador</TableHead><TableHead>Suministro</TableHead>
                <TableHead className="text-right">Veces</TableHead><TableHead className="text-right">Cant. total</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {monthlyByUserSupply.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin entregas este mes</TableCell></TableRow>
                ) : monthlyByUserSupply.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.dni}</TableCell>
                    <TableCell>{r.user}</TableCell>
                    <TableCell>{r.supply}</TableCell>
                    <TableCell className="text-right"><Badge variant="secondary">{r.veces}</Badge></TableCell>
                    <TableCell className="text-right font-semibold">{r.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
