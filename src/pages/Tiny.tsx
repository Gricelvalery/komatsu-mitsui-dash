import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Scan, RotateCcw, Package, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

// Mock catálogo de herramientas
const TOOLS: Record<string, { name: string; ceco: string }> = {
  KMMP123456: { name: "Taladro Hilti TE-7", ceco: "CECO-ANTAPACCAY-001" },
  KMMP123457: { name: "Amoladora Bosch GWS", ceco: "CECO-ANTAPACCAY-002" },
  KMMP123458: { name: "Llave Torque 1/2", ceco: "CECO-QUELLAVECO-010" },
  KMMP123459: { name: "Multímetro Fluke 87V", ceco: "CECO-BAMBAS-005" },
};

// Mock usuarios por DNI
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

const STORAGE = "tiny_loans_v1";

function loadLoans(): Loan[] {
  try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; }
}
function saveLoans(l: Loan[]) { localStorage.setItem(STORAGE, JSON.stringify(l)); }

function Scanner({ onDetected, label }: { onDetected: (code: string) => void; label: string }) {
  const [active, setActive] = useState(false);
  const [manual, setManual] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const divId = useRef(`scanner-${Math.random().toString(36).slice(2)}`).current;

  useEffect(() => {
    return () => { stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    try {
      const html5 = new Html5Qrcode(divId);
      scannerRef.current = html5;
      await html5.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 280, height: 140 } },
        (decoded) => {
          onDetected(decoded.trim());
          stop();
        },
        () => {}
      );
      setActive(true);
    } catch (e: any) {
      toast.error("No se pudo iniciar la cámara: " + (e?.message || e));
    }
  };

  const stop = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {}
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
          placeholder="O ingresa el código manualmente (ej. KMMP123456)"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && manual.trim()) { onDetected(manual.trim()); setManual(""); }
          }}
        />
        <Button variant="outline" onClick={() => { if (manual.trim()) { onDetected(manual.trim()); setManual(""); } }}>
          <Scan className="w-4 h-4 mr-2" /> Usar
        </Button>
      </div>
    </div>
  );
}

export default function Tiny() {
  const [loans, setLoans] = useState<Loan[]>(loadLoans());
  const [tool, setTool] = useState<{ barcode: string; name: string; ceco: string } | null>(null);
  const [loanType, setLoanType] = useState<LoanType | null>(null);
  const [dni, setDni] = useState("");
  const [user, setUser] = useState<{ name: string; ceco: string } | null>(null);

  useEffect(() => { saveLoans(loans); }, [loans]);

  const handleToolScan = (code: string) => {
    const t = TOOLS[code.toUpperCase()];
    if (!t) { toast.error(`Herramienta no encontrada: ${code}`); return; }
    setTool({ barcode: code.toUpperCase(), ...t });
    setLoanType(null);
    setDni("");
    setUser(null);
    toast.success(`Herramienta detectada: ${t.name}`);
  };

  const handleDniLookup = (value: string) => {
    setDni(value);
    const u = USERS[value.trim()];
    setUser(u || null);
  };

  const registerLoan = () => {
    if (!tool || !loanType || !user) { toast.error("Completa todos los datos"); return; }
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      barcode: tool.barcode,
      toolName: tool.name,
      toolCeco: tool.ceco,
      dni,
      userName: user.name,
      userCeco: user.ceco,
      type: loanType,
      status: "activo",
      createdAt: new Date().toISOString(),
    };
    setLoans([newLoan, ...loans]);
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
    <div className="p-6 space-y-6">
      <Tabs defaultValue="entrega">
        <TabsList>
          <TabsTrigger value="entrega"><Package className="w-4 h-4 mr-2" />Entrega</TabsTrigger>
          <TabsTrigger value="devolucion"><RotateCcw className="w-4 h-4 mr-2" />Devolución</TabsTrigger>
          <TabsTrigger value="visualizacion"><ArrowRightLeft className="w-4 h-4 mr-2" />Visualización</TabsTrigger>
        </TabsList>

        <TabsContent value="entrega" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>1. Escanear código de barras de la herramienta</CardTitle></CardHeader>
            <CardContent>
              <Scanner onDetected={handleToolScan} label="Apunta al código (ej. KMMP123456)" />
            </CardContent>
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
              <CardHeader><CardTitle>3. Usuario que recibe ({loanType === "interno" ? "mismo proyecto" : "otro proyecto"})</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>DNI</Label>
                    <Input value={dni} onChange={(e) => handleDniLookup(e.target.value)} placeholder="Ej. 12345678" />
                  </div>
                  <div>
                    <Label>Nombre</Label>
                    <Input value={user?.name || ""} readOnly placeholder="Auto" className="bg-muted" />
                  </div>
                  <div>
                    <Label>CECO del usuario</Label>
                    <Input value={user?.ceco || ""} readOnly placeholder="Auto" className="bg-muted" />
                  </div>
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
            <CardContent>
              <Scanner onDetected={handleReturn} label="Si no tiene código, ingrésalo manualmente" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualizacion" className="space-y-6">
          <LoanTable title="Uso dentro del proyecto" rows={internos} />
          <LoanTable title="Préstamos a otros proyectos" rows={prestamos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoanTable({ title, rows }: { title: string; rows: Loan[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title} ({rows.length})</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Herramienta</TableHead>
              <TableHead>CECO origen</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>CECO usuario</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Devolución</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
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
                <TableCell>
                  <Badge variant={r.status === "activo" ? "default" : "secondary"}>{r.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
