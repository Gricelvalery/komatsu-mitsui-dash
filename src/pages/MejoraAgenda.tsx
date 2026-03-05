import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Filter,
  ListChecks,
  Users,
  AlertTriangle,
  Target,
} from "lucide-react";

interface Acuerdo {
  id: number;
  reunion: string;
  proyecto: string;
  fecha: string;
  categoria: string;
  tarea: string;
  responsable: string;
  fechaEstimada: string;
  estatus: "Cerrado" | "Abierto" | "En Progreso";
  prioridad: "Alta" | "Media" | "Baja";
  tiempoMin: number;
  avance: number;
}

const acuerdosData: Acuerdo[] = [
  {
    id: 1,
    reunion: "Reunión SPCC - GH & SSOMAC",
    proyecto: "SPCC",
    fecha: "11/08/2025",
    categoria: "Presupuesto",
    tarea: "VB del Budget que asume comercial",
    responsable: "Gina Cavaglia",
    fechaEstimada: "11/08/2025",
    estatus: "Cerrado",
    prioridad: "Alta",
    tiempoMin: 15,
    avance: 100,
  },
  {
    id: 2,
    reunion: "Reunión SPCC - GH & SSOMAC",
    proyecto: "SPCC",
    fecha: "11/08/2025",
    categoria: "Comercial",
    tarea: "Envío del avance del consumo del Budget que asume comercial",
    responsable: "Gina Cavaglia",
    fechaEstimada: "11/08/2025",
    estatus: "Cerrado",
    prioridad: "Alta",
    tiempoMin: 10,
    avance: 100,
  },
  {
    id: 3,
    reunion: "Reunión SPCC - GH & SSOMAC",
    proyecto: "SPCC",
    fecha: "11/08/2025",
    categoria: "Operaciones",
    tarea: "Transferencia de costos de camiones y palas con presupuestos claros",
    responsable: "Área Comercial",
    fechaEstimada: "15/08/2025",
    estatus: "En Progreso",
    prioridad: "Alta",
    tiempoMin: 30,
    avance: 60,
  },
  {
    id: 4,
    reunion: "Reunión SPCC - GH & SSOMAC",
    proyecto: "SPCC",
    fecha: "11/08/2025",
    categoria: "RRHH",
    tarea: "Permanencia del especialista SPCC a cargo de Gerencia General",
    responsable: "Gerencia General",
    fechaEstimada: "18/08/2025",
    estatus: "Abierto",
    prioridad: "Media",
    tiempoMin: 20,
    avance: 25,
  },
  {
    id: 5,
    reunion: "Reunión SPCC - GH & SSOMAC",
    proyecto: "SPCC",
    fecha: "11/08/2025",
    categoria: "Finanzas",
    tarea: "Asegurar pagos oportunos a proveedores",
    responsable: "Raziel Postigo",
    fechaEstimada: "12/08/2025",
    estatus: "En Progreso",
    prioridad: "Alta",
    tiempoMin: 15,
    avance: 40,
  },
  {
    id: 6,
    reunion: "Reunión SPCC - GH & SSOMAC",
    proyecto: "SPCC",
    fecha: "11/08/2025",
    categoria: "Operaciones",
    tarea: "Corregir carga de costos de camiones a palas alineados al presupuesto",
    responsable: "Juan Vistoso",
    fechaEstimada: "14/08/2025",
    estatus: "Abierto",
    prioridad: "Media",
    tiempoMin: 25,
    avance: 10,
  },
];

const asistentes = [
  { nombre: "Kateryn Fernandez", area: "Mejora Continua" },
  { nombre: "Juan Vistoso", area: "Servicios Minería y KRCP" },
  { nombre: "Karla Barrios", area: "Servicios Minería y KRCP" },
  { nombre: "Raziel Postigo", area: "Servicios Minería y KRCP" },
  { nombre: "Gina Cavaglia", area: "Servicios Minería y KRCP" },
];

const ausentes = [
  { nombre: "Martin Fukuda", area: "Servicios Minería y KRCP" },
];

const getPrioridadStyle = (prioridad: string) => {
  switch (prioridad) {
    case "Alta":
      return "bg-red-100 text-red-800 border-red-200";
    case "Media":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Baja":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getEstatusStyle = (estatus: string) => {
  switch (estatus) {
    case "Cerrado":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "En Progreso":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Abierto":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getCategoriaStyle = (categoria: string) => {
  const styles: Record<string, string> = {
    Presupuesto: "bg-violet-100 text-violet-800 border-violet-200",
    Comercial: "bg-sky-100 text-sky-800 border-sky-200",
    Operaciones: "bg-indigo-100 text-indigo-800 border-indigo-200",
    RRHH: "bg-pink-100 text-pink-800 border-pink-200",
    Finanzas: "bg-teal-100 text-teal-800 border-teal-200",
    SSOMA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return styles[categoria] || "bg-muted text-muted-foreground";
};

export default function MejoraAgenda() {
  const [filtroProyecto, setFiltroProyecto] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroEstatus, setFiltroEstatus] = useState("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const filtrados = acuerdosData.filter((a) => {
    if (filtroProyecto !== "todos" && a.proyecto !== filtroProyecto) return false;
    if (filtroCategoria !== "todos" && a.categoria !== filtroCategoria) return false;
    if (filtroEstatus !== "todos" && a.estatus !== filtroEstatus) return false;
    if (filtroPrioridad !== "todos" && a.prioridad !== filtroPrioridad) return false;
    if (busqueda && !a.tarea.toLowerCase().includes(busqueda.toLowerCase()) && !a.responsable.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const totalAcuerdos = acuerdosData.length;
  const cerrados = acuerdosData.filter((a) => a.estatus === "Cerrado").length;
  const enProgreso = acuerdosData.filter((a) => a.estatus === "En Progreso").length;
  const abiertos = acuerdosData.filter((a) => a.estatus === "Abierto").length;
  const avanceGlobal = Math.round(acuerdosData.reduce((sum, a) => sum + a.avance, 0) / totalAcuerdos);
  const tiempoTotal = acuerdosData.reduce((sum, a) => sum + a.tiempoMin, 0);
  const proyectos = [...new Set(acuerdosData.map((a) => a.proyecto))];
  const categorias = [...new Set(acuerdosData.map((a) => a.categoria))];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            📋 Agenda de Reuniones
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Seguimiento de acuerdos y compromisos por reunión
          </p>
        </div>
        <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 text-primary">
          Última reunión: 11/08/2025 — SPCC
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ListChecks className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Acuerdos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalAcuerdos}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-muted-foreground">Cerrados</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{cerrados}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">En Progreso</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{enProgreso}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-muted-foreground">Abiertos</span>
            </div>
            <p className="text-2xl font-bold text-orange-700">{abiertos}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-violet-600" />
              <span className="text-xs text-muted-foreground">Avance Global</span>
            </div>
            <p className="text-2xl font-bold text-violet-700">{avanceGlobal}%</p>
            <Progress value={avanceGlobal} className="h-1.5 mt-1" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-teal-600" />
              <span className="text-xs text-muted-foreground">Tiempo Total</span>
            </div>
            <p className="text-2xl font-bold text-teal-700">{tiempoTotal} min</p>
          </CardContent>
        </Card>
      </div>

      {/* Reunión Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              Reunión: Servicios Minería y KRCP – GH & SSOMAC
            </CardTitle>
            <p className="text-xs text-muted-foreground">Fecha: 11/08/2025 | Proyecto: SPCC</p>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground mb-2">📝 Reflexión:</p>
              <p>
                El área comercial asumirá el servicio de transferencia de costos de camiones y palas, 
                con presupuestos claros y aprobados, incluyendo mano de obra y reclasificaciones. 
                Todo deberá contar con respaldo formal y no se permitirán ajustes posteriores al budget 
                ya aprobado por el directorio. La permanencia del especialista de SPCC debe ser a cargo 
                de la Gerencia General y se corregirá la carga de costos de camiones a palas, verificando 
                que estén alineados al presupuesto.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Asistentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {asistentes.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {a.nombre.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.nombre}</p>
                  <p className="text-[10px] text-muted-foreground">{a.area}</p>
                </div>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <p className="text-[10px] text-muted-foreground mb-1">Ausente:</p>
              {ausentes.map((a, i) => (
                <div key={i} className="flex items-center gap-2 opacity-50">
                  <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-bold text-destructive">
                    {a.nombre.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.nombre}</p>
                    <p className="text-[10px] text-muted-foreground">{a.area}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Filtros</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input
              placeholder="Buscar tarea o responsable..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="text-sm"
            />
            <Select value={filtroProyecto} onValueChange={setFiltroProyecto}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los proyectos</SelectItem>
                {proyectos.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las categorías</SelectItem>
                {categorias.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroEstatus} onValueChange={setFiltroEstatus}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Estatus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Cerrado">Cerrado</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Abierto">Abierto</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Acuerdos y Compromisos ({filtrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">Reunión</TableHead>
                <TableHead className="text-xs font-semibold">Categoría</TableHead>
                <TableHead className="text-xs font-semibold">Tarea</TableHead>
                <TableHead className="text-xs font-semibold">Responsable</TableHead>
                <TableHead className="text-xs font-semibold">Fecha Est.</TableHead>
                <TableHead className="text-xs font-semibold">Prioridad</TableHead>
                <TableHead className="text-xs font-semibold">Tiempo</TableHead>
                <TableHead className="text-xs font-semibold">Avance</TableHead>
                <TableHead className="text-xs font-semibold">Estatus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((acuerdo) => (
                <TableRow key={acuerdo.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs max-w-[140px] truncate">{acuerdo.reunion}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${getCategoriaStyle(acuerdo.categoria)}`}>
                      {acuerdo.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs max-w-[250px]">{acuerdo.tarea}</TableCell>
                  <TableCell className="text-xs font-medium">{acuerdo.responsable}</TableCell>
                  <TableCell className="text-xs">{acuerdo.fechaEstimada}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${getPrioridadStyle(acuerdo.prioridad)}`}>
                      {acuerdo.prioridad}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{acuerdo.tiempoMin} min</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={acuerdo.avance} className="h-1.5 w-16" />
                      <span className="text-[10px] text-muted-foreground">{acuerdo.avance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${getEstatusStyle(acuerdo.estatus)}`}>
                      {acuerdo.estatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-sm text-muted-foreground">
                    No se encontraron acuerdos con los filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
