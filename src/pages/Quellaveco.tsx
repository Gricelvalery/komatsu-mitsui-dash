import { useState } from "react";
import { Upload, Calendar, BarChart3, Maximize2, AlertCircle, Layout, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ProcessType = "galeria" | "dashboard";

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
  const [viewMode, setViewMode] = useState<"sidebar" | "tabs" | "grid" | "split">("tabs");
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
    { id: "galeria" as ProcessType, label: "GALERÍA", icon: ImageIcon },
    { id: "dashboard" as ProcessType, label: "DASHBOARD", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* View Mode Selector */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">KOUA QUELLAVECO</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "tabs" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("tabs")}
            >
              <Layout className="w-4 h-4 mr-2" />
              Vista Tabs
            </Button>
            <Button
              variant={viewMode === "split" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("split")}
            >
              <Layout className="w-4 h-4 mr-2" />
              Vista Split
            </Button>
          </div>
        </div>
      </div>


      {/* VISTA TABS */}
      {viewMode === "tabs" && (
        <div className="p-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-2xl mx-auto mb-6">
              <TabsTrigger value="galeria" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Galería
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="galeria" className="space-y-6">
              {/* Upload Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Subir Archivo
                </h3>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-all",
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <Upload className="w-10 h-10 mx-auto mb-2 text-primary" />
                <h4 className="text-sm font-semibold mb-2">Arrastre el archivo aquí</h4>
                <p className="text-muted-foreground text-xs mb-3">o</p>
                  <Button onClick={() => document.getElementById("file-input-tabs")?.click()}>
                    Seleccione
                  </Button>
                  <input
                    id="file-input-tabs"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-xs">Archivos seleccionados:</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <span className="text-xs">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">{(file.size / 1024).toFixed(2)} KB</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Dates Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Fechas Actualizadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(equipmentData).map(([equipment, items]) => (
                    <Card key={equipment} className="overflow-hidden">
                      <div className="bg-primary p-3">
                        <h4 className="font-bold text-primary-foreground text-sm">{equipment}</h4>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                              <span className="text-xs font-medium">{item.name}</span>
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dashboard">
              <div className="space-y-4">
                {/* Update Button */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-destructive/10 p-2 rounded-full">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Actualizar Reporte</h3>
                        <p className="text-muted-foreground text-xs">
                          Usar en caso no funcione el botón del Power BI
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleUpdateReport} className="bg-[#f59f00] hover:bg-[#f59f00]/90 text-white">
                      Actualizar
                    </Button>
                  </div>
                </Card>

                {/* Dashboard */}
                <Card className="border-2 h-[calc(100vh-18rem)]">
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
                      <Button className="bg-[#f59f00] hover:bg-[#f59f00]/90 text-white">Iniciar sesión</Button>
                    </div>
                  </div>
                </div>
              </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}


      {/* VISTA SPLIT */}
      {viewMode === "split" && (
        <div className="flex h-[calc(100vh-5rem)]">
          {/* Left Side - Galería */}
          <div className="w-1/2 border-r border-border overflow-auto p-6 space-y-6">
            <h2 className="text-xl font-bold mb-4">GALERÍA</h2>
            
            {/* Upload File */}
            <Card className="p-6">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Subir Archivo
              </h3>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-all",
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <Upload className="w-10 h-10 mx-auto mb-2 text-primary" />
                <h4 className="text-sm font-semibold mb-2">Arrastre el archivo aquí</h4>
                <p className="text-muted-foreground text-xs mb-3">o</p>
                <Button size="sm" onClick={() => document.getElementById("file-input-split")?.click()}>
                  Seleccione
                </Button>
                <input
                  id="file-input-split"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-xs">Archivos seleccionados:</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <span className="text-xs">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">{(file.size / 1024).toFixed(2)} KB</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Updated Dates */}
            <div>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fechas Actualizadas
              </h3>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {Object.entries(equipmentData).map(([equipment, items]) => (
                  <Card key={equipment} className="overflow-hidden">
                    <div className="bg-primary p-2">
                      <h4 className="font-bold text-primary-foreground text-xs">{equipment}</h4>
                    </div>
                    <div className="p-3">
                      <div className="space-y-1">
                        {items.slice(0, 5).map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-1 text-xs">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground">{item.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Dashboard */}
          <div className="w-1/2 p-6 space-y-4">
            <h2 className="text-xl font-bold">DASHBOARD</h2>
            
            {/* Update Button */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-destructive/10 p-2 rounded-full">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Actualizar Reporte</h3>
                    <p className="text-muted-foreground text-xs">
                      Usar en caso no funcione el botón del Power BI
                    </p>
                  </div>
                </div>
                <Button onClick={handleUpdateReport} className="bg-[#f59f00] hover:bg-[#f59f00]/90 text-white">
                  Actualizar
                </Button>
              </div>
            </Card>

            {/* Dashboard */}
            <Card className="border-2 h-[calc(100%-8rem)]">
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
          </div>
        </div>
      )}
    </div>
  );
}
