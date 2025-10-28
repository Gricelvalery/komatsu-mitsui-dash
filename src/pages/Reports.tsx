import { useState } from "react";
import { FileText, Calendar, Download, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: "completado" | "en proceso" | "programado";
  size: string;
}

const Reports = () => {
  const [filter, setFilter] = useState("todos");
  const [reports] = useState<Report[]>([
    {
      id: "1",
      title: "Reporte Mensual de Operaciones",
      type: "Operacional",
      date: "2025-01-15",
      status: "completado",
      size: "3.2 MB",
    },
    {
      id: "2",
      title: "Análisis de Productividad Q1",
      type: "Productividad",
      date: "2025-01-20",
      status: "completado",
      size: "2.8 MB",
    },
    {
      id: "3",
      title: "Reporte de Mantenimiento",
      type: "Mantenimiento",
      date: "2025-01-25",
      status: "en proceso",
      size: "1.5 MB",
    },
    {
      id: "4",
      title: "Proyección Trimestral",
      type: "Proyección",
      date: "2025-02-01",
      status: "programado",
      size: "-",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { variant: "default" | "secondary" | "outline"; label: string }
    > = {
      completado: { variant: "default", label: "Completado" },
      "en proceso": { variant: "secondary", label: "En Proceso" },
      programado: { variant: "outline", label: "Programado" },
    };
    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reportes</h1>
          <p className="text-muted-foreground">
            Genera y consulta reportes del sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Reportes Totales</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <FileText className="h-10 w-10 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-secondary text-secondary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Este Mes</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Calendar className="h-10 w-10 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-accent text-accent-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Completados</p>
                <p className="text-3xl font-bold">22</p>
              </div>
              <TrendingUp className="h-10 w-10 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Programados</p>
                <p className="text-3xl font-bold text-foreground">2</p>
              </div>
              <Calendar className="h-10 w-10 text-primary" />
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="productividad">Productividad</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
              <FileText className="mr-2 h-4 w-4" />
              Generar Nuevo Reporte
            </Button>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="p-4 bg-muted/30 border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {report.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.date}
                        </span>
                        <span>•</span>
                        <span>{report.type}</span>
                        {report.size !== "-" && (
                          <>
                            <span>•</span>
                            <span>{report.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(report.status)}
                    {report.status === "completado" && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
