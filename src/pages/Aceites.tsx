import { useState } from "react";
import { Upload, Search, Edit, Trash2, Plus, X, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface AceiteRecord {
  id: string;
  codigo: string;
  equipo: string;
  fechaMuestreo: string;
  compartimiento: string;
  horometro: string;
  horasAceite: string;
  cm: string;
  grado: string;
}

const Aceites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AceiteRecord | null>(null);
  const [records, setRecords] = useState<AceiteRecord[]>([
    {
      id: "1",
      codigo: "T306608",
      equipo: "CA3179",
      fechaMuestreo: "27/10/2025",
      compartimiento: "MOTOR DE TRACCION LH",
      horometro: "30175",
      horasAceite: "1514",
      cm: "DDI",
      grado: "M-SHC GEAR 680",
    },
    {
      id: "2",
      codigo: "T306602",
      equipo: "CA3164",
      fechaMuestreo: "27/10/2025",
      compartimiento: "MOTOR",
      horometro: "32479",
      horasAceite: "54",
      cm: "M",
      grado: "SHELL RIMULA R4 MV SAE 15W40",
    },
    {
      id: "3",
      codigo: "T305987",
      equipo: "CA3193",
      fechaMuestreo: "27/10/2025",
      compartimiento: "MOTOR DE TRACCION LH",
      horometro: "29259",
      horasAceite: "1736",
      cm: "M",
      grado: "M-SHC GEAR 680",
    },
  ]);

  // Filters
  const [filterMuestra, setFilterMuestra] = useState("");
  const [filterProyecto, setFilterProyecto] = useState("");
  const [filterModelo, setFilterModelo] = useState("");
  const [filterEquipo, setFilterEquipo] = useState("");
  const [filterCompartimiento, setFilterCompartimiento] = useState("");
  const [filterFechaInicio, setFilterFechaInicio] = useState("");
  const [filterFechaFin, setFilterFechaFin] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel") {
        toast({
          title: "✓ Archivo cargado exitosamente",
          description: `${file.name} se ha procesado correctamente.`,
          variant: "default",
        });
      } else {
        toast({
          title: "✗ Error al cargar archivo",
          description: "Por favor selecciona un archivo Excel válido (.xlsx o .xls)",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddRecord = () => {
    setIsEditing(false);
    setCurrentRecord({
      id: "",
      codigo: "",
      equipo: "",
      fechaMuestreo: "",
      compartimiento: "",
      horometro: "",
      horasAceite: "",
      cm: "",
      grado: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: AceiteRecord) => {
    setIsEditing(true);
    setCurrentRecord(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRecord = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      setRecords(records.filter((r) => r.id !== recordToDelete));
      toast({
        title: "✓ Registro eliminado",
        description: "El registro se ha eliminado correctamente.",
      });
      setRecordToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSaveRecord = () => {
    if (currentRecord) {
      if (isEditing) {
        setRecords(records.map((r) => (r.id === currentRecord.id ? currentRecord : r)));
        toast({
          title: "✓ Registro actualizado",
          description: "Los cambios se han guardado correctamente.",
        });
      } else {
        const newRecord = { ...currentRecord, id: Date.now().toString() };
        setRecords([...records, newRecord]);
        toast({
          title: "✓ Registro agregado",
          description: "El nuevo registro se ha guardado correctamente.",
        });
      }
    }
    setIsDialogOpen(false);
    setCurrentRecord(null);
  };

  const handleResetFilters = () => {
    setFilterMuestra("");
    setFilterProyecto("");
    setFilterModelo("");
    setFilterEquipo("");
    setFilterCompartimiento("");
    setFilterFechaInicio("");
    setFilterFechaFin("");
    toast({
      title: "Filtros reiniciados",
      description: "Se han limpiado todos los filtros.",
    });
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.equipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuestra = !filterMuestra || record.codigo.includes(filterMuestra);
    const matchesEquipo = !filterEquipo || record.equipo.includes(filterEquipo);
    const matchesCompartimiento = !filterCompartimiento || 
                                  record.compartimiento.toLowerCase().includes(filterCompartimiento.toLowerCase());
    
    return matchesSearch && matchesMuestra && matchesEquipo && matchesCompartimiento;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6 animate-fade-in">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Gestión de Aceites
            </h1>
            <p className="text-muted-foreground">
              Control y análisis de aceites de equipos mineros
            </p>
          </div>
          <div className="flex gap-3">
            <label htmlFor="file-upload">
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Excel
                </span>
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <Button 
              onClick={handleAddRecord}
              variant="secondary"
              className="bg-secondary hover:bg-secondary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Registro
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border shadow-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">Filtros de Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="muestra" className="text-sm font-medium mb-2 block">
                MUESTRA
              </Label>
              <Input
                id="muestra"
                placeholder="Código de muestra..."
                value={filterMuestra}
                onChange={(e) => setFilterMuestra(e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <Label htmlFor="proyecto" className="text-sm font-medium mb-2 block">
                PROYECTO
              </Label>
              <Select value={filterProyecto} onValueChange={setFilterProyecto}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="antapaccay">Antapaccay</SelectItem>
                  <SelectItem value="antamina">Antamina</SelectItem>
                  <SelectItem value="quellaveco">Quellaveco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="modelo" className="text-sm font-medium mb-2 block">
                MODELO
              </Label>
              <Select value={filterModelo} onValueChange={setFilterModelo}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hd785">HD785</SelectItem>
                  <SelectItem value="hd1500">HD1500</SelectItem>
                  <SelectItem value="pc4000">PC4000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="equipo" className="text-sm font-medium mb-2 block">
                EQUIPO
              </Label>
              <Input
                id="equipo"
                placeholder="Código de equipo..."
                value={filterEquipo}
                onChange={(e) => setFilterEquipo(e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <Label htmlFor="compartimiento" className="text-sm font-medium mb-2 block">
                COMPARTIMIENTO
              </Label>
              <Select value={filterCompartimiento} onValueChange={setFilterCompartimiento}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="traccion">Motor de Tracción</SelectItem>
                  <SelectItem value="hidraulico">Sistema Hidráulico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fecha-inicio" className="text-sm font-medium mb-2 block">
                FECHA DE MUESTREO (Inicio)
              </Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={filterFechaInicio}
                onChange={(e) => setFilterFechaInicio(e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <Label htmlFor="fecha-fin" className="text-sm font-medium mb-2 block">
                FECHA DE MUESTREO (Fin)
              </Label>
              <Input
                id="fecha-fin"
                type="date"
                value={filterFechaFin}
                onChange={(e) => setFilterFechaFin(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleResetFilters}
                variant="outline"
                className="w-full"
              >
                Reiniciar Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Table Card */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código o equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredRecords.length} registro(s) encontrado(s)
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10 hover:bg-primary/10">
                    <TableHead className="font-bold text-foreground">CÓDIGO</TableHead>
                    <TableHead className="font-bold text-foreground">EQUIPO</TableHead>
                    <TableHead className="font-bold text-foreground">FECHA DE MUESTREO</TableHead>
                    <TableHead className="font-bold text-foreground">COMPARTIMIENTO</TableHead>
                    <TableHead className="font-bold text-foreground">HORÓMETRO</TableHead>
                    <TableHead className="font-bold text-foreground">HORAS DE ACEITE</TableHead>
                    <TableHead className="font-bold text-foreground">CM</TableHead>
                    <TableHead className="font-bold text-foreground">GRADO</TableHead>
                    <TableHead className="font-bold text-foreground text-center">ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow 
                      key={record.id} 
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium text-primary">{record.codigo}</TableCell>
                      <TableCell className="font-medium">{record.equipo}</TableCell>
                      <TableCell>{record.fechaMuestreo}</TableCell>
                      <TableCell className="text-sm">{record.compartimiento}</TableCell>
                      <TableCell>{record.horometro}</TableCell>
                      <TableCell>{record.horasAceite}</TableCell>
                      <TableCell className="font-semibold text-secondary">{record.cm}</TableCell>
                      <TableCell className="text-xs">{record.grado}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditRecord(record)}
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteRecord(record.id)}
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              {isEditing ? "Editar Registro de Aceite" : "Nuevo Registro de Aceite"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifica los datos del registro seleccionado" 
                : "Completa el formulario para agregar un nuevo registro"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="edit-codigo" className="text-sm font-semibold mb-2 block">
                Código de Muestra *
              </Label>
              <Input
                id="edit-codigo"
                value={currentRecord?.codigo || ""}
                onChange={(e) =>
                  setCurrentRecord({ ...currentRecord!, codigo: e.target.value })
                }
                placeholder="Ej: T306608"
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="edit-equipo" className="text-sm font-semibold mb-2 block">
                Equipo *
              </Label>
              <Input
                id="edit-equipo"
                value={currentRecord?.equipo || ""}
                onChange={(e) =>
                  setCurrentRecord({ ...currentRecord!, equipo: e.target.value })
                }
                placeholder="Ej: CA3179"
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="edit-fecha" className="text-sm font-semibold mb-2 block">
                Fecha de Muestreo *
              </Label>
              <Input
                id="edit-fecha"
                type="date"
                value={currentRecord?.fechaMuestreo || ""}
                onChange={(e) =>
                  setCurrentRecord({ ...currentRecord!, fechaMuestreo: e.target.value })
                }
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="edit-compartimiento" className="text-sm font-semibold mb-2 block">
                Compartimiento *
              </Label>
              <Select
                value={currentRecord?.compartimiento || ""}
                onValueChange={(value) =>
                  setCurrentRecord({ ...currentRecord!, compartimiento: value })
                }
              >
                <SelectTrigger className="bg-muted">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOTOR">MOTOR</SelectItem>
                  <SelectItem value="MOTOR DE TRACCION LH">MOTOR DE TRACCION LH</SelectItem>
                  <SelectItem value="MOTOR DE TRACCION RH">MOTOR DE TRACCION RH</SelectItem>
                  <SelectItem value="SISTEMA HIDRAULICO">SISTEMA HIDRAULICO</SelectItem>
                  <SelectItem value="TRANSMISION">TRANSMISION</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-horometro" className="text-sm font-semibold mb-2 block">
                Horómetro
              </Label>
              <Input
                id="edit-horometro"
                value={currentRecord?.horometro || ""}
                onChange={(e) =>
                  setCurrentRecord({ ...currentRecord!, horometro: e.target.value })
                }
                placeholder="30175"
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="edit-horas" className="text-sm font-semibold mb-2 block">
                Horas de Aceite
              </Label>
              <Input
                id="edit-horas"
                value={currentRecord?.horasAceite || ""}
                onChange={(e) =>
                  setCurrentRecord({ ...currentRecord!, horasAceite: e.target.value })
                }
                placeholder="1514"
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="edit-cm" className="text-sm font-semibold mb-2 block">
                CM
              </Label>
              <Select
                value={currentRecord?.cm || ""}
                onValueChange={(value) =>
                  setCurrentRecord({ ...currentRecord!, cm: value })
                }
              >
                <SelectTrigger className="bg-muted">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DDI">DDI</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-grado" className="text-sm font-semibold mb-2 block">
                Grado
              </Label>
              <Input
                id="edit-grado"
                value={currentRecord?.grado || ""}
                onChange={(e) =>
                  setCurrentRecord({ ...currentRecord!, grado: e.target.value })
                }
                placeholder="M-SHC GEAR 680"
                className="bg-muted"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSaveRecord}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Check className="h-4 w-4" />
              {isEditing ? "Guardar Cambios" : "Agregar Registro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl">
                ¿Confirmar eliminación?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Esta acción no se puede deshacer. El registro será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Aceites;
