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
  FileText,
} from "lucide-react";

// Types
interface Acuerdo {
  id: number;
  reunionId: string;
  reunion: string;
  proyecto: string;
  fecha: string;
  categoria: string;
  tarea: string;
  responsable: string;
  fechaEstimada: string;
  estatus: "Cerrado" | "Abierto" | "En Progreso" | "Pendiente";
  prioridad: "Alta" | "Media" | "Baja";
  tiempoMin: number;
  avance: number;
}

interface Reunion {
  id: string;
  titulo: string;
  fecha: string;
  proyecto: string;
  reflexion: string;
  asistentes: { nombre: string; area: string }[];
  ausentes: { nombre: string; area: string }[];
}

// Data: Reuniones
const reunionesData: Reunion[] = [
  {
    id: "spcc-gh-ssomac",
    titulo: "Reunión SPCC - GH & SSOMAC",
    fecha: "11/08/2025",
    proyecto: "SPCC",
    reflexion:
      "El área comercial asumirá el servicio de transferencia de costos de camiones y palas, con presupuestos claros y aprobados, incluyendo mano de obra y reclasificaciones. Todo deberá contar con respaldo formal y no se permitirán ajustes posteriores al budget ya aprobado por el directorio. La permanencia del especialista de SPCC debe ser a cargo de la Gerencia General y se corregirá la carga de costos de camiones a palas, verificando que estén alineados al presupuesto.",
    asistentes: [
      { nombre: "Kateryn Fernandez", area: "Mejora Continua" },
      { nombre: "Juan Vistoso", area: "Servicios Minería y KRCP" },
      { nombre: "Karla Barrios", area: "Servicios Minería y KRCP" },
      { nombre: "Raziel Postigo", area: "Servicios Minería y KRCP" },
      { nombre: "Gina Cavaglia", area: "Servicios Minería y KRCP" },
    ],
    ausentes: [{ nombre: "Martin Fukuda", area: "Servicios Minería y KRCP" }],
  },
  {
    id: "forecast",
    titulo: "Reunión Forecast",
    fecha: "20/08/2025",
    proyecto: "Multi-proyecto",
    reflexion:
      "Se refuerza el cumplimiento de horarios en reuniones como parte de la disciplina organizacional. Modificación de 3 motores para aprobación de camiones por parte del cliente. Margen por camión: $107,600 (vs. $129,000 en Antamina). Se solicita análisis del delta y exclusión de componentes sin margen del forecast de ventas. Venta de Tolvas: margen actual 21%, ahorro estimado $78,000. Se perdió el servicio estructural en Bayóvar, se busca adjudicación en Las Bambas. Antapaccay requiere creatividad para alcanzar meta financiera de $200,000.",
    asistentes: [
      { nombre: "Kateryn Fernandez", area: "Mejora Continua" },
      { nombre: "Paola Palaco", area: "Control de Costos" },
      { nombre: "Astrid Lucano", area: "Control de Costos" },
      { nombre: "Josselling Vilchez", area: "Control de Costos" },
      { nombre: "Gina Cavaglia", area: "Administración" },
      { nombre: "Katy Leon", area: "Planificación" },
      { nombre: "Marco Carhuallanqui", area: "Armado Palas, Toromocho y Marcobre" },
      { nombre: "Peter Garrido", area: "Armado Camiones" },
    ],
    ausentes: [{ nombre: "Martin Fukuda", area: "Centralizado" }],
  },
  {
    id: "trabajo-restringido",
    titulo: "Reunión Casos de Trabajo Restringido e Incapacidad",
    fecha: "20/08/2025",
    proyecto: "Servicios Minería",
    reflexion:
      "Se presentó el proceso de gestión de restricciones médicas e incapacidad. Se recomendó que, tras culminar los descansos médicos, se evalúe otorgar vacaciones al colaborador como medida de recuperación adicional. Se propuso establecer un ratio estándar para evaluar reemplazos, alineado con las recomendaciones de Gestión Humana. Se destacó la importancia de reforzar el autocuidado en inducciones y charlas de seguridad. Cada caso debe ser evaluado individualmente. Se acordó seguimiento conjunto y visibilidad semestral de la data de ausentismo. Se planteó mejorar el ratio de obesidad y fortalecer el programa 'Perder para Ganar'.",
    asistentes: [
      { nombre: "Kateryn Fernandez", area: "Mejora Continua" },
      { nombre: "Mery Palomino", area: "Gestión Humana" },
      { nombre: "Luis Arellano", area: "Gestión Humana" },
      { nombre: "Julio Noel", area: "Bayóvar" },
      { nombre: "Daniel Reyes", area: "Bambas" },
      { nombre: "Marco Carhuallanqui", area: "Armado Palas, Toromocho y Marcobre" },
      { nombre: "Raziel Postigo", area: "Cerro Verde, SPCC y Quellaveco" },
      { nombre: "Luis Coronado", area: "Gestión Humana" },
      { nombre: "Guillermo Coloma", area: "Gestión Humana" },
    ],
    ausentes: [
      { nombre: "Giancarlo Crippa", area: "Antamina" },
      { nombre: "Richard Arroyo", area: "Antapaccay" },
    ],
  },
];

// Data: Acuerdos
const acuerdosData: Acuerdo[] = [
  // SPCC
  { id: 1, reunionId: "spcc-gh-ssomac", reunion: "SPCC - GH & SSOMAC", proyecto: "SPCC", fecha: "11/08/2025", categoria: "Presupuesto", tarea: "VB del Budget que asume comercial", responsable: "Gina Cavaglia", fechaEstimada: "11/08/2025", estatus: "Cerrado", prioridad: "Alta", tiempoMin: 15, avance: 100 },
  { id: 2, reunionId: "spcc-gh-ssomac", reunion: "SPCC - GH & SSOMAC", proyecto: "SPCC", fecha: "11/08/2025", categoria: "Comercial", tarea: "Envío del avance del consumo del Budget que asume comercial", responsable: "Gina Cavaglia", fechaEstimada: "11/08/2025", estatus: "Cerrado", prioridad: "Alta", tiempoMin: 10, avance: 100 },
  { id: 3, reunionId: "spcc-gh-ssomac", reunion: "SPCC - GH & SSOMAC", proyecto: "SPCC", fecha: "11/08/2025", categoria: "Operaciones", tarea: "Transferencia de costos de camiones y palas con presupuestos claros", responsable: "Área Comercial", fechaEstimada: "15/08/2025", estatus: "En Progreso", prioridad: "Alta", tiempoMin: 30, avance: 60 },
  { id: 4, reunionId: "spcc-gh-ssomac", reunion: "SPCC - GH & SSOMAC", proyecto: "SPCC", fecha: "11/08/2025", categoria: "RRHH", tarea: "Permanencia del especialista SPCC a cargo de Gerencia General", responsable: "Gerencia General", fechaEstimada: "18/08/2025", estatus: "Abierto", prioridad: "Media", tiempoMin: 20, avance: 25 },
  { id: 5, reunionId: "spcc-gh-ssomac", reunion: "SPCC - GH & SSOMAC", proyecto: "SPCC", fecha: "11/08/2025", categoria: "Finanzas", tarea: "Asegurar pagos oportunos a proveedores", responsable: "Raziel Postigo", fechaEstimada: "12/08/2025", estatus: "En Progreso", prioridad: "Alta", tiempoMin: 15, avance: 40 },
  { id: 6, reunionId: "spcc-gh-ssomac", reunion: "SPCC - GH & SSOMAC", proyecto: "SPCC", fecha: "11/08/2025", categoria: "Operaciones", tarea: "Corregir carga de costos de camiones a palas alineados al presupuesto", responsable: "Juan Vistoso", fechaEstimada: "14/08/2025", estatus: "Abierto", prioridad: "Media", tiempoMin: 25, avance: 10 },
  // Forecast
  { id: 7, reunionId: "forecast", reunion: "Forecast", proyecto: "Multi-proyecto", fecha: "20/08/2025", categoria: "Comercial", tarea: "Análisis del delta de margen por camión ($107,600 vs $129,000 Antamina)", responsable: "Peter Garrido", fechaEstimada: "27/08/2025", estatus: "Pendiente", prioridad: "Alta", tiempoMin: 30, avance: 0 },
  { id: 8, reunionId: "forecast", reunion: "Forecast", proyecto: "Multi-proyecto", fecha: "20/08/2025", categoria: "Comercial", tarea: "Exclusión de componentes sin margen (SCI) del forecast de ventas", responsable: "Gina Cavaglia", fechaEstimada: "25/08/2025", estatus: "Pendiente", prioridad: "Alta", tiempoMin: 20, avance: 0 },
  { id: 9, reunionId: "forecast", reunion: "Forecast", proyecto: "Multi-proyecto", fecha: "20/08/2025", categoria: "Operaciones", tarea: "Renegociar margen de tolvas con Comercial (margen actual 21%)", responsable: "Paola Palaco", fechaEstimada: "01/09/2025", estatus: "Pendiente", prioridad: "Media", tiempoMin: 25, avance: 0 },
  { id: 10, reunionId: "forecast", reunion: "Forecast", proyecto: "Antapaccay", fecha: "20/08/2025", categoria: "Finanzas", tarea: "Plan de creatividad para alcanzar meta financiera de $200,000 en Antapaccay", responsable: "Marco Carhuallanqui", fechaEstimada: "01/09/2025", estatus: "Pendiente", prioridad: "Alta", tiempoMin: 30, avance: 0 },
  { id: 11, reunionId: "forecast", reunion: "Forecast", proyecto: "Las Bambas", fecha: "20/08/2025", categoria: "Operaciones", tarea: "Confirmación de contrato de soldadura en Las Bambas", responsable: "Katy Leon", fechaEstimada: "30/08/2025", estatus: "Pendiente", prioridad: "Media", tiempoMin: 15, avance: 0 },
  { id: 12, reunionId: "forecast", reunion: "Forecast", proyecto: "Bayóvar", fecha: "20/08/2025", categoria: "Finanzas", tarea: "Separar depreciación de camiones, MARC y alquileres para análisis financiero", responsable: "Astrid Lucano", fechaEstimada: "28/08/2025", estatus: "Pendiente", prioridad: "Media", tiempoMin: 20, avance: 0 },
  // Trabajo Restringido
  { id: 13, reunionId: "trabajo-restringido", reunion: "Trabajo Restringido", proyecto: "Servicios Minería", fecha: "20/08/2025", categoria: "RRHH", tarea: "Enviar procedimiento actualizado de restricciones médicas e incapacidad", responsable: "Mery Palomino", fechaEstimada: "05/09/2025", estatus: "Pendiente", prioridad: "Alta", tiempoMin: 20, avance: 0 },
  { id: 14, reunionId: "trabajo-restringido", reunion: "Trabajo Restringido", proyecto: "Servicios Minería", fecha: "20/08/2025", categoria: "RRHH", tarea: "Definir ratio estándar para evaluar reemplazos de personal", responsable: "Mery Palomino", fechaEstimada: "05/09/2025", estatus: "Pendiente", prioridad: "Alta", tiempoMin: 25, avance: 0 },
];

const getPrioridadStyle = (prioridad: string) => {
  switch (prioridad) {
    case "Alta": return "bg-red-100 text-red-800 border-red-200";
    case "Media": return "bg-amber-100 text-amber-800 border-amber-200";
    case "Baja": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const getEstatusStyle = (estatus: string) => {
  switch (estatus) {
    case "Cerrado": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "En Progreso": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Abierto": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Pendiente": return "bg-slate-100 text-slate-800 border-slate-200";
    default: return "bg-muted text-muted-foreground";
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
  const [reunionSeleccionada, setReunionSeleccionada] = useState("todas");
  const [filtroProyecto, setFiltroProyecto] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroEstatus, setFiltroEstatus] = useState("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const acuerdosFiltradosPorReunion = reunionSeleccionada === "todas"
    ? acuerdosData
    : acuerdosData.filter((a) => a.reunionId === reunionSeleccionada);

  const filtrados = acuerdosFiltradosPorReunion.filter((a) => {
    if (filtroProyecto !== "todos" && a.proyecto !== filtroProyecto) return false;
    if (filtroCategoria !== "todos" && a.categoria !== filtroCategoria) return false;
    if (filtroEstatus !== "todos" && a.estatus !== filtroEstatus) return false;
    if (filtroPrioridad !== "todos" && a.prioridad !== filtroPrioridad) return false;
    if (busqueda && !a.tarea.toLowerCase().includes(busqueda.toLowerCase()) && !a.responsable.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const total = acuerdosFiltradosPorReunion.length;
  const cerrados = acuerdosFiltradosPorReunion.filter((a) => a.estatus === "Cerrado").length;
  const enProgreso = acuerdosFiltradosPorReunion.filter((a) => a.estatus === "En Progreso").length;
  const abiertos = acuerdosFiltradosPorReunion.filter((a) => a.estatus === "Abierto" || a.estatus === "Pendiente").length;
  const avanceGlobal = total > 0 ? Math.round(acuerdosFiltradosPorReunion.reduce((sum, a) => sum + a.avance, 0) / total) : 0;
  const tiempoTotal = acuerdosFiltradosPorReunion.reduce((sum, a) => sum + a.tiempoMin, 0);

  const proyectos = [...new Set(acuerdosFiltradosPorReunion.map((a) => a.proyecto))];
  const categorias = [...new Set(acuerdosFiltradosPorReunion.map((a) => a.categoria))];

  const reunionActiva = reunionSeleccionada !== "todas"
    ? reunionesData.find((r) => r.id === reunionSeleccionada)
    : null;

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            📋 Agenda de Reuniones
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Seguimiento de acuerdos y compromisos multi-proyecto
          </p>
        </div>
        <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 text-primary">
          {reunionesData.length} reuniones registradas
        </Badge>
      </div>

      {/* Reunion Selector - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card
          className={`cursor-pointer transition-all border-2 ${
            reunionSeleccionada === "todas"
              ? "border-primary bg-primary/5 shadow-md"
              : "border-transparent hover:border-muted-foreground/20"
          }`}
          onClick={() => setReunionSeleccionada("todas")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Todas las Reuniones</span>
            </div>
            <p className="text-xs text-muted-foreground">{acuerdosData.length} acuerdos totales</p>
          </CardContent>
        </Card>
        {reunionesData.map((r) => {
          const count = acuerdosData.filter((a) => a.reunionId === r.id).length;
          return (
            <Card
              key={r.id}
              className={`cursor-pointer transition-all border-2 ${
                reunionSeleccionada === r.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-transparent hover:border-muted-foreground/20"
              }`}
              onClick={() => setReunionSeleccionada(r.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarCheck className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground truncate">{r.titulo}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{r.fecha}</span>
                  <span>•</span>
                  <span>{r.proyecto}</span>
                  <span>•</span>
                  <span>{count} acuerdos</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ListChecks className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Acuerdos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{total}</p>
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
              <span className="text-xs text-muted-foreground">Abiertos/Pendientes</span>
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

      {/* Reunion Detail (when one is selected) */}
      {reunionActiva && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-primary" />
                {reunionActiva.titulo}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Fecha: {reunionActiva.fecha} | Proyecto: {reunionActiva.proyecto}
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground mb-2">📝 Reflexión:</p>
                <p>{reunionActiva.reflexion}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Asistentes ({reunionActiva.asistentes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[280px] overflow-y-auto">
              {reunionActiva.asistentes.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {a.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.nombre}</p>
                    <p className="text-[10px] text-muted-foreground">{a.area}</p>
                  </div>
                </div>
              ))}
              {reunionActiva.ausentes.length > 0 && (
                <div className="border-t pt-2 mt-2">
                  <p className="text-[10px] text-muted-foreground mb-1">Ausentes:</p>
                  {reunionActiva.ausentes.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 opacity-50">
                      <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-bold text-destructive shrink-0">
                        {a.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{a.nombre}</p>
                        <p className="text-[10px] text-muted-foreground">{a.area}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

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
                <SelectItem value="Pendiente">Pendiente</SelectItem>
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
                <TableHead className="text-xs font-semibold">Proyecto</TableHead>
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
                  <TableCell className="text-xs max-w-[120px] truncate">{acuerdo.reunion}</TableCell>
                  <TableCell className="text-xs">{acuerdo.proyecto}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${getCategoriaStyle(acuerdo.categoria)}`}>
                      {acuerdo.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs max-w-[220px]">{acuerdo.tarea}</TableCell>
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
                      <Progress value={acuerdo.avance} className="h-1.5 w-12" />
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
                  <TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-8">
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
