import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  HardHat,
  UserCheck,
  Shield,
  Wrench,
  TrendingUp,
} from "lucide-react";

// Personal YA EN MINA (reclutamiento completado)
const personalEnMina = [
  { item: 11, nombre: "Luis Anthony Romero Callo", cargo: "ESPECIALISTA NDT", ingreso: "1-Feb", ingresoMina: "30-Ene" },
  { item: 1, nombre: "Rojas Bardon, Miguel Angel", cargo: "SUPERVISOR SSOMA", ingreso: "5-Dic", ingresoMina: "17-Ene" },
  { item: 64, nombre: "Javier Cruz Quispe", cargo: "SUPERVISOR SSOMA", ingreso: "19-Ene", ingresoMina: "30-Ene" },
  { item: 6, nombre: "Chillca Mamani, Jorge", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 4, nombre: "Mamani Valero, Edgar Abad", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 5, nombre: "Puelles Mayhuire, Eber", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 7, nombre: "Lope Yana, Jhulinio Dario", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "31-Ene" },
  { item: 8, nombre: "Solis Gutierrez, Jose Alberto", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 10, nombre: "Pauccara Conza, Jose", cargo: "TECNICO SOLDADOR", ingreso: "12-Ene", ingresoMina: "30-Ene" },
  { item: 25, nombre: "Eliu Jersson Huamani Cabana", cargo: "TECNICO SOLDADOR", ingreso: "19-Ene", ingresoMina: "30-Ene" },
];

// Datos para gráfico de barras por cargo
const datosPorCargo = [
  { cargo: "Técnico Soldador", cantidad: 7, meta: 18, porcentaje: 39 },
  { cargo: "Supervisor SSOMA", cantidad: 2, meta: 2, porcentaje: 100 },
  { cargo: "Especialista NDT", cantidad: 1, meta: 1, porcentaje: 100 },
];

// Datos para gráfico circular
const datosResumen = [
  { name: "En Mina", value: 10, color: "hsl(var(--komatsu-blue))" },
  { name: "Por ingresar", value: 12, color: "hsl(var(--industrial-gray))" },
];

const getCargoIcon = (cargo: string) => {
  if (cargo.includes("SOLDADOR")) return <Wrench className="w-4 h-4" />;
  if (cargo.includes("SSOMA")) return <Shield className="w-4 h-4" />;
  return <UserCheck className="w-4 h-4" />;
};

const getCargoStyle = (cargo: string) => {
  if (cargo.includes("SOLDADOR")) return {
    bg: "bg-[hsl(var(--komatsu-blue))]",
    text: "text-white",
    light: "bg-[hsl(var(--komatsu-blue))]/10",
    border: "border-[hsl(var(--komatsu-blue))]/30"
  };
  if (cargo.includes("SSOMA")) return {
    bg: "bg-[hsl(var(--komatsu-yellow))]",
    text: "text-black",
    light: "bg-[hsl(var(--komatsu-yellow))]/10",
    border: "border-[hsl(var(--komatsu-yellow))]/30"
  };
  return {
    bg: "bg-[hsl(var(--accent))]",
    text: "text-white",
    light: "bg-[hsl(var(--accent))]/10",
    border: "border-[hsl(var(--accent))]/30"
  };
};

const BambasGraficoMina = () => {
  const totalMeta = 22;
  const enMina = personalEnMina.length;
  const porcentajeAvance = Math.round((enMina / totalMeta) * 100);

  return (
    <main className="p-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[hsl(var(--komatsu-blue))]/10">
            <TrendingUp className="w-6 h-6 text-[hsl(var(--komatsu-blue))]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Avance de Reclutamiento - Bambas</h1>
            <p className="text-muted-foreground">Personal con ingreso confirmado a mina</p>
          </div>
        </div>
      </div>

      {/* Barra de progreso general */}
      <Card className="mb-6 border-2 border-[hsl(var(--komatsu-blue))]/20 bg-gradient-to-r from-[hsl(var(--komatsu-blue))]/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <HardHat className="w-8 h-8 text-[hsl(var(--komatsu-blue))]" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Progreso General</h2>
                <p className="text-sm text-muted-foreground">Meta: {totalMeta} colaboradores</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold text-[hsl(var(--komatsu-blue))]">{enMina}</span>
              <span className="text-2xl text-muted-foreground">/{totalMeta}</span>
              <p className="text-sm font-medium text-[hsl(var(--komatsu-blue))]">{porcentajeAvance}% completado</p>
            </div>
          </div>
          <Progress value={porcentajeAvance} className="h-4 bg-[hsl(var(--industrial-gray))]/20" />
        </CardContent>
      </Card>

      {/* Grid de estadísticas por cargo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {datosPorCargo.map((item, index) => {
          const isComplete = item.porcentaje === 100;
          return (
            <Card key={index} className={`border-l-4 ${isComplete ? "border-l-green-500" : "border-l-[hsl(var(--komatsu-blue))]"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{item.cargo}</span>
                  {isComplete ? (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[hsl(var(--komatsu-blue))]">
                      En progreso
                    </Badge>
                  )}
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-foreground">{item.cantidad}</span>
                  <span className="text-lg text-muted-foreground mb-1">/ {item.meta}</span>
                </div>
                <Progress 
                  value={item.porcentaje} 
                  className={`h-2 ${isComplete ? "bg-green-500/20" : "bg-[hsl(var(--industrial-gray))]/20"}`} 
                />
                <p className="text-xs text-muted-foreground mt-1">{item.porcentaje}% cubierto</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico circular */}
        <Card className="border border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[hsl(var(--komatsu-blue))]/10 to-transparent border-b pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[hsl(var(--komatsu-blue))]" />
              Estado del Reclutamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={datosResumen}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {datosResumen.map((entry, index) => (
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

        {/* Gráfico de barras por cargo */}
        <Card className="border border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[hsl(var(--komatsu-yellow))]/10 to-transparent border-b pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HardHat className="w-5 h-5 text-[hsl(var(--komatsu-yellow))]" />
              Avance por Puesto
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={datosPorCargo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 'dataMax']} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="cargo" type="category" stroke="hsl(var(--muted-foreground))" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value, name) => [value, name === "cantidad" ? "En mina" : "Meta"]}
                />
                <Bar dataKey="meta" fill="hsl(var(--industrial-gray))" name="Meta" radius={[0, 4, 4, 0]} />
                <Bar dataKey="cantidad" fill="hsl(var(--komatsu-blue))" name="En mina" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lista de personal en mina */}
      <Card className="border border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[hsl(var(--komatsu-blue))]/10 via-[hsl(var(--komatsu-blue))]/5 to-transparent border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Personal con Ingreso a Mina Confirmado ({enMina})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {personalEnMina.map((colaborador) => {
              const style = getCargoStyle(colaborador.cargo);
              return (
                <div
                  key={colaborador.item}
                  className={`p-3 rounded-lg border ${style.light} ${style.border} hover:shadow-md transition-all duration-200`}
                >
                  {/* Cargo destacado */}
                  <div className={`${style.bg} ${style.text} px-2 py-1 rounded-md text-xs font-semibold mb-2 flex items-center gap-1`}>
                    {getCargoIcon(colaborador.cargo)}
                    <span className="truncate">{colaborador.cargo}</span>
                  </div>
                  
                  {/* Nombre */}
                  <h4 className="font-medium text-sm text-foreground mb-2 line-clamp-2 min-h-[40px]" title={colaborador.nombre}>
                    {colaborador.nombre}
                  </h4>
                  
                  {/* Fechas */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Ingreso: <strong>{colaborador.ingreso}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <HardHat className="w-3 h-3" />
                      <span>En mina: <strong>{colaborador.ingresoMina}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default BambasGraficoMina;
