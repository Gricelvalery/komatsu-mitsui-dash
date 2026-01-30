import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  HardHat,
  UserCheck,
  Shield,
  Wrench,
} from "lucide-react";

// Datos de colaboradores
const colaboradores = [
  { item: 11, nombre: "Luis Anthony Romero Callo", cargo: "ESPECIALISTA NDT", ingreso: "1-Feb", ingresoMina: "30-Ene" },
  { item: 15, nombre: "Renato Rosales Saravia", cargo: "SUPERVISOR DE TALLER", ingreso: "1-Feb", ingresoMina: null },
  { item: 1, nombre: "Rojas Bardon, Miguel Angel", cargo: "SUPERVISOR SSOMA", ingreso: "5-Dic", ingresoMina: "17-Ene" },
  { item: 64, nombre: "Javier Cruz Quispe", cargo: "SUPERVISOR SSOMA", ingreso: "19-Ene", ingresoMina: "30-Ene" },
  { item: 2, nombre: "Soto Cayllahua, Hernan Dennis", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: null },
  { item: 6, nombre: "Chillca Mamani, Jorge", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 3, nombre: "Gallegos Quispe, Nimer Leoned", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: null },
  { item: 4, nombre: "Mamani Valero, Edgar Abad", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 5, nombre: "Puelles Mayhuire, Eber", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 9, nombre: "Ccahuana Ollachica, Yoel", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: null },
  { item: 7, nombre: "Lope Yana, Jhulinio Dario", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "31-Ene" },
  { item: 8, nombre: "Solis Gutierrez, Jose Alberto", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 16, nombre: "Jose Antonio Pinto Alvarez", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: null },
  { item: 18, nombre: "Yohn Albert Condori Ccoila", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: null },
  { item: 21, nombre: "Lazaro Antacabana Abisai Smith", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: null },
  { item: 22, nombre: "Juan Carlos Gomez Rivera", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: null },
  { item: 23, nombre: "Ramiro Hancco Ampa", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: null },
  { item: 24, nombre: "Franklin Cruz Peralta", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: null },
  { item: 10, nombre: "Pauccara Conza, Jose", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 26, nombre: "Choque Huamani Oscar Gonzalo", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: null },
  { item: 25, nombre: "Eliu Jersson Huamani Cabana", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: "30-Ene" },
  { item: 67, nombre: "Andres Grados Corasi", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: null },
];

// Datos para gráfico de barras por cargo
const datosPorCargo = [
  { cargo: "Técnico Soldador", cantidad: 18, color: "hsl(var(--komatsu-blue))" },
  { cargo: "Supervisor SSOMA", cantidad: 2, color: "hsl(var(--komatsu-yellow))" },
  { cargo: "Supervisor Taller", cantidad: 1, color: "hsl(var(--industrial-gray))" },
  { cargo: "Especialista NDT", cantidad: 1, color: "hsl(var(--accent))" },
];

// Datos para gráfico de pastel - Estado ingreso a mina
const datosIngresoMina = [
  { name: "Con ingreso a mina", value: 10, color: "hsl(var(--komatsu-blue))" },
  { name: "Pendiente ingreso", value: 12, color: "hsl(var(--industrial-gray))" },
];

// Datos por fecha de ingreso
const datosPorFecha = [
  { fecha: "5-Dic", cantidad: 1 },
  { fecha: "12-Ene", cantidad: 10 },
  { fecha: "19-Ene", cantidad: 10 },
  { fecha: "1-Feb", cantidad: 2 },
];

const getCargoIcon = (cargo: string) => {
  if (cargo.includes("SOLDADOR")) return <Wrench className="w-4 h-4" />;
  if (cargo.includes("SSOMA")) return <Shield className="w-4 h-4" />;
  if (cargo.includes("TALLER")) return <HardHat className="w-4 h-4" />;
  return <UserCheck className="w-4 h-4" />;
};

const getCargoColor = (cargo: string) => {
  if (cargo.includes("SOLDADOR")) return "bg-[hsl(var(--komatsu-blue))]/10 text-[hsl(var(--komatsu-blue))] border-[hsl(var(--komatsu-blue))]/30";
  if (cargo.includes("SSOMA")) return "bg-[hsl(var(--komatsu-yellow))]/10 text-[hsl(var(--komatsu-yellow))] border-[hsl(var(--komatsu-yellow))]/30";
  if (cargo.includes("TALLER")) return "bg-[hsl(var(--industrial-gray))]/10 text-[hsl(var(--industrial-gray))] border-[hsl(var(--industrial-gray))]/30";
  return "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/30";
};

const BambasGraficoMina = () => {
  const totalColaboradores = colaboradores.length;
  const conIngresoMina = colaboradores.filter(c => c.ingresoMina).length;
  const pendienteIngreso = totalColaboradores - conIngresoMina;

  return (
    <main className="p-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      {/* Header con estadísticas */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Gráfico de Mina - Bambas</h1>
        <p className="text-muted-foreground">Control de colaboradores y estado de ingreso a mina</p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-[hsl(var(--komatsu-blue))] bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-[hsl(var(--komatsu-blue))]/10">
              <Users className="w-6 h-6 text-[hsl(var(--komatsu-blue))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalColaboradores}</p>
              <p className="text-sm text-muted-foreground">Total Colaboradores</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{conIngresoMina}</p>
              <p className="text-sm text-muted-foreground">Con Ingreso a Mina</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--komatsu-yellow))] bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-[hsl(var(--komatsu-yellow))]/10">
              <Clock className="w-6 h-6 text-[hsl(var(--komatsu-yellow))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendienteIngreso}</p>
              <p className="text-sm text-muted-foreground">Pendiente Ingreso</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--industrial-gray))] bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-[hsl(var(--industrial-gray))]/10">
              <Calendar className="w-6 h-6 text-[hsl(var(--industrial-gray))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{Math.round((conIngresoMina / totalColaboradores) * 100)}%</p>
              <p className="text-sm text-muted-foreground">Tasa de Ingreso</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con 3 opciones de visualización */}
      <Tabs defaultValue="barras" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="barras" className="data-[state=active]:bg-[hsl(var(--komatsu-blue))] data-[state=active]:text-white">
            📊 Gráfico de Barras
          </TabsTrigger>
          <TabsTrigger value="pastel" className="data-[state=active]:bg-[hsl(var(--komatsu-blue))] data-[state=active]:text-white">
            🥧 Gráfico Circular
          </TabsTrigger>
          <TabsTrigger value="tabla" className="data-[state=active]:bg-[hsl(var(--komatsu-blue))] data-[state=active]:text-white">
            📋 Tabla Visual
          </TabsTrigger>
        </TabsList>

        {/* OPCIÓN 1: Gráfico de Barras */}
        <TabsContent value="barras" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Barras por cargo */}
            <Card className="border border-border/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--komatsu-blue))]/10 to-transparent border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-[hsl(var(--komatsu-blue))]" />
                  Distribución por Cargo
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosPorCargo} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="cargo" type="category" stroke="hsl(var(--muted-foreground))" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="cantidad" fill="hsl(var(--komatsu-blue))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Barras por fecha de ingreso */}
            <Card className="border border-border/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--komatsu-yellow))]/10 to-transparent border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[hsl(var(--komatsu-yellow))]" />
                  Ingresos por Fecha
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosPorFecha}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="fecha" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="cantidad" fill="hsl(var(--komatsu-yellow))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OPCIÓN 2: Gráficos Circulares */}
        <TabsContent value="pastel" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estado de ingreso a mina */}
            <Card className="border border-border/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--komatsu-blue))]/10 to-transparent border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--komatsu-blue))]" />
                  Estado de Ingreso a Mina
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosIngresoMina}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datosIngresoMina.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución por cargo - Donut */}
            <Card className="border border-border/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--komatsu-yellow))]/10 to-transparent border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-[hsl(var(--komatsu-yellow))]" />
                  Distribución por Rol
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosPorCargo}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="cantidad"
                      label={({ cargo, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {datosPorCargo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OPCIÓN 3: Tabla Visual con Cards */}
        <TabsContent value="tabla" className="space-y-4">
          <Card className="border border-border/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[hsl(var(--komatsu-blue))]/10 to-transparent border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-[hsl(var(--komatsu-blue))]" />
                Lista de Colaboradores ({totalColaboradores})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {colaboradores.map((colaborador) => (
                  <div
                    key={colaborador.item}
                    className={`
                      p-3 rounded-lg border transition-all duration-200 hover:shadow-md
                      ${colaborador.ingresoMina 
                        ? "bg-green-500/5 border-green-500/30 hover:border-green-500/50" 
                        : "bg-[hsl(var(--industrial-gray))]/5 border-[hsl(var(--industrial-gray))]/30 hover:border-[hsl(var(--industrial-gray))]/50"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        #{colaborador.item}
                      </Badge>
                      {colaborador.ingresoMina ? (
                        <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          En Mina
                        </Badge>
                      ) : (
                        <Badge className="bg-[hsl(var(--komatsu-yellow))]/20 text-[hsl(var(--komatsu-yellow))] border-[hsl(var(--komatsu-yellow))]/30 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-1" title={colaborador.nombre}>
                      {colaborador.nombre}
                    </h4>
                    
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getCargoColor(colaborador.cargo)}`}>
                      {getCargoIcon(colaborador.cargo)}
                      <span className="truncate max-w-[120px]">{colaborador.cargo}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Ingreso: {colaborador.ingreso}</span>
                    </div>
                    
                    {colaborador.ingresoMina && (
                      <div className="mt-1 flex items-center gap-2 text-xs text-green-600">
                        <HardHat className="w-3 h-3" />
                        <span>A mina: {colaborador.ingresoMina}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default BambasGraficoMina;
