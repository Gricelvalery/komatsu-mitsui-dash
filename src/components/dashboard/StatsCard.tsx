import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, className }: StatsCardProps) => {
  return (
    <div className={cn(
      "group relative rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border-2 border-white/20 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-elevated overflow-hidden",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      <div className="relative p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-primary/10 p-4 rounded-2xl group-hover:bg-primary/20 transition-all duration-300">
                <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            {trend && (
              <span
                className={cn(
                  "text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm",
                  trend.isPositive 
                    ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30" 
                    : "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <h3 className="text-5xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
              {value}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
