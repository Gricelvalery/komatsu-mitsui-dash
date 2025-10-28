import { useState } from "react";
import { Users as UsersIcon, UserPlus, Search, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "supervisor" | "operador";
  status: "activo" | "inactivo";
  initials: string;
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Carlos Mendoza",
      email: "cmendoza@komatsu.com",
      role: "admin",
      status: "activo",
      initials: "CM",
    },
    {
      id: "2",
      name: "Ana Torres",
      email: "atorres@komatsu.com",
      role: "supervisor",
      status: "activo",
      initials: "AT",
    },
    {
      id: "3",
      name: "Luis Ramírez",
      email: "lramirez@komatsu.com",
      role: "operador",
      status: "activo",
      initials: "LR",
    },
    {
      id: "4",
      name: "María González",
      email: "mgonzalez@komatsu.com",
      role: "supervisor",
      status: "inactivo",
      initials: "MG",
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const config: Record<
      string,
      { variant: "default" | "secondary" | "outline"; label: string }
    > = {
      admin: { variant: "default", label: "Administrador" },
      supervisor: { variant: "secondary", label: "Supervisor" },
      operador: { variant: "outline", label: "Operador" },
    };
    const { variant, label } = config[role];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getStatusColor = (status: string) => {
    return status === "activo" ? "bg-green-500" : "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona usuarios y permisos del sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Usuarios</p>
                <p className="text-3xl font-bold">4</p>
              </div>
              <UsersIcon className="h-10 w-10 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Activos</p>
                <p className="text-3xl font-bold text-foreground">3</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full bg-green-500" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-secondary text-secondary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Administradores</p>
                <p className="text-3xl font-bold">1</p>
              </div>
              <Shield className="h-10 w-10 opacity-80" />
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Agregar Usuario
            </Button>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="p-4 bg-muted/30 border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {user.name}
                        </h3>
                        <div
                          className={`h-2 w-2 rounded-full ${getStatusColor(
                            user.status
                          )}`}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getRoleBadge(user.role)}
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Users;
