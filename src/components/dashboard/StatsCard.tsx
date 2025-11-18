import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className={cn("border-2 hover:border-primary transition-all duration-300 hover:shadow-lg group", className)}>
      <CardContent className="p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="bg-primary/5 p-4 rounded-2xl group-hover:bg-primary/10 transition-colors">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            {trend && (
              <span
                className={cn(
                  "text-sm font-semibold px-3 py-1 rounded-full",
                  trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-5xl font-bold text-foreground tracking-tight">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
