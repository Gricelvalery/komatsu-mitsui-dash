import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonProps {
  title: string;
}

export const ComingSoon = ({ title }: ComingSoonProps) => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <Card className="max-w-md w-full shadow-elevated">
        <CardContent className="pt-6 text-center">
          <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
          <p className="text-muted-foreground">
            Esta sección está en desarrollo y estará disponible próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
