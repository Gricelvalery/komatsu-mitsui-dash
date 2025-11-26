import { useState } from "react";
import { Upload, Calendar, RefreshCw, BarChart3, Maximize2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ProcessType = "upload" | "dates" | "update" | "dashboard";

interface EquipmentData {
  id: string;
  name: string;
  date: string;
}

const equipmentData: Record<string, EquipmentData[]> = {
  TD001: [
    { id: "1", name: "COMBUSTIBLE", date: "28/08/2025" },
    { id: "2", name: "MOTOR", date: "28/08/2025" },
    { id: "3", name: "SISTEMA HIDRAULICO", date: "28/08/2025" },
    { id: "4", name: "FILTRO CENTRIFUGO", date: "15/08/2025" },
    { id: "5", name: "HLSY_AF", date: "15/08/2025" },
    { id: "6", name: "HLSY_BMP1", date: "15/08/2025" },
    { id: "7", name: "HLSY_BMP2", date: "15/08/2025" },
    { id: "8", name: "HLSY_BMP3", date: "15/08/2025" },
    { id: "9", name: "HLSY_BP", date: "15/08/2025" },
  ],
  TD012: [
    { id: "1", name: "MANDO FINAL LH", date: "28/08/2025" },
    { id: "2", name: "MANDO FINAL RH", date: "28/08/2025" },
    { id: "3", name: "COMPRESOR", date: "11/08/2025" },
    { id: "4", name: "COMBUSTIBLE", date: "08/08/2025" },
    { id: "5", name: "MOTOR", date: "08/08/2025" },
    { id: "6", name: "RADIADOR", date: "08/08/2025" },
    { id: "7", name: "SISTEMA HIDRAULICO", date: "08/08/2025" },
  ],
  TD003: [
    { id: "1", name: "COMBUSTIBLE", date: "27/08/2025" },
    { id: "2", name: "MOTOR", date: "27/08/2025" },
    { id: "3", name: "RADIADOR", date: "27/08/2025" },
    { id: "4", name: "BOMBA INYECCION AGUA", date: "26/08/2025" },
    { id: "5", name: "CABEZAL GIRATORIO", date: "26/08/2025" },
    { id: "6", name: "MANDO FINAL LH", date: "26/08/2025" },
    { id: "7", name: "MANDO FINAL RH", date: "26/08/2025" },
    { id: "8", name: "SISTEMA HIDRAULICO", date: "26/08/2025" },
    { id: "9", name: "COMPRESOR", date: "08/08/2025" },
    { id: "10", name: "FILTRO CENTRIFUGO", date: "08/08/2025" },
  ],
};

export default function Quellaveco() {
  const [activeProcess, setActiveProcess] = useState<ProcessType>("dashboard");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    toast.success(`${fileArray.length} archivo(s) seleccionado(s)`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleUpdateReport = () => {
    toast.success("Reporte actualizado correctamente");
  };

  const processes = [
    { id: "upload" as ProcessType, label: "SUBIR ARCHIVO", icon: Upload },
    { id: "dates" as ProcessType, label: "FECHAS ACTUALIZADAS", icon: Calendar },
    { id: "update" as ProcessType, label: "ACTUALIZACION DE REPORTE", icon: RefreshCw },
    { id: "dashboard" as ProcessType, label: "DASHBOARD", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Left Sidebar - Processes */}
        <aside className="w-56 bg-card border-r border-border flex flex-col shadow-lg">
          <div className="p-6 border-b border-border">
            <h1 className="text-lg font-bold text-foreground">KOUA QUELLAVECO</h1>
          </div>

          <div className="p-4 flex-1">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 px-2">PROCESOS</h2>
            <div className="space-y-2">
              {processes.map((process) => (
                <Button
                  key={process.id}
                  variant={activeProcess === process.id ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start gap-3 h-auto py-3 transition-all",
                    activeProcess === process.id 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-accent"
                  )}
                  onClick={() => setActiveProcess(process.id)}
                >
                  <process.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium text-left leading-tight">
                    {process.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Dashboard View */}
            {activeProcess === "dashboard" && (
              <Card className="border-2 h-[calc(100vh-8rem)]">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-lg">REPORTE - KOUA QUELLAVECO</h2>
                  <Button variant="ghost" size="icon">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="h-[calc(100%-4rem)] flex items-center justify-center bg-muted/20">
                  <div className="text-center space-y-4">
                    <BarChart3 className="w-24 h-24 mx-auto text-primary/40" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Power BI</h3>
                      <p className="text-muted-foreground mb-4">Inicie sesión para ver este informe</p>
                      <Button className="bg-[#f59f00] hover:bg-[#f59f00]/90 text-white">
                        Iniciar sesión
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Upload File View */}
            {activeProcess === "upload" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">SUBIR ARCHIVO</h2>
                <Card className="p-8">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-12 text-center transition-all",
                      isDragging 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">
                      Arrastre el archivo aquí
                    </h3>
                    <p className="text-muted-foreground mb-4">o</p>
                    <Button
                      onClick={() => document.getElementById("file-input")?.click()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Seleccione
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Archivos seleccionados:</h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="secondary">
                              {(file.size / 1024).toFixed(2)} KB
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Updated Dates View */}
            {activeProcess === "dates" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">FECHAS ACTUALIZADAS</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(equipmentData).map(([equipment, items]) => (
                    <Card key={equipment} className="overflow-hidden">
                      <div className="bg-primary p-3">
                        <h3 className="font-bold text-primary-foreground">{equipment}</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center py-2 border-b border-border last:border-0"
                            >
                              <span className="text-sm font-medium">{item.name}</span>
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Update Report View */}
            {activeProcess === "update" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">ACTUALIZACION DE REPORTE</h2>
                
                <Card className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-destructive/10 p-3 rounded-full">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">REQUERIR ACTUALIZAR REPORTE</h3>
                      <p className="text-muted-foreground text-sm">
                        ¡¡¡ USARLO EN CASO NO FUNCIONE EL BOTON DEL POWER BI !!!!!
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpdateReport}
                    size="lg"
                    className="w-full max-w-md bg-[#f59f00] hover:bg-[#f59f00]/90 text-white font-semibold py-6"
                  >
                    Actualizar Reporte
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
