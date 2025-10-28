import { useState } from "react";
import { Upload, File, Search, Trash2, Download, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: "procesado" | "pendiente" | "error";
}

const FileManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [files] = useState<FileItem[]>([
    {
      id: "1",
      name: "Reporte_Mensual_Enero.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2025-01-15",
      status: "procesado",
    },
    {
      id: "2",
      name: "Datos_Equipos_Q1.xlsx",
      type: "Excel",
      size: "1.8 MB",
      uploadDate: "2025-01-20",
      status: "procesado",
    },
    {
      id: "3",
      name: "Imagen_Camion_HD785.jpg",
      type: "Imagen",
      size: "5.2 MB",
      uploadDate: "2025-01-22",
      status: "pendiente",
    },
  ]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      procesado: "default",
      pendiente: "secondary",
      error: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Archivos
          </h1>
          <p className="text-muted-foreground">
            Sube, gestiona y descarga tus archivos del sistema
          </p>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar archivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
              <Upload className="mr-2 h-4 w-4" />
              Subir Archivo
            </Button>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Tamaño</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-primary" />
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell>{file.type}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.uploadDate}</TableCell>
                    <TableCell>{getStatusBadge(file.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Archivos
                </p>
                <p className="text-3xl font-bold text-foreground">3</p>
              </div>
              <File className="h-10 w-10 text-primary" />
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Espacio Usado
                </p>
                <p className="text-3xl font-bold text-foreground">9.4 GB</p>
              </div>
              <Upload className="h-10 w-10 text-secondary" />
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Procesados Hoy
                </p>
                <p className="text-3xl font-bold text-foreground">2</p>
              </div>
              <Download className="h-10 w-10 text-accent" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FileManagement;
