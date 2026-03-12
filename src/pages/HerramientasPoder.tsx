import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar,
  Treemap,
} from "recharts";
import {
  Wrench, AlertTriangle, CheckCircle2, XCircle, Settings2, TrendingDown,
  DollarSign, Package, Factory, Zap, Wind, Droplets, Battery, CircleDot
} from "lucide-react";

// ============ ALL TOOL DATA FROM EXCEL ============
interface Herramienta {
  proyecto: string;
  item: number;
  codigoActivo: string;
  descripcion: string;
  cantidad: number;
  marca: string;
  nSerie: string;
  modelo: string;
  tipoHerramienta: string;
  fechaAdquisicion: string;
  estado: string;
  ubicacionFisica: string;
  necesidadObligatoria: number;
  comentarios: string;
}

const herramientasData: Herramienta[] = [
  // CERRO VERDE
  { proyecto: "CERRO VERDE", item: 1, codigoActivo: "KM0060273", descripcion: "MULTIPLICADOR DE TORQUE", cantidad: 1, marca: "ARMSTRONG", nSerie: "YA393RK", modelo: "64-836", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "1999-06-02", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 2, codigoActivo: "KM0052405", descripcion: "ESCAREADOR NEUMATICO", cantidad: 1, marca: "INGERSOLL RAND", nSerie: "E302301043", modelo: "182K1", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2004-12-02", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 3, codigoActivo: "KM0049595", descripcion: "BOMBA HIDRAULICA", cantidad: 1, marca: "HYTORC", nSerie: "536240", modelo: "HY-AIR-PUMP", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2012-05-20", estado: "DE BAJA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "DADO DE BAJA" },
  { proyecto: "CERRO VERDE", item: 4, codigoActivo: "KM0049596", descripcion: "LLAVE DE TORQUE HIDRAULICA 1 1/2\"", cantidad: 1, marca: "HYTORC", nSerie: "A8TR1144348", modelo: "AVANTI 8", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2012-05-20", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 5, codigoActivo: "KM0052171", descripcion: "PISTOLA DE IMPACTO 1\"", cantidad: 1, marca: "URREA", nSerie: "1024", modelo: "UP898-6A", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2014-04-01", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 6, codigoActivo: "KM0052172", descripcion: "PISTOLA DE IMPACTO 1\"", cantidad: 1, marca: "URREA", nSerie: "1241", modelo: "UP598-6A", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2014-04-01", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 7, codigoActivo: "KM0052200", descripcion: "LLAVE DE TORQUE HIDRAULICA 1\"", cantidad: 1, marca: "HYTORC", nSerie: "A3TRI343-325", modelo: "AVANTI 3", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2014-04-14", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 8, codigoActivo: "KM0052201", descripcion: "PISTOLA DE IMPACTO 1-1/2\"", cantidad: 1, marca: "HYTORC", nSerie: "A8TRI337-I93", modelo: "AVANTI 8", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2014-04-14", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 9, codigoActivo: "KM0052199", descripcion: "CABEZAL DE TORQUE DOBLE EFECTO", cantidad: 1, marca: "HYTORC", nSerie: "AIOTRI38-287", modelo: "AVANTI10", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2014-04-14", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 10, codigoActivo: "KM0052288", descripcion: "CABEZAL DE TORQUE 1 1/2\"", cantidad: 1, marca: "HYTORC", nSerie: "A8TR1209-385", modelo: "AVANTI 8", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2014-07-07", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 11, codigoActivo: "KM0051916", descripcion: "PISTOLA NEUMATICA DE 1\"", cantidad: 1, marca: "CHICAGO PNEUMATIC", nSerie: "C0565-2013", modelo: "CP6920-D24", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2014-06-09", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 12, codigoActivo: "KM0062510", descripcion: "PISTOLA IMPACTO 1\"", cantidad: 1, marca: "URREA", nSerie: "1434", modelo: "", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2014-07-14", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 13, codigoActivo: "KM0057067", descripcion: "LLAVE DE TORQUE HIDRAULICA 1\"", cantidad: 1, marca: "ENERPAC", nSerie: "A2815BZ", modelo: "S3000", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2018-04-03", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 14, codigoActivo: "KM0064225", descripcion: "BOMBA HIDRAULICA", cantidad: 1, marca: "ENERPAC", nSerie: "G3915C", modelo: "PMU-10442-Q", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2018-04-03", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 15, codigoActivo: "KM0057082", descripcion: "LLAVE NEUMATICA DE TORQUE 1\"", cantidad: 1, marca: "SNAPON", nSerie: "17213854", modelo: "PT1800L", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2018-04-18", estado: "INOPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "NO SE UTILIZA / GUARDADA" },
  { proyecto: "CERRO VERDE", item: 16, codigoActivo: "KM0054498", descripcion: "LLAVE DE IMPACTO INALAMBRICA 1/2\"", cantidad: 1, marca: "DEWALT", nSerie: "988231", modelo: "DCF889M2-B2", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2018-09-27", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 17, codigoActivo: "KM0053529", descripcion: "LLAVE DE TORQUE HIDRAULICA 1 1/2\"", cantidad: 1, marca: "ATLAS", nSerie: "18N2070", modelo: "RT10", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2018-10-17", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 18, codigoActivo: "KM0057571", descripcion: "PISTOLA INALAMBRICA ELECTRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "J68AD180300124", modelo: "2883-259", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2019-11-25", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 19, codigoActivo: "KMP030141", descripcion: "PISTOLA INALAMBRICA ELECTRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "J39AF204600492", modelo: "", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2021-08-24", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 20, codigoActivo: "KMP031140", descripcion: "PISTOLA INALAMBRICA ELECTRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "", modelo: "", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2022-04-08", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 21, codigoActivo: "KM0607457", descripcion: "PISTOLA INALAMBRICA ELECTRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "", modelo: "", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-09-17", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 22, codigoActivo: "KM0701660", descripcion: "PISTOLA INALAMBRICA ELECTRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "", modelo: "2767-22R-2967-259", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-08-13", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 23, codigoActivo: "KM0701661", descripcion: "PISTOLA INALAMBRICA ELECTRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "", modelo: "2767-22R-2967-259", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-08-13", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 24, codigoActivo: "KM0701643", descripcion: "PISTOLA INALAMBRICA ELECTRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "N80AD245100322", modelo: "2967-20", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-08-13", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 25, codigoActivo: "KM0701644", descripcion: "PISTOLA INALAMBRICA ELECTRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "", modelo: "2967-20", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-08-13", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 26, codigoActivo: "KM0057696", descripcion: "TALADRO DESTORNILLADOR 1/2\" INALAMBRICO", cantidad: 1, marca: "MILWAUKEE", nSerie: "J78AD193400020", modelo: "ENG2805-220", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2020-01-09", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 3, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 27, codigoActivo: "KM0066045", descripcion: "PISTOLA NEUMATICA DE TORQUE 1 1/2\"", cantidad: 1, marca: "RAD", nSerie: "S/S", modelo: "60DX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2019-12-10", estado: "OPERATIVA", ubicacionFisica: "PRESTAMO ARMADO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 28, codigoActivo: "KMP010084", descripcion: "BOMBA HIDRAULICA MANUAL", cantidad: 1, marca: "ENERPAC", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2021-11-15", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 29, codigoActivo: "KMP010085", descripcion: "BOMBA HIDRAULICA ELECTRICA", cantidad: 1, marca: "ENERPAC", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2021-11-15", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 30, codigoActivo: "KM0603346", descripcion: "CILINDRO DE DOBLE EFECTO", cantidad: 1, marca: "LASTEKO", nSerie: "HC220513", modelo: "S/S", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2022-05-23", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 31, codigoActivo: "KM0607422", descripcion: "CHIMPADORA M18 FORCE LOGIC", cantidad: 1, marca: "MILWAUKEE", nSerie: "G69DD240200133", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-06-11", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 32, codigoActivo: "KM0607423", descripcion: "PISTOLA DE TORQUE CONTROLADO INALAMBRICA 1\"", cantidad: 1, marca: "B-RAD", nSerie: "BL16448", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-06-11", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 33, codigoActivo: "KM0605451", descripcion: "AMOLADORA RECTA 1/4\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-02-10", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 34, codigoActivo: "KM0605455", descripcion: "BOMBA DE ENGRASE NEUMATICA", cantidad: 1, marca: "ALEMITE USA", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2024-11-29", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 35, codigoActivo: "KM0701672", descripcion: "PISTOLA DE CALOR 18V", cantidad: 1, marca: "MILWAUKEE", nSerie: "2688-21", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-08-21", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 36, codigoActivo: "KM0701673", descripcion: "CILINDRO HIDRAULICO AC-306", cantidad: 1, marca: "DURAPAC", nSerie: "AC-306", modelo: "S/S", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2025-08-24", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 37, codigoActivo: "KM0057699", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "G81AD193100087", modelo: "ENG2758-220", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2020-01-09", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 38, codigoActivo: "KMP031137", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2022-04-08", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 39, codigoActivo: "KMP031093", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "257AF214916085", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2022-11-02", estado: "DE BAJA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "DADO DE BAJA" },
  { proyecto: "CERRO VERDE", item: 40, codigoActivo: "KMP031332", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "L57AF220706746", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2023-03-24", estado: "DE BAJA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "DADO DE BAJA" },
  { proyecto: "CERRO VERDE", item: 41, codigoActivo: "KMP031333", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "L57AF220706747", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2023-03-24", estado: "DE BAJA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "DADO DE BAJA" },
  { proyecto: "CERRO VERDE", item: 42, codigoActivo: "KM0607143", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "L57AF223100865", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2023-09-19", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 43, codigoActivo: "KM0604739", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-10-21", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 44, codigoActivo: "S/S", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-11-12", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 45, codigoActivo: "KM0701684", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "N71AD245000096", modelo: "3060-20", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-09-09", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 46, codigoActivo: "KM0701692", descripcion: "PISTOLA INALAMBRICA DE 3/8\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "N71AD245000066", modelo: "3060-20", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-09-09", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 47, codigoActivo: "KM0057574", descripcion: "PISTOLA DE IMPACTO INALAMBRICA 3/4\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "J69AD181800144", modelo: "2884-259", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2019-11-25", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 48, codigoActivo: "KMP031139", descripcion: "PISTOLA DE IMPACTO INALAMBRICA 3/4\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2022-04-08", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 49, codigoActivo: "KMP031138", descripcion: "PISTOLA DE IMPACTO INALAMBRICA 1\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2022-04-08", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "CERRO VERDE", item: 50, codigoActivo: "KMP030142", descripcion: "PISTOLA DE IMPACTO INALAMBRICA 1\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "K04AD205200093", modelo: "S/S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2021-08-24", estado: "OPERATIVA", ubicacionFisica: "ALMACEN DE HERRAMIENTAS", necesidadObligatoria: 2, comentarios: "" },

  // LAS BAMBAS
  { proyecto: "LAS BAMBAS", item: 1, codigoActivo: "KM0062916", descripcion: "BOMBA HIDRAULICA (CON CONECTOR ELECTRICA)", cantidad: 1, marca: "HYTORC", nSerie: "25520095", modelo: "HY-230-2-4S", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2015-12-22", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 2, codigoActivo: "KMP030288", descripcion: "BOMBA HIDRAULICA (CON CONECTOR ELECTRICA)", cantidad: 1, marca: "HYTORC", nSerie: "2432710022", modelo: "HY-230-2-4S", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2021-05-06", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 3, codigoActivo: "KMP031387", descripcion: "BOMBA HIDRAULICA (CON CONECTOR NEUMATICA)", cantidad: 1, marca: "HYTORC", nSerie: "3000000124", modelo: "HY-AIR-PUMP", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 4, codigoActivo: "KM0607436", descripcion: "LLAVE HIDRAULICA DE TORQUE DE 1\"", cantidad: 1, marca: "HYTORC", nSerie: "M3TR2414-316", modelo: "HY-3MXT", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 5, codigoActivo: "KM0051276", descripcion: "CABEZAL DE TORQUE HIDRAULICO 1\" AVANTI 3", cantidad: 1, marca: "HYTORC", nSerie: "A3TR1315058", modelo: "AVANTI 3", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2013-06-13", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 6, codigoActivo: "KMP031237", descripcion: "LLAVE DE TORQUE HIDRAULICO 1\"", cantidad: 1, marca: "SNAP-ON", nSerie: "HTQ3T3R2130-446", modelo: "", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2022-12-13", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 7, codigoActivo: "KM0057011", descripcion: "LLAVE HIDRAULICA DE TORQUE TITAN T10 1.1/2\"", cantidad: 1, marca: "TITAN", nSerie: "T10-1196", modelo: "TITAN 10", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2018-01-18", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 8, codigoActivo: "KM0062917", descripcion: "LLAVE TORQUE HIDRAULICA AVANTI8 1 1/2\"", cantidad: 1, marca: "HYTORC", nSerie: "A8TR1516-262", modelo: "AVANTI 8", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2015-12-22", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 9, codigoActivo: "KM0607437", descripcion: "LLAVE HIDRAULICA DE TORQUE 1.1/2\"", cantidad: 1, marca: "HYTORC", nSerie: "M10TR2246-050", modelo: "", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 10, codigoActivo: "KM0062795", descripcion: "LLAVE TORQUE NEUMATICO 1\" 34GX", cantidad: 1, marca: "RAD", nSerie: "1047830", modelo: "34GX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2015-11-27", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 2, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 11, codigoActivo: "KMP030174", descripcion: "LLAVE TORQUE NEUMATICO 1\" 34GX", cantidad: 1, marca: "RAD", nSerie: "2001438", modelo: "34GX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2021-11-04", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 12, codigoActivo: "KM0051202", descripcion: "LLAVE TORQUE NEUMATICO 1\" 34GX RING ADAPTER", cantidad: 1, marca: "RAD", nSerie: "975268", modelo: "34GX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2013-01-29", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 13, codigoActivo: "KM0055147", descripcion: "LLAVE TORQUE NEUMATICO 1\" 15DX", cantidad: 1, marca: "RAD", nSerie: "1086533", modelo: "15DX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2016-08-01", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 14, codigoActivo: "KM0056686", descripcion: "LLAVE TORQUE NEUMATICO 1\" 15DX", cantidad: 1, marca: "RAD", nSerie: "1134314", modelo: "15DX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2017-09-13", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 15, codigoActivo: "KM0063539", descripcion: "LLAVE TORQUE NEUMATICO 1-1/2\" 50DX", cantidad: 1, marca: "RAD", nSerie: "1112546", modelo: "50DX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2016-11-21", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 16, codigoActivo: "KM0062794", descripcion: "LLAVE TORQUE NEUMATICO 1-1/2\" 50DX", cantidad: 1, marca: "RAD", nSerie: "1021820", modelo: "50DX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2015-11-27", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 17, codigoActivo: "KMP030172", descripcion: "LLAVE TORQUE NEUMATICO 1-1/2\" 60DX", cantidad: 1, marca: "RAD", nSerie: "1273096", modelo: "60DX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2021-11-04", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 18, codigoActivo: "KM0606320", descripcion: "LLAVE TORQUE RAD 60DX 1 1/2\"", cantidad: 1, marca: "RAD", nSerie: "1289410", modelo: "60DX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2023-02-28", estado: "EN MANTTO.", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 19, codigoActivo: "S/P", descripcion: "LLAVE DE IMPACTO INALAMBRICO 1/2\" (K01)", cantidad: 1, marca: "MILWAUKEE", nSerie: "N80AD243400264", modelo: "M18 FUEL", tipoHerramienta: "BATERÍA", fechaAdquisicion: "2025-03-20", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 20, codigoActivo: "S/P", descripcion: "LLAVE DE IMPACTO INALAMBRICO 1/2\" (K02)", cantidad: 1, marca: "MILWAUKEE", nSerie: "N80AD243400276", modelo: "M18 FUEL", tipoHerramienta: "BATERÍA", fechaAdquisicion: "2025-03-20", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 21, codigoActivo: "S/P", descripcion: "LLAVE DE IMPACTO INALAMBRICO 1/2\" (K03)", cantidad: 1, marca: "MILWAUKEE", nSerie: "N80AD243400286", modelo: "M18 FUEL", tipoHerramienta: "BATERÍA", fechaAdquisicion: "2025-03-20", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LAS BAMBAS", item: 52, codigoActivo: "KM0063586", descripcion: "LLAVE DE IMPACTO 1 1/2", cantidad: 1, marca: "CHICAGO PNEUMATIC", nSerie: "C00537-2015", modelo: "", tipoHerramienta: "MECÁNICA", fechaAdquisicion: "2016-12-14", estado: "OPERATIVA", ubicacionFisica: "PAÑOL", necesidadObligatoria: 1, comentarios: "" },

  // MARCOBRE
  { proyecto: "MARCOBRE", item: 1, codigoActivo: "S/P", descripcion: "PISTOLA IMPACTO INAL. ENC. 1\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "K04BD220300109", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-01-01", estado: "DE BAJA", ubicacionFisica: "DESECHADA", necesidadObligatoria: 1, comentarios: "Se solicitara reposición" },
  { proyecto: "MARCOBRE", item: 2, codigoActivo: "S/P", descripcion: "PISTOLA IMPACTO INAL. ENC. 1\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "K04BD243700041", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-09-30", estado: "EN MANTTO.", ubicacionFisica: "CALLAO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 3, codigoActivo: "S/P", descripcion: "PISTOLA IMPACTO INAL. ENC. 1/2", cantidad: 1, marca: "MILWAUKEE", nSerie: "N80AD245100357", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-09-03", estado: "OPERATIVA", ubicacionFisica: "ALMACEN MARCOBRE", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 4, codigoActivo: "BKM108840", descripcion: "PISTOLA IMPACTO INAL. ENC. 1/2", cantidad: 1, marca: "MILWAUKEE", nSerie: "J68AD232100174", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-04-26", estado: "DE BAJA", ubicacionFisica: "DESECHADA", necesidadObligatoria: 1, comentarios: "Se solicitara reposición" },
  { proyecto: "MARCOBRE", item: 5, codigoActivo: "S/P", descripcion: "PISTOLA IMPACTO INAL. ENC. 1/2", cantidad: 1, marca: "MILWAUKEE", nSerie: "N80AD24300508", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-03-06", estado: "EN MANTTO.", ubicacionFisica: "CALLAO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 6, codigoActivo: "S/P", descripcion: "PISTOLA IMPACTO INAL. ENC. 1/2", cantidad: 1, marca: "SNAPON", nSerie: "2250034358", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-06-11", estado: "EN MANTTO.", ubicacionFisica: "CALLAO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 7, codigoActivo: "S/P", descripcion: "PISTOLA IMPACTO INAL. ENC. 3/4", cantidad: 1, marca: "MILWAUKEE", nSerie: "J69BD244900280", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-09-03", estado: "INOPERATIVA", ubicacionFisica: "CALLAO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 22, codigoActivo: "KM0605434", descripcion: "LLAVE DE TORQUE NEUMATICA 1\"", cantidad: 1, marca: "RAD", nSerie: "S/N", modelo: "34GX", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2025-02-02", estado: "OPERATIVA", ubicacionFisica: "ALMACEN MARCOBRE", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 23, codigoActivo: "KM0605439", descripcion: "LLAVE TORQUE ENC 1 1/2\"", cantidad: 1, marca: "HYTORC", nSerie: "MP05TR2402-286", modelo: "MXTP-05", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2025-02-13", estado: "OPERATIVA", ubicacionFisica: "ALMACEN MARCOBRE", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 24, codigoActivo: "KM0605437", descripcion: "BOMBA ELECTRICA HYTORC", cantidad: 1, marca: "HYTORC", nSerie: "3000024676", modelo: "HY-230-2-4S", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-02-13", estado: "OPERATIVA", ubicacionFisica: "ALMACEN MARCOBRE", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 25, codigoActivo: "BKM108829", descripcion: "LLAVE TORQUE ENC 1\"", cantidad: 1, marca: "TITAN", nSerie: "T3A18-0291", modelo: "TITAN T3", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2024-01-01", estado: "EN MANTTO.", ubicacionFisica: "CALLAO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 26, codigoActivo: "BKM108824", descripcion: "BOMBA ELECTRICA", cantidad: 1, marca: "ENERPAC", nSerie: "S/N", modelo: "ZU4 CLASS", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-03-20", estado: "EN MANTTO.", ubicacionFisica: "CALLAO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 27, codigoActivo: "BKM108828", descripcion: "LLAVE TORQUE ENC 1\"", cantidad: 1, marca: "HI-FORCE", nSerie: "BL6145", modelo: "TWS45N", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2024-01-01", estado: "EN MANTTO.", ubicacionFisica: "CALLAO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARCOBRE", item: 28, codigoActivo: "BKM108823", descripcion: "BOMBA ELECTRICA", cantidad: 1, marca: "HI-FORCE", nSerie: "BQ5043", modelo: "TPE26A", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-01-01", estado: "EN MANTTO.", ubicacionFisica: "CALLAO", necesidadObligatoria: 1, comentarios: "" },

  // QUELLAVECO (sample)
  { proyecto: "QUELLAVECO", item: 1, codigoActivo: "BMKMC01124", descripcion: "ATORNILLADOR INAL.", cantidad: 1, marca: "BOSCH", nSerie: "225003739", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "OPERATIVA", ubicacionFisica: "ALMACEN 2", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "QUELLAVECO", item: 5, codigoActivo: "BMKMC01208", descripcion: "BOMBA ELECTRO HIDRAULICA", cantidad: 1, marca: "ENERPAC", nSerie: "D28319002C", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "", estado: "OPERATIVA", ubicacionFisica: "ALMACEN 2", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "QUELLAVECO", item: 17, codigoActivo: "KM07015551", descripcion: "PISTOLA INALAMBRICA ENC 1\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "K04BD23270076", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "OPERATIVA", ubicacionFisica: "ALMACEN 2", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "QUELLAVECO", item: 18, codigoActivo: "KM0701550", descripcion: "PISTOLA INALAMBRICA ENC 1\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "K04B223500306", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "DE BAJA", ubicacionFisica: "PISO ALMACEN 1", necesidadObligatoria: 2, comentarios: "PENDIENTE DE REPOSICION" },
  { proyecto: "QUELLAVECO", item: 23, codigoActivo: "BMKMC01205", descripcion: "PISTOLA DE GRASA MILWAUKEE", cantidad: 1, marca: "MILWAUKEE", nSerie: "E98AF234907329", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "EN MANTTO.", ubicacionFisica: "ALMACEN 3", necesidadObligatoria: 1, comentarios: "ENVIO PARA MANTTO" },
  { proyecto: "QUELLAVECO", item: 26, codigoActivo: "BMKMC01395", descripcion: "PISTOLA IMPACTO INAL. ENC 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "J68AD233100021", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "DE BAJA", ubicacionFisica: "PISO ALMACEN 1", necesidadObligatoria: 1, comentarios: "PENDIENTE DE REPOSICION" },
  { proyecto: "QUELLAVECO", item: 29, codigoActivo: "BMKMC01301", descripcion: "PISTOLA IMPACTO INAL. ENC 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "J68AD232100215", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "DE BAJA", ubicacionFisica: "ALMACEN 3", necesidadObligatoria: 1, comentarios: "PENDIENTE DE REPOSICION" },
  { proyecto: "QUELLAVECO", item: 34, codigoActivo: "KM0701536", descripcion: "PISTOLA IMPACTO INAL. ENC 3/4\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "J69AD234500107", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "DE BAJA", ubicacionFisica: "PISO ALMACEN 1", necesidadObligatoria: 1, comentarios: "PENDIENTE DE REPOSICION" },
  { proyecto: "QUELLAVECO", item: 48, codigoActivo: "KM0701564", descripcion: "VIDEOSCOPIO", cantidad: 1, marca: "FLUKE", nSerie: "DS703F-23070170", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "DE BAJA", ubicacionFisica: "ALMACEN 1", necesidadObligatoria: 1, comentarios: "PENDIENTE DE REPOSICION" },

  // TOROMOCHO (sample)
  { proyecto: "LPP TOROMOCHO", item: 1, codigoActivo: "KM0049721", descripcion: "LLAVE DE TORQUE 1 1/2\" DE DOBLE EFECTO", cantidad: 1, marca: "HYTORC", nSerie: "A8TRL218", modelo: "AVANTI 08", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2012-09-11", estado: "OPERATIVA", ubicacionFisica: "PAÑOL DE KMMP TOROMOCHO", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "LPP TOROMOCHO", item: 11, codigoActivo: "KMP031353", descripcion: "PISTOLA DE IMPACTO INAL. DE 1/2", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "18V-5", tipoHerramienta: "BATERÍA", fechaAdquisicion: "2020-12-07", estado: "DE BAJA", ubicacionFisica: "CONTAINER DE RESITER", necesidadObligatoria: 1, comentarios: "YA SE REPUSO" },
  { proyecto: "LPP TOROMOCHO", item: 12, codigoActivo: "KMP031354", descripcion: "PISTOLA DE IMPACTO INAL. DE 3/4", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "18V-5", tipoHerramienta: "BATERÍA", fechaAdquisicion: "2020-12-07", estado: "DE BAJA", ubicacionFisica: "CONTAINER DE RESITER", necesidadObligatoria: 1, comentarios: "PENDIENTE SU REPOSICION" },
  { proyecto: "LPP TOROMOCHO", item: 13, codigoActivo: "KMP030222", descripcion: "PISTOLA DE IMPACTO INAL. DE 3/4", cantidad: 1, marca: "URREA", nSerie: "S/S", modelo: "UP776", tipoHerramienta: "BATERÍA", fechaAdquisicion: "2020-12-07", estado: "DE BAJA", ubicacionFisica: "CONTAINER DE RESITER", necesidadObligatoria: 1, comentarios: "PENDIENTE SU REPOSICION" },
  { proyecto: "LPP TOROMOCHO", item: 15, codigoActivo: "KM0606094", descripcion: "PISTOLA DE IMPACTO INAL. DE 1/2", cantidad: 1, marca: "MILWAUKEE", nSerie: "J68AD220500", modelo: "18V-5", tipoHerramienta: "BATERÍA", fechaAdquisicion: "2023-02-17", estado: "DE BAJA", ubicacionFisica: "CONTAINER DE RESITER", necesidadObligatoria: 1, comentarios: "PENDIENTE SU REPOSICION" },
  { proyecto: "LPP TOROMOCHO", item: 25, codigoActivo: "KM0607156", descripcion: "PISTOLA DE IMPACTO INAL. DE 1\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "K044BD223500", modelo: "18V-5", tipoHerramienta: "BATERÍA", fechaAdquisicion: "2023-10-24", estado: "DE BAJA", ubicacionFisica: "CONTAINER DE RESITER", necesidadObligatoria: 2, comentarios: "PENDIENTE SU REPOSICION" },
  { proyecto: "LPP TOROMOCHO", item: 6, codigoActivo: "KMP031173", descripcion: "LLAVE DE IMPACTO NEUMATICO DE 1\"", cantidad: 1, marca: "BLUE POINT", nSerie: "20520009", modelo: "S/M", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2022-01-01", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "EN MANTTO." },
  { proyecto: "LPP TOROMOCHO", item: 24, codigoActivo: "KM0606131", descripcion: "LLAVE NEUMATICA DE TORQUE 1 1/2", cantidad: 1, marca: "HYTORC", nSerie: "J5020502234", modelo: "SINGLE SPEED", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2022-11-15", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 2, comentarios: "EN MANTTO." },

  // ANTAPACCAY
  { proyecto: "ANTAPACCAY", item: 1, codigoActivo: "KMP031276", descripcion: "LLAVE DE IMPACTO INALAMBRICA 3/8\"", cantidad: 1, marca: "SNAP-ON", nSerie: "S/S", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2023-01-10", estado: "OPERATIVA", ubicacionFisica: "ANTAPACCAY", necesidadObligatoria: 1, comentarios: "CAMBIO DE PARTES INTERNAS" },
  { proyecto: "ANTAPACCAY", item: 6, codigoActivo: "KM0607936", descripcion: "LLAVE DE IMPACTO INALAMBRICA 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "S/M", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2025-02-28", estado: "OPERATIVA", ubicacionFisica: "ANTAPACCAY", necesidadObligatoria: 1, comentarios: "FALLAS EN AJUSTE DE BATERIA" },
  { proyecto: "ANTAPACCAY", item: 22, codigoActivo: "KM0607123", descripcion: "LLAVE NEUMATICA DE TORQUE 1\"", cantidad: 1, marca: "HYTORC", nSerie: "S/S", modelo: "JGUN-A3", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "2023-09-06", estado: "DE BAJA", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "CABEZAL ROTO" },
  { proyecto: "ANTAPACCAY", item: 27, codigoActivo: "KMP030155", descripcion: "LLAVE DE TORQUE HIDRAULICO RT05", cantidad: 1, marca: "ATLAS", nSerie: "S/S", modelo: "RT5", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "2021-09-29", estado: "EN MANTTO.", ubicacionFisica: "ANTAPACCAY", necesidadObligatoria: 1, comentarios: "FISURAS Y ABOLLADURAS" },
  { proyecto: "ANTAPACCAY", item: 30, codigoActivo: "KM0607435", descripcion: "PISTOLA DE TORQUE A BATERIA 500 3000", cantidad: 1, marca: "HYTORC", nSerie: "S/S", modelo: "LST-3000", tipoHerramienta: "ELÉCTRICA", fechaAdquisicion: "2024-08-01", estado: "INOPERATIVA", ubicacionFisica: "ANTAPACCAY", necesidadObligatoria: 1, comentarios: "" },

  // MARC BAYOVAR
  { proyecto: "MARC BAYOVAR", item: 1, codigoActivo: "K00500791", descripcion: "PISTOLA NEUMATICA DE 1/2\"", cantidad: 1, marca: "CHICAGO PNEUMATIC", nSerie: "S/S", modelo: "S/M", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "", estado: "OPERATIVA", ubicacionFisica: "PAÑOL 1", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARC BAYOVAR", item: 8, codigoActivo: "KM0607393", descripcion: "RAD NEUMATICO DE 1\"", cantidad: 1, marca: "RAD", nSerie: "1280050", modelo: "S/M", tipoHerramienta: "NEUMÁTICA", fechaAdquisicion: "", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARC BAYOVAR", item: 16, codigoActivo: "KMP031291", descripcion: "PISTOLA INALAMBRICA DE 1\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "K04BD223000008", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARC BAYOVAR", item: 17, codigoActivo: "KMP031293", descripcion: "PISTOLA INALAMBRICA DE 3/4\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "J69AD220900117", modelo: "S/M", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "INOPERATIVA", ubicacionFisica: "PAÑOL 1", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARC BAYOVAR", item: 20, codigoActivo: "PIN1/2-10", descripcion: "PISTOLA INALAMBRICA DE 1/2\"", cantidad: 1, marca: "MILWAUKEE", nSerie: "S/S", modelo: "M18", tipoHerramienta: "BATERÍA", fechaAdquisicion: "", estado: "INOPERATIVA", ubicacionFisica: "PAÑOL 1", necesidadObligatoria: 1, comentarios: "" },
  { proyecto: "MARC BAYOVAR", item: 27, codigoActivo: "KMP030277", descripcion: "BOMBA HYTORC", cantidad: 1, marca: "HYTORC", nSerie: "S/S", modelo: "S/M", tipoHerramienta: "HIDRÁULICA", fechaAdquisicion: "", estado: "EN MANTTO.", ubicacionFisica: "LIMA", necesidadObligatoria: 1, comentarios: "" },
];

// Consolidated data from Page 10 of the Excel
const consolidadoProyectos = [
  { proyecto: "Antamina", necesidad: 0, real: 0, faltante: 0, costo: 0, disponibilidad: 0 },
  { proyecto: "Armados", necesidad: 0, real: 0, faltante: 0, costo: 0, disponibilidad: 0 },
  { proyecto: "Cerro Verde", necesidad: 13, real: 10, faltante: 3, costo: 31275, disponibilidad: 77 },
  { proyecto: "Las Bambas", necesidad: 26, real: 18, faltante: 7, costo: 63470, disponibilidad: 69 },
  { proyecto: "Marcobre", necesidad: 6, real: 6, faltante: 0, costo: 0, disponibilidad: 100 },
  { proyecto: "Quellaveco", necesidad: 6, real: 6, faltante: 0, costo: 0, disponibilidad: 100 },
  { proyecto: "Toromocho", necesidad: 14, real: 12, faltante: 3, costo: 27932, disponibilidad: 75 },
  { proyecto: "Antapaccay", necesidad: 11, real: 8, faltante: 2, costo: 22641, disponibilidad: 73 },
  { proyecto: "Bayóvar", necesidad: 5, real: 5, faltante: 0, costo: 0, disponibilidad: 100 },
];

const COLORS_STATUS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const STATUS_COLORS: Record<string, string> = {
  "OPERATIVA": "hsl(142, 76%, 36%)",
  "INOPERATIVA": "hsl(0, 84%, 60%)",
  "EN MANTTO.": "hsl(45, 93%, 47%)",
  "DE BAJA": "hsl(0, 0%, 45%)",
};

const getStatusBadgeVariant = (estado: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (estado.toUpperCase()) {
    case "OPERATIVA": return "default";
    case "EN MANTTO.": return "secondary";
    case "INOPERATIVA": return "destructive";
    case "DE BAJA": return "outline";
    default: return "secondary";
  }
};

const tipoIconMap: Record<string, React.ReactNode> = {
  "NEUMÁTICA": <Wind className="w-4 h-4" />,
  "HIDRÁULICA": <Droplets className="w-4 h-4" />,
  "ELÉCTRICA": <Zap className="w-4 h-4" />,
  "BATERÍA": <Battery className="w-4 h-4" />,
  "MECÁNICA": <Settings2 className="w-4 h-4" />,
};

// Semicircle gauge component
const GaugeChart = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const data = [{ value, fill: color }, { value: 100 - value, fill: "hsl(var(--muted))" }];
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width={140} height={80}>
        <RadialBarChart
          cx="50%" cy="100%" innerRadius="60%" outerRadius="100%"
          startAngle={180} endAngle={0} barSize={12} data={[data[0]]}
        >
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "hsl(var(--muted))" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <span className="text-2xl font-bold -mt-4" style={{ color }}>{value}%</span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
};

const HerramientasPoder = () => {
  const [selectedProyecto, setSelectedProyecto] = useState<string>("todos");

  const proyectos = useMemo(() => {
    const set = new Set(herramientasData.map(h => h.proyecto));
    return Array.from(set).sort();
  }, []);

  const filteredData = useMemo(() => {
    if (selectedProyecto === "todos") return herramientasData;
    return herramientasData.filter(h => h.proyecto === selectedProyecto);
  }, [selectedProyecto]);

  // KPIs
  const totalHerramientas = filteredData.length;
  const operativas = filteredData.filter(h => h.estado === "OPERATIVA").length;
  const enMantto = filteredData.filter(h => h.estado.includes("MANTTO")).length;
  const inoperativas = filteredData.filter(h => h.estado === "INOPERATIVA").length;
  const deBaja = filteredData.filter(h => h.estado === "DE BAJA").length;
  const disponibilidad = totalHerramientas > 0 ? Math.round((operativas / totalHerramientas) * 100) : 0;

  // Status distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(h => { counts[h.estado] = (counts[h.estado] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Type distribution
  const tipoData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(h => {
      const tipo = h.tipoHerramienta.toUpperCase();
      counts[tipo] = (counts[tipo] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Brand distribution
  const marcaData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(h => { counts[h.marca] = (counts[h.marca] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [filteredData]);

  // Project availability for gauges
  const availabilityByProject = useMemo(() => {
    const map: Record<string, { total: number; op: number }> = {};
    herramientasData.forEach(h => {
      if (!map[h.proyecto]) map[h.proyecto] = { total: 0, op: 0 };
      map[h.proyecto].total++;
      if (h.estado === "OPERATIVA") map[h.proyecto].op++;
    });
    return Object.entries(map).map(([p, v]) => ({
      proyecto: p, disponibilidad: Math.round((v.op / v.total) * 100)
    }));
  }, []);

  // Pending reposition
  const pendienteReposicion = filteredData.filter(h =>
    h.comentarios.toLowerCase().includes("reposicion") || h.comentarios.toLowerCase().includes("reposición")
  );

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Herramientas de Poder</h1>
          <p className="text-sm text-muted-foreground">Inventario consolidado por proyecto</p>
        </div>
        <Select value={selectedProyecto} onValueChange={setSelectedProyecto}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtrar por proyecto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los proyectos</SelectItem>
            {proyectos.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(var(--primary))" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Package className="w-4 h-4" /> Total</div>
            <p className="text-3xl font-bold text-foreground">{totalHerramientas}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(142, 76%, 36%)" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "hsl(142, 76%, 36%)" }}><CheckCircle2 className="w-4 h-4" /> Operativas</div>
            <p className="text-3xl font-bold text-foreground">{operativas}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(45, 93%, 47%)" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "hsl(45, 93%, 47%)" }}><Settings2 className="w-4 h-4" /> En Mantto.</div>
            <p className="text-3xl font-bold text-foreground">{enMantto}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(0, 84%, 60%)" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "hsl(0, 84%, 60%)" }}><XCircle className="w-4 h-4" /> Inoperativas</div>
            <p className="text-3xl font-bold text-foreground">{inoperativas}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "hsl(0, 0%, 45%)" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "hsl(0, 0%, 45%)" }}><TrendingDown className="w-4 h-4" /> De Baja</div>
            <p className="text-3xl font-bold text-foreground">{deBaja}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: disponibilidad >= 80 ? "hsl(142, 76%, 36%)" : disponibilidad >= 60 ? "hsl(45, 93%, 47%)" : "hsl(0, 84%, 60%)" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Wrench className="w-4 h-4" /> Disponibilidad</div>
            <p className="text-3xl font-bold text-foreground">{disponibilidad}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="proyectos">Por Proyecto</TabsTrigger>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        {/* TAB: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Pie */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Distribución por Estado</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS_STATUS[i % COLORS_STATUS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Type Pie */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Distribución por Tipo</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={tipoData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {tipoData.map((_, i) => (
                        <Cell key={i} fill={COLORS_STATUS[i % COLORS_STATUS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Brands Bar */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Marcas</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={marcaData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Availability Gauges */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Disponibilidad por Proyecto</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-6">
                {availabilityByProject.map(p => (
                  <GaugeChart
                    key={p.proyecto}
                    value={p.disponibilidad}
                    label={p.proyecto}
                    color={p.disponibilidad >= 80 ? "hsl(142, 76%, 36%)" : p.disponibilidad >= 60 ? "hsl(45, 93%, 47%)" : "hsl(0, 84%, 60%)"}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: PROYECTOS (consolidated data) */}
        <TabsContent value="proyectos" className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Necesidad vs Disponibilidad Real (Herramientas Especializadas)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={consolidadoProyectos.filter(p => p.necesidad > 0)} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="proyecto" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="necesidad" name="Necesidad Operativa" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="real" name="Cantidad Real" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="faltante" name="Faltante" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost and availability table */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Resumen Consolidado por Proyecto</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Proyecto</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Necesidad</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Real</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Faltante</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Costo Faltante (USD)</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Disponibilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {consolidadoProyectos.filter(p => p.necesidad > 0).map(p => (
                    <tr key={p.proyecto} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-3 font-medium text-foreground">{p.proyecto}</td>
                      <td className="py-2 px-3 text-center text-foreground">{p.necesidad}</td>
                      <td className="py-2 px-3 text-center text-foreground">{p.real}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant={p.faltante > 0 ? "destructive" : "default"}>{p.faltante}</Badge>
                      </td>
                      <td className="py-2 px-3 text-center text-foreground">${p.costo.toLocaleString()}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge
                          variant="outline"
                          className="font-bold"
                          style={{
                            color: p.disponibilidad >= 80 ? "hsl(142, 76%, 36%)" : p.disponibilidad >= 60 ? "hsl(45, 93%, 47%)" : "hsl(0, 84%, 60%)",
                            borderColor: p.disponibilidad >= 80 ? "hsl(142, 76%, 36%)" : p.disponibilidad >= 60 ? "hsl(45, 93%, 47%)" : "hsl(0, 84%, 60%)",
                          }}
                        >
                          {p.disponibilidad}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: INVENTARIO */}
        <TabsContent value="inventario" className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Inventario Detallado ({filteredData.length} herramientas)</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {["Proyecto", "Código", "Descripción", "Marca", "Modelo", "Tipo", "Estado", "Ubicación"].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((h, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-muted/50">
                      <td className="py-1.5 px-2 text-foreground whitespace-nowrap">{h.proyecto}</td>
                      <td className="py-1.5 px-2 text-muted-foreground font-mono text-[10px]">{h.codigoActivo}</td>
                      <td className="py-1.5 px-2 text-foreground max-w-[200px] truncate">{h.descripcion}</td>
                      <td className="py-1.5 px-2 text-foreground">{h.marca}</td>
                      <td className="py-1.5 px-2 text-muted-foreground">{h.modelo}</td>
                      <td className="py-1.5 px-2">
                        <div className="flex items-center gap-1">
                          {tipoIconMap[h.tipoHerramienta.toUpperCase()] || <CircleDot className="w-3 h-3" />}
                          <span className="text-foreground">{h.tipoHerramienta}</span>
                        </div>
                      </td>
                      <td className="py-1.5 px-2">
                        <Badge variant={getStatusBadgeVariant(h.estado)} className="text-[10px]">{h.estado}</Badge>
                      </td>
                      <td className="py-1.5 px-2 text-muted-foreground">{h.ubicacionFisica}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: ALERTAS */}
        <TabsContent value="alertas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending reposition */}
            <Card className="border-destructive/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Pendientes de Reposición ({pendienteReposicion.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendienteReposicion.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay herramientas pendientes de reposición</p>
                ) : (
                  <div className="space-y-2">
                    {pendienteReposicion.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                        <div>
                          <p className="text-xs font-medium text-foreground">{h.descripcion}</p>
                          <p className="text-[10px] text-muted-foreground">{h.proyecto} · {h.marca}</p>
                        </div>
                        <Badge variant="destructive" className="text-[10px]">Reponer</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inoperative */}
            <Card className="border-orange-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4" style={{ color: "hsl(0, 84%, 60%)" }} />
                  Herramientas Inoperativas ({filteredData.filter(h => h.estado === "INOPERATIVA").length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredData.filter(h => h.estado === "INOPERATIVA").map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-xs font-medium text-foreground">{h.descripcion}</p>
                        <p className="text-[10px] text-muted-foreground">{h.proyecto} · {h.marca} · {h.codigoActivo}</p>
                      </div>
                      <Badge variant="destructive" className="text-[10px]">Inoperativa</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools in maintenance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings2 className="w-4 h-4" style={{ color: "hsl(45, 93%, 47%)" }} />
                En Mantenimiento ({filteredData.filter(h => h.estado.includes("MANTTO")).length})
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {["Proyecto", "Descripción", "Marca", "Código", "Ubicación", "Comentario"].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.filter(h => h.estado.includes("MANTTO")).map((h, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-muted/50">
                      <td className="py-1.5 px-2 text-foreground">{h.proyecto}</td>
                      <td className="py-1.5 px-2 text-foreground">{h.descripcion}</td>
                      <td className="py-1.5 px-2 text-foreground">{h.marca}</td>
                      <td className="py-1.5 px-2 text-muted-foreground font-mono">{h.codigoActivo}</td>
                      <td className="py-1.5 px-2 text-muted-foreground">{h.ubicacionFisica}</td>
                      <td className="py-1.5 px-2 text-muted-foreground">{h.comentarios || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HerramientasPoder;
