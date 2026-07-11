import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, ArrowLeft, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Person {
  id: string;
  name: string;
  position: string;
  area?: string;
  photo?: string;
  bio: string;
  reports?: Person[];
}

const ORG: Person = {
  id: "ceo",
  name: "Ricardo Salazar",
  position: "CEO",
  area: "Dirección General",
  bio: "Ricardo lidera Komatsu Mitsui con más de 25 años de experiencia en la industria minera. Ingeniero Industrial por la PUCP con MBA en INCAE. Ha liderado la expansión regional de la compañía y la transformación digital de operaciones.",
  reports: [
    {
      id: "sg-ops",
      name: "María Fernanda Ortega",
      position: "Subgerente",
      area: "Operaciones Mina",
      bio: "María Fernanda cuenta con 18 años en operaciones mineras a tajo abierto. Especialista en optimización de flota y mantenimiento predictivo. Ingeniera de Minas UNI.",
      reports: [
        { id: "gp-antapaccay", name: "Luis Ramírez", position: "Gerente de Proyecto", area: "Antapaccay", bio: "Luis lidera el proyecto Antapaccay desde 2021. Experto en gestión de contratos MARC y disponibilidad de equipos pesados." },
        { id: "gp-lasbambas", name: "Diego Chávez", position: "Gerente de Proyecto", area: "Las Bambas", bio: "Diego dirige las operaciones en Las Bambas con foco en seguridad y productividad. 15 años en Komatsu." },
      ],
    },
    {
      id: "sg-mant",
      name: "Carlos Andrés Vega",
      position: "Subgerente",
      area: "Mantenimiento y Confiabilidad",
      bio: "Carlos es Ingeniero Mecánico con especialización en confiabilidad (CMRP). Lidera la estrategia RCM aplicada a la flota Komatsu en toda la región.",
      reports: [
        { id: "gp-quellaveco", name: "Ana Torres", position: "Gerente de Proyecto", area: "Quellaveco", bio: "Ana lidera el proyecto Quellaveco con enfoque en confiabilidad de camiones 930E y palas eléctricas." },
        { id: "gp-cerroverde", name: "Jorge Palacios", position: "Gerente de Proyecto", area: "Cerro Verde", bio: "Jorge maneja el contrato de Cerro Verde con más de 200 técnicos a cargo." },
      ],
    },
    {
      id: "sg-adm",
      name: "Patricia Núñez",
      position: "Subgerente",
      area: "Administración y Finanzas",
      bio: "Patricia es CPA con MBA por ESAN. Lidera finanzas, control de gestión y compras estratégicas. 20 años en el sector.",
      reports: [
        { id: "gp-compras", name: "Fernando Ríos", position: "Gerente de Proyecto", area: "Control de Compras", bio: "Fernando dirige el proceso de procurement corporativo y control de SOLPEDs." },
      ],
    },
    {
      id: "sg-plm",
      name: "Roberto Alcántara",
      position: "Subgerente",
      area: "PLM y Tecnología",
      bio: "Roberto lidera la implementación de PLM, KOMTRAX y analítica avanzada de datos de flota. Ingeniero de Sistemas UNI.",
      reports: [
        { id: "gp-plm", name: "Sofía Mendoza", position: "Gerente de Proyecto", area: "Plataforma PLM", bio: "Sofía coordina el rollout de PLM en todos los proyectos y la integración con SAP." },
      ],
    },
    {
      id: "sg-rrhh",
      name: "Elena Gutiérrez",
      position: "Subgerente",
      area: "Recursos Humanos y SSOMA",
      bio: "Elena lidera talento humano, cultura y seguridad ocupacional. Psicóloga organizacional con 22 años de trayectoria.",
      reports: [
        { id: "gp-ssoma", name: "Miguel Ángel Soto", position: "Gerente de Proyecto", area: "SSOMA Corporativo", bio: "Miguel Ángel implementa los estándares ISO 45001 y ISO 14001 en todos los sites." },
      ],
    },
  ],
};

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const PersonCard = ({
  person,
  onOpenBio,
  onExpand,
  expanded,
  size = "md",
}: {
  person: Person;
  onOpenBio: () => void;
  onExpand?: () => void;
  expanded?: boolean;
  size?: "lg" | "md" | "sm";
}) => {
  const hasReports = !!person.reports && person.reports.length > 0;
  const sizes = {
    lg: { avatar: "h-24 w-24", name: "text-xl", card: "p-6" },
    md: { avatar: "h-20 w-20", name: "text-base", card: "p-5" },
    sm: { avatar: "h-16 w-16", name: "text-sm", card: "p-4" },
  }[size];

  return (
    <Card
      className={cn(
        "flex flex-col items-center text-center gap-3 transition-smooth cursor-pointer",
        "hover:shadow-elevated hover:-translate-y-1 bg-card/70 backdrop-blur border-border",
        sizes.card
      )}
    >
      <div onClick={onOpenBio} className="flex flex-col items-center gap-3">
        <Avatar className={cn(sizes.avatar, "ring-4 ring-primary/20")}>
          <AvatarImage src={person.photo} alt={person.name} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
            {initials(person.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className={cn("font-semibold text-foreground", sizes.name)}>{person.name}</p>
          <p className="text-xs text-muted-foreground">{person.position}</p>
          {person.area && (
            <Badge variant="secondary" className="mt-2 text-[10px]">
              {person.area}
            </Badge>
          )}
        </div>
      </div>
      {hasReports && onExpand && (
        <Button variant="ghost" size="sm" onClick={onExpand} className="mt-1 h-8">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="ml-1 text-xs">
            {expanded ? "Ocultar" : `${person.reports!.length} a cargo`}
          </span>
        </Button>
      )}
    </Card>
  );
};

const Organigrama = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [bio, setBio] = useState<Person | null>(null);

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const totals = useMemo(() => {
    const subs = ORG.reports?.length ?? 0;
    const gps = ORG.reports?.reduce((a, s) => a + (s.reports?.length ?? 0), 0) ?? 0;
    return { subs, gps, total: 1 + subs + gps };
  }, []);

  return (
    <div className="min-h-screen p-6 animate-fade-in bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Organigrama
          </h1>
          <p className="text-muted-foreground mt-1">
            Estructura organizacional de Komatsu Mitsui. Haz clic en cada persona para ver su biografía.
          </p>
          <div className="flex gap-3 mt-4">
            <Badge variant="outline" className="gap-1"><Users className="h-3 w-3" /> {totals.total} colaboradores</Badge>
            <Badge variant="outline">{totals.subs} subgerentes</Badge>
            <Badge variant="outline">{totals.gps} gerentes de proyecto</Badge>
          </div>
        </div>

        {/* CEO */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <PersonCard person={ORG} onOpenBio={() => setBio(ORG)} size="lg" />
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="w-px h-8 bg-border" />
        </div>

        {/* Subgerentes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ORG.reports!.map((sub) => (
            <div key={sub.id} className="space-y-4">
              <PersonCard
                person={sub}
                onOpenBio={() => setBio(sub)}
                onExpand={() => toggle(sub.id)}
                expanded={!!expanded[sub.id]}
                size="md"
              />
              {expanded[sub.id] && sub.reports && (
                <div className="space-y-3 pl-2 border-l-2 border-primary/30 animate-accordion-down">
                  {sub.reports.map((gp) => (
                    <PersonCard
                      key={gp.id}
                      person={gp}
                      onOpenBio={() => setBio(gp)}
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!bio} onOpenChange={(o) => !o && setBio(null)}>
        <DialogContent className="max-w-lg">
          {bio && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                    <AvatarImage src={bio.photo} alt={bio.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {initials(bio.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <DialogTitle>{bio.name}</DialogTitle>
                    <DialogDescription>
                      {bio.position}{bio.area ? ` · ${bio.area}` : ""}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <p className="text-sm text-foreground/80 leading-relaxed mt-2">{bio.bio}</p>
              {bio.reports && bio.reports.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Personas a cargo
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bio.reports.map((r) => (
                      <Badge key={r.id} variant="secondary">{r.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setBio(null)} className="mt-4 self-start">
                <ArrowLeft className="h-4 w-4 mr-1" /> Cerrar
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Organigrama;
