import { Settings as SettingsIcon, Bell, Lock, Palette, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configuración del Sistema
          </h1>
          <p className="text-muted-foreground">
            Gestiona las preferencias y ajustes generales
          </p>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Notificaciones
              </h2>
              <p className="text-sm text-muted-foreground">
                Configura cómo recibes las notificaciones
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe alertas importantes por correo
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Alertas de Sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones de actualizaciones y mantenimiento
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Reportes Automáticos</Label>
                <p className="text-sm text-muted-foreground">
                  Envío programado de reportes semanales
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-secondary/20 p-3 rounded-lg">
              <Lock className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Seguridad
              </h2>
              <p className="text-sm text-muted-foreground">
                Gestiona la seguridad de tu cuenta
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cambiar Contraseña</Label>
              <Input type="password" placeholder="Contraseña actual" />
              <Input type="password" placeholder="Nueva contraseña" />
              <Input type="password" placeholder="Confirmar contraseña" />
              <Button className="mt-2 bg-secondary hover:bg-secondary/90">
                Actualizar Contraseña
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Autenticación de Dos Factores</Label>
                <p className="text-sm text-muted-foreground">
                  Añade una capa extra de seguridad
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent/20 p-3 rounded-lg">
              <Palette className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Apariencia
              </h2>
              <p className="text-sm text-muted-foreground">
                Personaliza la interfaz del sistema
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tema del Sistema</Label>
              <Select defaultValue="light">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Regional
              </h2>
              <p className="text-sm text-muted-foreground">
                Configura idioma y formato regional
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Zona Horaria</Label>
              <Select defaultValue="utc-3">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc-3">UTC-3 (Buenos Aires)</SelectItem>
                  <SelectItem value="utc-5">UTC-5 (Lima)</SelectItem>
                  <SelectItem value="utc-6">UTC-6 (Ciudad de México)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-primary hover:bg-primary/90">
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
