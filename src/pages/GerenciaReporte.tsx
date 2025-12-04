import { useState } from "react";
import { Search, Filter, RefreshCw, FileText, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProjectSummary {
  id: string;
  proyecto: string;
  categoria: "Seguridad" | "Disponibilidad" | "Gestión" | "Riesgos";
  resumen: string;
  archivo: string;
  tipoArchivo: "pdf" | "docx" | "xlsx" | "pptx";
  fechaActualizacion: string;
  estado: "actualizado" | "pendiente" | "alerta";
}

// Datos de ejemplo simulando 20 proyectos
const sampleData: ProjectSummary[] = [
  {
    id: "1",
    proyecto: "Proyecto Antapaccay",
    categoria: "Seguridad",
    resumen: "Cumplimiento 95%, 2 incidentes menores reportados. Capacitación completada al 100%.",
    archivo: "Seguridad_Antapaccay_Ene2025.pdf",
    tipoArchivo: "pdf",
    fechaActualizacion: "2025-01-15",
    estado: "actualizado",
  },
  {
    id: "2",
    proyecto: "Proyecto Antapaccay",
    categoria: "Disponibilidad",
    resumen: "Uptime 99.2%, mantenimiento programado completado. Próximo PM en 15 días.",
    archivo: "Disponibilidad_Report.xlsx",
    tipoArchivo: "xlsx",
    fechaActualizacion: "2025-01-14",
    estado: "actualizado",
  },
  {
    id: "3",
    proyecto: "Proyecto Antapaccay",
    categoria: "Gestión",
    resumen: "Avance 87% en hitos del mes. 3 tareas críticas completadas, 2 pendientes.",
    archivo: "Gestion_Mensual.docx",
    tipoArchivo: "docx",
    fechaActualizacion: "2025-01-10",
    estado: "pendiente",
  },
  {
    id: "4",
    proyecto: "Proyecto Antapaccay",
    categoria: "Riesgos",
    resumen: "5 riesgos identificados, 2 mitigados. Riesgo alto en cadena de suministro.",
    archivo: "Matriz_Riesgos.xlsx",
    tipoArchivo: "xlsx",
    fechaActualizacion: "2025-01-08",
    estado: "alerta",
  },
  {
    id: "5",
    proyecto: "Proyecto Quellaveco",
    categoria: "Seguridad",
    resumen: "Sin incidentes en 45 días. Auditoría externa aprobada con observaciones menores.",
    archivo: "Informe_Seguridad_Q1.pdf",
    tipoArchivo: "pdf",
    fechaActualizacion: "2025-01-15",
    estado: "actualizado",
  },
  {
    id: "6",
    proyecto: "Proyecto Quellaveco",
    categoria: "Disponibilidad",
    resumen: "Flota operativa al 94%. 3 equipos en mantenimiento correctivo programado.",
    archivo: "Estado_Flota.xlsx",
    tipoArchivo: "xlsx",
    fechaActualizacion: "2025-01-13",
    estado: "actualizado",
  },
  {
    id: "7",
    proyecto: "Proyecto Quellaveco",
    categoria: "Gestión",
    resumen: "KPIs en verde. Reunión de seguimiento programada para próxima semana.",
    archivo: "Dashboard_Gestion.pptx",
    tipoArchivo: "pptx",
    fechaActualizacion: "2025-01-12",
    estado: "actualizado",
  },
  {
    id: "8",
    proyecto: "Proyecto Quellaveco",
    categoria: "Riesgos",
    resumen: "Riesgo climático elevado por temporada. Plan de contingencia activado.",
    archivo: "Riesgos_Operativos.pdf",
    tipoArchivo: "pdf",
    fechaActualizacion: "2025-01-11",
    estado: "alerta",
  },
  {
    id: "9",
    proyecto: "Proyecto Cerro Verde",
    categoria: "Seguridad",
    resumen: "Certificación ISO 45001 renovada. Programa de seguridad actualizado.",
    archivo: "Certificacion_ISO.pdf",
    tipoArchivo: "pdf",
    fechaActualizacion: "2025-01-14",
    estado: "actualizado",
  },
  {
    id: "10",
    proyecto: "Proyecto Cerro Verde",
    categoria: "Disponibilidad",
    resumen: "Disponibilidad mecánica 96.5%. Nuevo récord mensual alcanzado.",
    archivo: "Metricas_Disponibilidad.xlsx",
    tipoArchivo: "xlsx",
    fechaActualizacion: "2025-01-15",
    estado: "actualizado",
  },
  {
    id: "11",
    proyecto: "Proyecto Cerro Verde",
    categoria: "Gestión",
    resumen: "Presupuesto ejecutado al 78%. Proyección de cierre dentro del margen.",
    archivo: "Reporte_Financiero.xlsx",
    tipoArchivo: "xlsx",
    fechaActualizacion: "2025-01-09",
    estado: "pendiente",
  },
  {
    id: "12",
    proyecto: "Proyecto Cerro Verde",
    categoria: "Riesgos",
    resumen: "3 riesgos nuevos identificados en evaluación trimestral. Seguimiento activo.",
    archivo: "Eval_Riesgos_Q1.docx",
    tipoArchivo: "docx",
    fechaActualizacion: "2025-01-07",
    estado: "pendiente",
  },
  {
    id: "13",
    proyecto: "Proyecto Las Bambas",
    categoria: "Seguridad",
    resumen: "Simulacro de emergencia completado. 98% de participación del personal.",
    archivo: "Simulacro_Report.pdf",
    tipoArchivo: "pdf",
    fechaActualizacion: "2025-01-13",
    estado: "actualizado",
  },
  {
    id: "14",
    proyecto: "Proyecto Las Bambas",
    categoria: "Disponibilidad",
    resumen: "Flota de camiones 93% operativa. 2 unidades en overhaul programado.",
    archivo: "Estado_Equipos.xlsx",
    tipoArchivo: "xlsx",
    fechaActualizacion: "2025-01-12",
    estado: "actualizado",
  },
  {
    id: "15",
    proyecto: "Proyecto Las Bambas",
    categoria: "Gestión",
    resumen: "Contrato de servicios renovado. Nuevos SLAs implementados.",
    archivo: "Contrato_2025.docx",
    tipoArchivo: "docx",
    fechaActualizacion: "2025-01-10",
    estado: "actualizado",
  },
  {
    id: "16",
    proyecto: "Proyecto Las Bambas",
    categoria: "Riesgos",
    resumen: "Riesgo social bajo control. Diálogo comunitario en progreso positivo.",
    archivo: "Gestion_Social.pdf",
    tipoArchivo: "pdf",
    fechaActualizacion: "2025-01-08",
    estado: "actualizado",
  },
  {
    id: "17",
    proyecto: "Proyecto Toromocho",
    categoria: "Seguridad",
    resumen: "Índice de frecuencia en mínimo histórico. Reconocimiento corporativo recibido.",
    archivo: "Indicadores_SSO.xlsx",
    tipoArchivo: "xlsx",
    fechaActualizacion: "2025-01-14",
    estado: "actualizado",
  },
  {
    id: "18",
    proyecto: "Proyecto Toromocho",
    categoria: "Disponibilidad",
    resumen: "Sistema de monitoreo actualizado. Alertas predictivas implementadas.",
    archivo: "Sistema_Monitoreo.pptx",
    tipoArchivo: "pptx",
    fechaActualizacion: "2025-01-11",
    estado: "actualizado",
  },
  {
    id: "19",
    proyecto: "Proyecto Toromocho",
    categoria: "Gestión",
    resumen: "Revisión de procesos completada. 5 mejoras implementadas este mes.",
    archivo: "Mejora_Continua.docx",
    tipoArchivo: "docx",
    fechaActualizacion: "2025-01-09",
    estado: "actualizado",
  },
  {
    id: "20",
    proyecto: "Proyecto Toromocho",
    categoria: "Riesgos",
    resumen: "Auditoría de riesgos programada para febrero. Preparación en curso.",
    archivo: "Plan_Auditoria.pdf",
    tipoArchivo: "pdf",
    fechaActualizacion: "2025-01-06",
    estado: "pendiente",
  },
];

const categoriaColors: Record<string, string> = {
  Seguridad: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Disponibilidad: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Gestión: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Riesgos: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const tipoArchivoIcons: Record<string, string> = {
  pdf: "📄",
  docx: "📝",
  xlsx: "📊",
  pptx: "📽️",
};

const estadoConfig = {
  actualizado: { icon: CheckCircle, color: "text-emerald-400", label: "Actualizado" },
  pendiente: { icon: Clock, color: "text-amber-400", label: "Pendiente" },
  alerta: { icon: AlertCircle, color: "text-red-400", label: "Alerta" },
};

export default function GerenciaReporte() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProyecto, setFilterProyecto] = useState<string>("todos");
  const [filterCategoria, setFilterCategoria] = useState<string>("todos");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const proyectos = [...new Set(sampleData.map((d) => d.proyecto))];
  const categorias = [...new Set(sampleData.map((d) => d.categoria))];

  const filteredData = sampleData.filter((item) => {
    const matchesSearch =
      item.proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.resumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.archivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProyecto = filterProyecto === "todos" || item.proyecto === filterProyecto;
    const matchesCategoria = filterCategoria === "todos" || item.categoria === filterCategoria;
    return matchesSearch && matchesProyecto && matchesCategoria;
  });

  // Agrupar por proyecto
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.proyecto]) {
      acc[item.proyecto] = [];
    }
    acc[item.proyecto].push(item);
    return acc;
  }, {} as Record<string, ProjectSummary[]>);

  const toggleRow = (proyecto: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(proyecto)) {
      newExpanded.delete(proyecto);
    } else {
      newExpanded.add(proyecto);
    }
    setExpandedRows(newExpanded);
  };

  const stats = {
    total: sampleData.length,
    actualizados: sampleData.filter((d) => d.estado === "actualizado").length,
    pendientes: sampleData.filter((d) => d.estado === "pendiente").length,
    alertas: sampleData.filter((d) => d.estado === "alerta").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Documentos</p>
            </div>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.actualizados}</p>
              <p className="text-xs text-muted-foreground">Actualizados</p>
            </div>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pendientes}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.alertas}</p>
              <p className="text-xs text-muted-foreground">Alertas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyecto, resumen o archivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
          </div>
          <Select value={filterProyecto} onValueChange={setFilterProyecto}>
            <SelectTrigger className="w-[200px] bg-background/50">
              <SelectValue placeholder="Filtrar por proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los proyectos</SelectItem>
              {proyectos.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              {categorias.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Tabla agrupada por proyecto */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="text-foreground font-semibold">Proyecto / Categoría</TableHead>
              <TableHead className="text-foreground font-semibold">Resumen</TableHead>
              <TableHead className="text-foreground font-semibold">Archivo</TableHead>
              <TableHead className="text-foreground font-semibold">Actualización</TableHead>
              <TableHead className="text-foreground font-semibold">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedData).map(([proyecto, items]) => (
              <>
                {/* Fila del proyecto (colapsable) */}
                <TableRow
                  key={proyecto}
                  className="border-border/50 bg-primary/5 hover:bg-primary/10 cursor-pointer"
                  onClick={() => toggleRow(proyecto)}
                >
                  <TableCell>
                    {expandedRows.has(proyecto) ? (
                      <ChevronDown className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell colSpan={5}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{proyecto}</span>
                      <Badge variant="outline" className="text-xs">
                        {items.length} documentos
                      </Badge>
                      <div className="flex gap-1 ml-auto">
                        {items.some((i) => i.estado === "alerta") && (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        {items.some((i) => i.estado === "pendiente") && (
                          <Clock className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Filas de categorías (expandidas) */}
                {expandedRows.has(proyecto) &&
                  items.map((item) => {
                    const EstadoIcon = estadoConfig[item.estado].icon;
                    return (
                      <TableRow
                        key={item.id}
                        className="border-border/30 hover:bg-muted/30 animate-fade-in"
                      >
                        <TableCell></TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", categoriaColors[item.categoria])}
                          >
                            {item.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-foreground/90 line-clamp-2">{item.resumen}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{tipoArchivoIcons[item.tipoArchivo]}</span>
                            <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                              {item.archivo}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.fechaActualizacion).toLocaleDateString("es-PE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <EstadoIcon className={cn("w-4 h-4", estadoConfig[item.estado].color)} />
                            <span className={cn("text-xs", estadoConfig[item.estado].color)}>
                              {estadoConfig[item.estado].label}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </>
            ))}
          </TableBody>
        </Table>

        {filteredData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron documentos con los filtros seleccionados</p>
          </div>
        )}
      </div>

      {/* Nota informativa */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-foreground/80">
          <strong>Nota:</strong> Esta tabla se actualiza automáticamente cuando Power Automate detecta 
          cambios en las carpetas de SharePoint. Los resúmenes son generados por Copilot AI.
        </p>
      </div>
    </div>
  );
}
