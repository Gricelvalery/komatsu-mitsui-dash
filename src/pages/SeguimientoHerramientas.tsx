import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Filter, Wrench, Package, Truck, CalendarDays, FileSpreadsheet, RotateCcw,
} from "lucide-react";

interface Herramienta {
  proyecto: string;
  item: number;
  placaAF: string;
  descripcion: string;
  cantidad: number;
  marca: string;
  nSerie: string;
  tipoHerramienta: string;
  fechaEnvio: string;
  mes: string;
  grTraslado: string;
  responsableEnvio: string;
}

const herramientasData: Herramienta[] = [
  { proyecto: "Bambas", item: 1, placaAF: "AF-001", descripcion: "Torquímetro Digital 3/4\"", cantidad: 2, marca: "Snap-On", nSerie: "SN-20251001", tipoHerramienta: "Torquímetro", fechaEnvio: "15-Ene-2025", mes: "Enero", grTraslado: "GR-2025-001", responsableEnvio: "Carlos Méndez" },
  { proyecto: "Bambas", item: 2, placaAF: "AF-002", descripcion: "Soldadora MIG 250A", cantidad: 1, marca: "Lincoln Electric", nSerie: "LE-50234", tipoHerramienta: "Soldadora", fechaEnvio: "15-Ene-2025", mes: "Enero", grTraslado: "GR-2025-001", responsableEnvio: "Carlos Méndez" },
  { proyecto: "Antapaccay", item: 3, placaAF: "AF-003", descripcion: "Amoladora Angular 9\"", cantidad: 3, marca: "DeWalt", nSerie: "DW-88712", tipoHerramienta: "Amoladora", fechaEnvio: "20-Ene-2025", mes: "Enero", grTraslado: "GR-2025-002", responsableEnvio: "Miguel Torres" },
  { proyecto: "Antapaccay", item: 4, placaAF: "AF-004", descripcion: "Equipo NDT Ultrasonido", cantidad: 1, marca: "Olympus", nSerie: "OL-NDT-445", tipoHerramienta: "NDT", fechaEnvio: "22-Ene-2025", mes: "Enero", grTraslado: "GR-2025-003", responsableEnvio: "Luis Romero" },
  { proyecto: "Quellaveco", item: 5, placaAF: "AF-005", descripcion: "Taladro Magnético", cantidad: 2, marca: "Milwaukee", nSerie: "MW-34521", tipoHerramienta: "Taladro", fechaEnvio: "01-Feb-2025", mes: "Febrero", grTraslado: "GR-2025-004", responsableEnvio: "Pedro Sánchez" },
  { proyecto: "Bambas", item: 6, placaAF: "AF-006", descripcion: "Compresor de Aire 50L", cantidad: 1, marca: "Atlas Copco", nSerie: "AC-77234", tipoHerramienta: "Compresor", fechaEnvio: "01-Feb-2025", mes: "Febrero", grTraslado: "GR-2025-004", responsableEnvio: "Pedro Sánchez" },
  { proyecto: "Quellaveco", item: 7, placaAF: "AF-007", descripcion: "Juego de Llaves Combinadas", cantidad: 5, marca: "Stanley", nSerie: "ST-COMB-01", tipoHerramienta: "Llaves", fechaEnvio: "05-Feb-2025", mes: "Febrero", grTraslado: "GR-2025-005", responsableEnvio: "Jorge Ramos" },
  { proyecto: "Antapaccay", item: 8, placaAF: "AF-008", descripcion: "Gata Hidráulica 20T", cantidad: 2, marca: "Enerpac", nSerie: "EN-HJ-209", tipoHerramienta: "Gata Hidráulica", fechaEnvio: "10-Feb-2025", mes: "Febrero", grTraslado: "GR-2025-006", responsableEnvio: "Carlos Méndez" },
  { proyecto: "Bambas", item: 9, placaAF: "AF-009", descripcion: "Multímetro Industrial", cantidad: 3, marca: "Fluke", nSerie: "FL-87V-003", tipoHerramienta: "Multímetro", fechaEnvio: "12-Feb-2025", mes: "Febrero", grTraslado: "GR-2025-007", responsableEnvio: "Miguel Torres" },
  { proyecto: "Quellaveco", item: 10, placaAF: "AF-010", descripcion: "Esmeril de Banco 8\"", cantidad: 1, marca: "Bosch", nSerie: "BS-EB-112", tipoHerramienta: "Esmeril", fechaEnvio: "15-Feb-2025", mes: "Febrero", grTraslado: "GR-2025-008", responsableEnvio: "Luis Romero" },
];

const proyectos = ["Todos", "Bambas", "Antapaccay", "Quellaveco"];
const tiposHerramienta = ["Todos", "Torquímetro", "Soldadora", "Amoladora", "NDT", "Taladro", "Compresor", "Llaves", "Gata Hidráulica", "Multímetro", "Esmeril"];

const SeguimientoHerramientas = () => {
  const [filtroProyecto, setFiltroProyecto] = useState("Todos");
  const [filtroHerramienta, setFiltroHerramienta] = useState("Todos");
  const [filtroPlaca, setFiltroPlaca] = useState("");
  const [filtroFechaEnvio, setFiltroFechaEnvio] = useState("");
  const [filtroFechaRecepcion, setFiltroFechaRecepcion] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const datosFiltrados = herramientasData.filter((h) => {
    if (filtroProyecto !== "Todos" && h.proyecto !== filtroProyecto) return false;
    if (filtroHerramienta !== "Todos" && h.tipoHerramienta !== filtroHerramienta) return false;
    if (filtroPlaca && !h.placaAF.toLowerCase().includes(filtroPlaca.toLowerCase())) return false;
    if (busqueda && !Object.values(h).some((v) => String(v).toLowerCase().includes(busqueda.toLowerCase()))) return false;
    return true;
  });

  const resetFiltros = () => {
    setFiltroProyecto("Todos");
    setFiltroHerramienta("Todos");
    setFiltroPlaca("");
    setFiltroFechaEnvio("");
    setFiltroFechaRecepcion("");
    setBusqueda("");
  };

  const totalHerramientas = datosFiltrados.reduce((a, h) => a + h.cantidad, 0);
  const proyectosUnicos = new Set(datosFiltrados.map((h) => h.proyecto)).size;
  const tiposUnicos = new Set(datosFiltrados.map((h) => h.tipoHerramienta)).size;
  const guiasUnicas = new Set(datosFiltrados.map((h) => h.grTraslado)).size;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Herramientas", value: totalHerramientas, icon: Wrench, color: "bg-[hsl(237,85%,34%)]" },
          { label: "Proyectos", value: proyectosUnicos, icon: Package, color: "bg-[hsl(237,85%,28%)]" },
          { label: "Tipos", value: tiposUnicos, icon: Filter, color: "bg-[hsl(142,71%,35%)]" },
          { label: "Guías de Traslado", value: guiasUnicas, icon: Truck, color: "bg-[hsl(25,95%,53%)]" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-[hsl(237,85%,34%)]" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* Búsqueda general */}
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Proyecto */}
            <Select value={filtroProyecto} onValueChange={setFiltroProyecto}>
              <SelectTrigger>
                <SelectValue placeholder="Proyecto" />
              </SelectTrigger>
              <SelectContent>
                {proyectos.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tipo Herramienta */}
            <Select value={filtroHerramienta} onValueChange={setFiltroHerramienta}>
              <SelectTrigger>
                <SelectValue placeholder="Herramienta" />
              </SelectTrigger>
              <SelectContent>
                {tiposHerramienta.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Placa */}
            <Input
              placeholder="Placa AF..."
              value={filtroPlaca}
              onChange={(e) => setFiltroPlaca(e.target.value)}
            />

            {/* Fecha Envío */}
            <Input
              type="date"
              value={filtroFechaEnvio}
              onChange={(e) => setFiltroFechaEnvio(e.target.value)}
              placeholder="Fecha envío"
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Input
              type="date"
              value={filtroFechaRecepcion}
              onChange={(e) => setFiltroFechaRecepcion(e.target.value)}
              placeholder="Fecha recepción"
              className="max-w-[200px]"
            />
            <Button variant="outline" size="sm" onClick={resetFiltros} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Limpiar
            </Button>
            <Button size="sm" className="gap-2 bg-[hsl(237,85%,34%)] hover:bg-[hsl(237,85%,28%)]">
              <FileSpreadsheet className="w-4 h-4" />
              Exportar
            </Button>
            <Badge variant="secondary" className="ml-auto">
              {datosFiltrados.length} resultados
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-[hsl(237,85%,34%)] text-white rounded-t-lg">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Registro de Herramientas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(237,85%,20%)] hover:bg-[hsl(237,85%,20%)]">
                  {[
                    "PROYECTO", "ITEM", "PLACA DE A.F.", "DESCRIPCIÓN", "CANTIDAD",
                    "MARCA", "N° SERIE", "TIPO DE HERRAMIENTA", "FECHA DE ENVÍO",
                    "MES", "GR DE TRASLADO", "RESPONSABLE DE ENVÍO",
                  ].map((header) => (
                    <TableHead key={header} className="text-white font-semibold text-xs whitespace-nowrap">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {datosFiltrados.map((h, i) => (
                  <TableRow
                    key={h.item}
                    className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}
                  >
                    <TableCell>
                      <Badge
                        className={
                          h.proyecto === "Bambas"
                            ? "bg-[hsl(237,85%,34%)] text-white hover:bg-[hsl(237,85%,28%)]"
                            : h.proyecto === "Antapaccay"
                            ? "bg-[hsl(142,71%,35%)] text-white hover:bg-[hsl(142,71%,30%)]"
                            : "bg-[hsl(25,95%,53%)] text-white hover:bg-[hsl(25,95%,45%)]"
                        }
                      >
                        {h.proyecto}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-center">{h.item}</TableCell>
                    <TableCell className="font-mono text-xs">{h.placaAF}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">{h.descripcion}</TableCell>
                    <TableCell className="text-center font-semibold">{h.cantidad}</TableCell>
                    <TableCell className="text-sm">{h.marca}</TableCell>
                    <TableCell className="font-mono text-xs">{h.nSerie}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{h.tipoHerramienta}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{h.fechaEnvio}</TableCell>
                    <TableCell className="text-sm">{h.mes}</TableCell>
                    <TableCell className="font-mono text-xs">{h.grTraslado}</TableCell>
                    <TableCell className="text-sm">{h.responsableEnvio}</TableCell>
                  </TableRow>
                ))}
                {datosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                      No se encontraron herramientas con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeguimientoHerramientas;
