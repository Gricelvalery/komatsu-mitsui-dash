import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

// Datos de ejemplo para proyectos
const projectsData = [
  {
    id: "LT001",
    name: "LT001",
    categories: {
      seguridad: [
        { name: "Inspección EPP", date: "28/08/2025" },
        { name: "Capacitación", date: "27/08/2025" },
        { name: "Auditoría SST", date: "25/08/2025" },
      ],
      disponibilidad: [
        { name: "Motor Principal", date: "28/08/2025" },
        { name: "Sistema Hidráulico", date: "26/08/2025" },
        { name: "Filtro Centrífugo", date: "15/08/2025" },
      ],
      gestion: [
        { name: "Reporte Mensual", date: "28/08/2025" },
        { name: "KPIs Operativos", date: "27/08/2025" },
      ],
      riesgos: [
        { name: "Matriz de Riesgos", date: "20/08/2025" },
        { name: "Plan Contingencia", date: "18/08/2025" },
      ],
    },
  },
  {
    id: "TD012",
    name: "TD012",
    categories: {
      seguridad: [
        { name: "Mando Final LH", date: "28/08/2025" },
        { name: "Mando Final RH", date: "28/08/2025" },
      ],
      disponibilidad: [
        { name: "Compresor", date: "11/08/2025" },
        { name: "Combustible", date: "08/08/2025" },
        { name: "Motor", date: "08/08/2025" },
      ],
      gestion: [
        { name: "Radiador", date: "08/08/2025" },
        { name: "Sistema Hidráulico", date: "08/08/2025" },
      ],
      riesgos: [
        { name: "Evaluación Riesgos", date: "05/08/2025" },
      ],
    },
  },
  {
    id: "TD003",
    name: "TD003",
    categories: {
      seguridad: [
        { name: "PTO", date: "28/08/2025" },
        { name: "Combustible", date: "27/08/2025" },
      ],
      disponibilidad: [
        { name: "Motor", date: "27/08/2025" },
        { name: "Radiador", date: "27/08/2025" },
        { name: "Bomba Inyección Agua", date: "26/08/2025" },
      ],
      gestion: [
        { name: "Cabezal Giratorio", date: "26/08/2025" },
        { name: "Mando Final LH", date: "26/08/2025" },
        { name: "Mando Final RH", date: "26/08/2025" },
      ],
      riesgos: [
        { name: "Sistema Hidráulico", date: "26/08/2025" },
      ],
    },
  },
  {
    id: "PC930-01",
    name: "PC930-01",
    categories: {
      seguridad: [
        { name: "Check de Seguridad", date: "27/08/2025" },
        { name: "Protocolo LOTO", date: "25/08/2025" },
      ],
      disponibilidad: [
        { name: "Tren de Rodaje", date: "26/08/2025" },
        { name: "Sistema Eléctrico", date: "24/08/2025" },
      ],
      gestion: [
        { name: "Informe Operativo", date: "27/08/2025" },
      ],
      riesgos: [
        { name: "Análisis IPERC", date: "22/08/2025" },
      ],
    },
  },
  {
    id: "HD785-07",
    name: "HD785-07",
    categories: {
      seguridad: [
        { name: "Inspección Frenos", date: "28/08/2025" },
      ],
      disponibilidad: [
        { name: "Transmisión", date: "27/08/2025" },
        { name: "Neumáticos", date: "25/08/2025" },
      ],
      gestion: [
        { name: "Control Combustible", date: "28/08/2025" },
        { name: "Horómetro", date: "27/08/2025" },
      ],
      riesgos: [
        { name: "Ruta Crítica", date: "20/08/2025" },
      ],
    },
  },
  {
    id: "WA600-06",
    name: "WA600-06",
    categories: {
      seguridad: [
        { name: "Alarma Retroceso", date: "26/08/2025" },
        { name: "Cinturón Seguridad", date: "24/08/2025" },
      ],
      disponibilidad: [
        { name: "Cuchara", date: "27/08/2025" },
        { name: "Articulación", date: "25/08/2025" },
      ],
      gestion: [
        { name: "Productividad", date: "28/08/2025" },
      ],
      riesgos: [
        { name: "Zona Carga", date: "21/08/2025" },
      ],
    },
  },
  {
    id: "D375A-08",
    name: "D375A-08",
    categories: {
      seguridad: [
        { name: "Sistema ROPS", date: "25/08/2025" },
      ],
      disponibilidad: [
        { name: "Hoja Topadora", date: "27/08/2025" },
        { name: "Ripper", date: "26/08/2025" },
        { name: "Cadenas", date: "24/08/2025" },
      ],
      gestion: [
        { name: "Rendimiento", date: "27/08/2025" },
      ],
      riesgos: [
        { name: "Terreno Inestable", date: "19/08/2025" },
      ],
    },
  },
  {
    id: "GD825A-03",
    name: "GD825A-03",
    categories: {
      seguridad: [
        { name: "Luces Trabajo", date: "27/08/2025" },
      ],
      disponibilidad: [
        { name: "Vertedera", date: "28/08/2025" },
        { name: "Escarificador", date: "26/08/2025" },
      ],
      gestion: [
        { name: "Km Recorridos", date: "28/08/2025" },
        { name: "Área Nivelada", date: "27/08/2025" },
      ],
      riesgos: [
        { name: "Visibilidad", date: "23/08/2025" },
      ],
    },
  },
  {
    id: "PC2000-02",
    name: "PC2000-02",
    categories: {
      seguridad: [
        { name: "Extintor", date: "28/08/2025" },
        { name: "Escalera Acceso", date: "26/08/2025" },
      ],
      disponibilidad: [
        { name: "Boom", date: "27/08/2025" },
        { name: "Stick", date: "25/08/2025" },
        { name: "Bucket", date: "24/08/2025" },
      ],
      gestion: [
        { name: "Ciclos/Hora", date: "28/08/2025" },
      ],
      riesgos: [
        { name: "Radio Giro", date: "18/08/2025" },
      ],
    },
  },
  {
    id: "HD1500-04",
    name: "HD1500-04",
    categories: {
      seguridad: [
        { name: "Sistema AHS", date: "28/08/2025" },
      ],
      disponibilidad: [
        { name: "Motor Diesel", date: "27/08/2025" },
        { name: "Alternador", date: "26/08/2025" },
      ],
      gestion: [
        { name: "Tonelaje", date: "28/08/2025" },
        { name: "Consumo", date: "27/08/2025" },
      ],
      riesgos: [
        { name: "Pendiente Rampa", date: "20/08/2025" },
      ],
    },
  },
  {
    id: "PC4000-01",
    name: "PC4000-01",
    categories: {
      seguridad: [
        { name: "Cámara 360°", date: "27/08/2025" },
      ],
      disponibilidad: [
        { name: "Cilindros", date: "28/08/2025" },
        { name: "Mangueras", date: "25/08/2025" },
      ],
      gestion: [
        { name: "Disponibilidad Física", date: "28/08/2025" },
      ],
      riesgos: [
        { name: "Banco Alto", date: "22/08/2025" },
      ],
    },
  },
  {
    id: "WA1200-02",
    name: "WA1200-02",
    categories: {
      seguridad: [
        { name: "Sensor Proximidad", date: "26/08/2025" },
      ],
      disponibilidad: [
        { name: "Convertidor", date: "27/08/2025" },
        { name: "Ejes", date: "24/08/2025" },
      ],
      gestion: [
        { name: "Carga Útil", date: "28/08/2025" },
      ],
      riesgos: [
        { name: "Punto Ciego", date: "21/08/2025" },
      ],
    },
  },
];

const categoryLabels = {
  seguridad: "SEGURIDAD",
  disponibilidad: "DISPONIBILIDAD",
  gestion: "GESTIÓN",
  riesgos: "RIESGOS",
};

interface CategorySectionProps {
  categoryKey: keyof typeof categoryLabels;
  items: { name: string; date: string }[];
}

const CategorySection = ({ categoryKey, items }: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const label = categoryLabels[categoryKey];

  if (items.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 hover:bg-muted/30 rounded px-1 transition-colors">
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-semibold text-xs text-primary uppercase tracking-wide">
          {label}:
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0 pl-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-1.5 text-sm border-l-2 border-muted/50 pl-3 hover:border-primary/50 transition-colors"
          >
            <span className="text-primary font-medium text-xs uppercase">{item.name}</span>
            <span className="text-muted-foreground text-xs">{item.date}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const GerenciaReporte = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");

  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === "all" || project.id === selectedProject;
    return matchesSearch && matchesProject;
  });

  return (
    <main className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-foreground">Reporte</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              {projectsData.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="border-l-4 border-l-primary bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-bold text-primary">
                {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-0">
              <CategorySection
                categoryKey="seguridad"
                items={project.categories.seguridad}
              />
              <CategorySection
                categoryKey="disponibilidad"
                items={project.categories.disponibilidad}
              />
              <CategorySection
                categoryKey="gestion"
                items={project.categories.gestion}
              />
              <CategorySection
                categoryKey="riesgos"
                items={project.categories.riesgos}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron proyectos</p>
        </div>
      )}
    </main>
  );
};

export default GerenciaReporte;
