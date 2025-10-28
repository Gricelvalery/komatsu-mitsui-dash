import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const barData = [
  { name: "Ene", proyectos: 12, equipos: 45 },
  { name: "Feb", proyectos: 19, equipos: 52 },
  { name: "Mar", proyectos: 15, equipos: 48 },
  { name: "Abr", proyectos: 22, equipos: 58 },
  { name: "May", proyectos: 28, equipos: 65 },
  { name: "Jun", proyectos: 25, equipos: 62 },
];

const pieData = [
  { name: "Operativos", value: 65 },
  { name: "Mantenimiento", value: 20 },
  { name: "En reparación", value: 10 },
  { name: "Fuera de servicio", value: 5 },
];

const COLORS = ["hsl(var(--komatsu-blue))", "hsl(var(--komatsu-yellow))", "hsl(var(--industrial-gray))", "hsl(var(--destructive))"];

export const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <Card className="backdrop-blur-glass border-white/20 shadow-industrial">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Proyectos y Equipos por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="proyectos" fill="hsl(var(--komatsu-blue))" name="Proyectos" />
              <Bar dataKey="equipos" fill="hsl(var(--komatsu-yellow))" name="Equipos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="backdrop-blur-glass border-white/20 shadow-industrial">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Estado de Equipos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
  );
};
