import { useState } from "react";
import { Upload, Download, Database, FileText, Calendar, Filter, Trash2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Plm = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [proyecto, setProyecto] = useState("");
  const [modelo, setModelo] = useState("");
  const [equipo, setEquipo] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = () => {
    // Lógica de subida de archivos
    console.log("Subiendo archivos:", selectedFiles);
  };

  const handleDownload = () => {
    // Lógica de descarga de datos
    console.log("Descargando datos PLM con filtros:", { proyecto, modelo, equipo, dateRange });
  };

  // Datos de ejemplo para la tabla
  const sampleData = [
    { codigo: "T307731", equipo: "CA3164", fecha: "19/11/25", comparSistema: "SISTEMA HI...", horom: "32957", horasd: "9573", cm: "PM4", grado: "M-MOBILT..." },
    { codigo: "T307733", equipo: "CA3164", fecha: "19/11/25", comparRueda: "RUEDA DEL...", horom: "32957", horasd: "532", cm: "PM4", grado: "M-MOBILT..." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Gestión PLM
              </h1>
              <p className="text-muted-foreground">
                Portal de Operaciones & Servicios Minería
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <Tabs defaultValue="download" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Descargar Data
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Subir Archivo
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Info Data
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reporte PLM
            </TabsTrigger>
          </TabsList>

          {/* Descargar Data */}
          <TabsContent value="download" className="animate-fade-in">
            <Card className="max-w-5xl mx-auto shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Descargar Datos PLM</CardTitle>
                <CardDescription>
                  Seleccione los filtros para descargar los datos del sistema PLM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proyecto" className="text-sm font-medium">Proyecto</Label>
                    <Select value={proyecto} onValueChange={setProyecto}>
                      <SelectTrigger id="proyecto">
                        <SelectValue placeholder="Seleccione un Proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antapaccay">Antapaccay</SelectItem>
                        <SelectItem value="toquepala">Toquepala</SelectItem>
                        <SelectItem value="cuajone">Cuajone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelo" className="text-sm font-medium">Modelos</Label>
                    <Select value={modelo} onValueChange={setModelo}>
                      <SelectTrigger id="modelo">
                        <SelectValue placeholder="Seleccione un modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="930e-3">930E-3</SelectItem>
                        <SelectItem value="930e-4">930E-4</SelectItem>
                        <SelectItem value="930e-4se">930E-4SE</SelectItem>
                        <SelectItem value="980e-4">980E-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipo" className="text-sm font-medium">Equipos</Label>
                    <Select value={equipo} onValueChange={setEquipo}>
                      <SelectTrigger id="equipo">
                        <SelectValue placeholder="Seleccione un equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="k16">K16</SelectItem>
                        <SelectItem value="k21">K21</SelectItem>
                        <SelectItem value="k33">K33</SelectItem>
                        <SelectItem value="k36">K36</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rango de fechas */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                  {dateRange.start && dateRange.end && (
                    <p className="text-sm text-muted-foreground">
                      Rango seleccionado: {dateRange.start} - {dateRange.end}
                    </p>
                  )}
                </div>

                {/* Botón de descarga */}
                <Button 
                  onClick={handleDownload}
                  className="w-full md:w-auto bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Descargar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subir Archivo */}
          <TabsContent value="upload" className="animate-fade-in">
            <Card className="max-w-5xl mx-auto shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Subir Archivos PLM</CardTitle>
                <CardDescription>
                  Cargue archivos PLM para actualizar el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filtros superiores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload-proyecto" className="text-sm font-medium">Proyecto</Label>
                    <Select>
                      <SelectTrigger id="upload-proyecto">
                        <SelectValue placeholder="Seleccione un Proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antapaccay">Antapaccay</SelectItem>
                        <SelectItem value="toquepala">Toquepala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upload-modelo" className="text-sm font-medium">Modelos</Label>
                    <Select>
                      <SelectTrigger id="upload-modelo">
                        <SelectValue placeholder="Seleccione un modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="930e-3">930E-3</SelectItem>
                        <SelectItem value="930e-4">930E-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upload-equipo" className="text-sm font-medium">Equipos</Label>
                    <Select>
                      <SelectTrigger id="upload-equipo">
                        <SelectValue placeholder="Seleccione un equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="k16">K16</SelectItem>
                        <SelectItem value="k21">K21</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Área de carga de archivos */}
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-primary font-semibold hover:underline">
                          Seleccione los archivos PLM
                        </span>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        o arrastre y suelte aquí
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de archivos seleccionados */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Número de archivos seleccionados: {selectedFiles.length}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFiles([])}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar archivos
                      </Button>
                    </div>
                    <div className="border border-border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            <FileCheck className="h-5 w-5 text-primary" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Badge variant="secondary">{(file.size / 1024).toFixed(2)} KB</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón de subida */}
                <Button 
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0}
                  className="w-full md:w-auto bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Subir Archivos
                </Button>

                {/* Botón de actualizar reporte */}
                <div className="pt-6 border-t border-border">
                  <Button variant="outline" size="lg" className="w-full md:w-auto">
                    <FileText className="mr-2 h-5 w-5" />
                    Actualizar Reporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Info Data */}
          <TabsContent value="info" className="animate-fade-in">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Análisis de Aceites</CardTitle>
                <CardDescription>
                  Visualice y gestione la información de análisis de aceites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filtros de búsqueda */}
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Filtros de búsqueda</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Muestra</Label>
                    <Input placeholder="Buscar muestra" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Proyecto</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="antapaccay">Antapaccay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Modelo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Equipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Compartimento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">Fecha de Muestreo</Label>
                    <div className="flex items-center gap-2">
                      <Input type="date" />
                      <span>-</span>
                      <Input type="date" />
                    </div>
                  </div>
                  <Button className="mt-6">
                    Reiniciar Filtros
                  </Button>
                </div>

                {/* Tabla de datos */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Compartimento</TableHead>
                        <TableHead>Horómetro</TableHead>
                        <TableHead>Horas de Aceite</TableHead>
                        <TableHead>CM</TableHead>
                        <TableHead>Grado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.codigo}</TableCell>
                          <TableCell>{row.equipo}</TableCell>
                          <TableCell>{row.fecha}</TableCell>
                          <TableCell>{row.comparSistema || row.comparRueda}</TableCell>
                          <TableCell>{row.horom}</TableCell>
                          <TableCell>{row.horasd}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{row.cm}</Badge>
                          </TableCell>
                          <TableCell>{row.grado}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileText className="h-4 w-4 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Excel
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reporte PLM */}
          <TabsContent value="reports" className="animate-fade-in">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Reportes PLM - Power BI</CardTitle>
                <CardDescription>
                  Dashboards y reportes de análisis PLM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText className="h-16 w-16 text-primary mx-auto" />
                    <div>
                      <p className="text-lg font-semibold text-foreground mb-2">
                        Dashboard de Reportes PLM
                      </p>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Aquí se mostrará el dashboard de Power BI con los reportes de PLM embebido.
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg inline-block">
                      Reemplaza con: &lt;iframe src="URL_POWER_BI_PLM" /&gt;
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
