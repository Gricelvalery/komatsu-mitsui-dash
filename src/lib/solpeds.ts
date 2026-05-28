export const STATUS_META: Record<string, { label: string; cls: string }> = {
  pendiente: { label: "Pendiente", cls: "bg-muted text-muted-foreground border-border" },
  en_revision: { label: "En revisión", cls: "bg-primary/10 text-primary border-primary/30" },
  liberado: { label: "Liberado", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40" },
  observado: { label: "Observado", cls: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/40" },
  rechazado: { label: "Rechazado", cls: "bg-destructive/15 text-destructive border-destructive/40" },
};

export const PRIORITY_META: Record<string, { label: string; cls: string }> = {
  baja: { label: "Baja", cls: "bg-muted text-muted-foreground" },
  media: { label: "Media", cls: "bg-primary/10 text-primary" },
  alta: { label: "Alta", cls: "bg-orange-500/15 text-orange-700 dark:text-orange-400" },
  critica: { label: "Crítica", cls: "bg-destructive/15 text-destructive" },
};

export const STATUS_OPTIONS = Object.keys(STATUS_META);
export const PRIORITY_OPTIONS = Object.keys(PRIORITY_META);

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n || 0);

export const generateSolpedCode = () => {
  const y = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `SP-${y}-${rand}`;
};
