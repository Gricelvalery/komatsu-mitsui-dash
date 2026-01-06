import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Upload,
  FolderOpen,
  FileBarChart,
  History,
  UserPlus,
  Shield,
  Menu,
  X,
  TrendingUp,
  Database,
  Download,
  Briefcase,
  ClipboardList,
  Workflow,
  CalendarClock,
  Building2,
  Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import komatsLogo from "@/assets/komatsu-logo.png";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: "Inicio",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "KPI",
    icon: TrendingUp,
    children: [
      {
        title: "KPIs Antapaccay",
        icon: BarChart3,
        href: "/kpi/antapaccay",
      },
    ],
  },
  {
    title: "PLM",
    icon: Database,
    children: [
      {
        title: "Descargar Data",
        icon: Download,
        href: "/plm",
      },
      {
        title: "Subir Archivo",
        icon: Upload,
        href: "/plm",
      },
      {
        title: "Info Data",
        icon: Database,
        href: "/plm",
      },
      {
        title: "Reporte PLM",
        icon: FileBarChart,
        href: "/plm",
      },
    ],
  },
  {
    title: "Aceites",
    icon: FileText,
    children: [
      {
        title: "Subir Archivo",
        icon: Upload,
        href: "/aceites",
      },
      {
        title: "Confiabilidad Central",
        icon: FolderOpen,
        href: "/aceites/analisis",
      },
      {
        title: "Quellaveco",
        icon: Database,
        href: "/aceites/quellaveco",
      },
    ],
  },
  {
    title: "Gestión de Archivos",
    icon: FileText,
    children: [
      {
        title: "Subir archivos",
        icon: Upload,
        href: "/archivos/subir",
      },
      {
        title: "Ver archivos",
        icon: FolderOpen,
        href: "/archivos/lista",
      },
    ],
  },
  {
    title: "Reportes",
    icon: BarChart3,
    children: [
      {
        title: "Generar reporte",
        icon: FileBarChart,
        href: "/reportes/generar",
      },
      {
        title: "Historial",
        icon: History,
        href: "/reportes/historial",
      },
    ],
  },
  {
    title: "Gerencia",
    icon: Briefcase,
    children: [
      {
        title: "Reporte",
        icon: ClipboardList,
        href: "/gerencia/reporte",
      },
    ],
  },
  {
    title: "Procesos",
    icon: Workflow,
    children: [
      {
        title: "Planeamiento",
        icon: CalendarClock,
        href: "/procesos?area=planeamiento",
      },
      {
        title: "Administración",
        icon: Building2,
        href: "/procesos?area=administracion",
      },
      {
        title: "Confiabilidad",
        icon: Cog,
        href: "/procesos?area=confiabilidad",
      },
    ],
  },
  {
    title: "Usuarios",
    icon: Users,
    children: [
      {
        title: "Lista de usuarios",
        icon: Users,
        href: "/usuarios/lista",
      },
      {
        title: "Agregar usuario",
        icon: UserPlus,
        href: "/usuarios/agregar",
      },
      {
        title: "Roles y permisos",
        icon: Shield,
        href: "/usuarios/roles",
      },
    ],
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/configuracion",
  },
];

const NavGroup = ({ item, collapsed }: { item: NavItem; collapsed: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.href) {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth",
            "hover:bg-sidebar-accent",
            isActive && "bg-sidebar-accent text-sidebar-primary",
            collapsed && "justify-center px-2"
          )
        }
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth w-full",
          "hover:bg-sidebar-accent",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="text-sm font-medium flex-1 text-left">{item.title}</span>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </>
        )}
      </button>

      {isOpen && !collapsed && item.children && (
        <div className="ml-4 mt-1 space-y-1 animate-accordion-down">
          {item.children.map((child, index) => (
            <NavLink
              key={index}
              to={child.href || "#"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth text-sm",
                  "hover:bg-sidebar-accent",
                  isActive && "bg-sidebar-accent text-sidebar-primary"
                )
              }
            >
              <child.icon className="w-4 h-4" />
              <span>{child.title}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export const DashboardSidebar = ({ collapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen flex flex-col transition-smooth fixed left-0 top-0 z-40",
        collapsed ? "w-16" : "w-64",
        "shadow-elevated"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src={komatsLogo} alt="Komatsu Mitsui" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-sm font-bold text-sidebar-primary">Komatsu</h1>
              <p className="text-xs text-sidebar-foreground/70">Mitsui</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("hover:bg-sidebar-accent", collapsed && "mx-auto")}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item, index) => (
          <NavGroup key={index} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className={cn("p-4 border-t border-sidebar-border", collapsed && "text-center")}>
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/60">
            © 2025 Komatsu Mitsui
          </p>
        )}
      </div>
    </aside>
  );
};
