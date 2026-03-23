import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Target, 
  AlertTriangle, 
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  Workflow,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideProps {
  isActive: boolean;
}

// Slide 1: Portada
const Slide1 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(213,80%,15%)] via-[hsl(213,70%,25%)] to-[hsl(213,60%,35%)]" />
    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[hsl(45,90%,55%)]/10 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
    
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 text-center">
      <div className="mb-8 px-6 py-2 rounded-full border border-[hsl(45,90%,55%)]/30 bg-[hsl(45,90%,55%)]/10">
        <span className="text-[hsl(45,90%,55%)] text-sm font-medium tracking-[0.3em] uppercase">Komatsu Mitsui</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
        IMPACTO Y MEJORA<br />
        <span className="text-[hsl(45,90%,55%)]">DEL PROCESO</span>
      </h1>
      <div className="w-24 h-1 bg-[hsl(45,90%,55%)] rounded-full mb-8" />
      <h2 className="text-xl md:text-2xl text-white/80 font-light mb-4">
        Seguimiento de Ingreso de SOLPED
      </h2>
      <p className="text-white/50 text-lg">Marzo 2026</p>
    </div>
  </div>
);

// Slide 2: Objetivo
const Slide2 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(213,80%,25%)] flex items-center justify-center">
          <Target className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-4xl font-black text-[hsl(213,80%,20%)] tracking-tight">OBJETIVO</h2>
      </div>
      
      <div className="flex-1 flex items-center">
        <div className="max-w-4xl">
          <div className="relative pl-8 border-l-4 border-[hsl(45,90%,50%)]">
            <p className="text-2xl md:text-3xl text-[hsl(213,40%,30%)] leading-relaxed font-light italic">
              "Fortalecer la gestión financiera de la BU a través de la implementación de un sistema de automatización, estableciendo topes de presupuesto mensual que aseguren 
              <span className="font-semibold text-[hsl(213,80%,25%)] not-italic"> eficiencia</span>, 
              <span className="font-semibold text-[hsl(213,80%,25%)] not-italic"> trazabilidad</span> y 
              <span className="font-semibold text-[hsl(213,80%,25%)] not-italic"> disciplina</span> en el costo."
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Slide 3: Situación Inicial
const Slide3 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(0,10%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(0,65%,50%)] flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-[hsl(213,80%,20%)] tracking-tight">SITUACIÓN INICIAL</h2>
          <p className="text-[hsl(0,65%,50%)] font-medium">Registro manual y descentralizado</p>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-4">
        {[
          { icon: "🔍", text: "Falta de visibilidad del estado de las SOLPED" },
          { icon: "⏱️", text: "Retrasos en el seguimiento" },
          { icon: "⚠️", text: "Riesgo de errores y duplicidad" },
          { icon: "📧", text: "Dependencia de comunicación por correos" },
          { icon: "🕐", text: "Falta de control en tiempos de ingreso" },
          { icon: "🔄", text: "Dificultad para identificar cuellos de botella" },
          { icon: "📋", text: "Baja trazabilidad del proceso" },
          { icon: "📊", text: "Información no actualizada en tiempo real" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-white border border-[hsl(0,20%,90%)] shadow-sm hover:shadow-md transition-shadow">
            <span className="text-2xl">{item.icon}</span>
            <p className="text-[hsl(213,40%,30%)] font-medium">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Slide 4: Flujo Antes
const Slide4 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(213,80%,25%)] flex items-center justify-center">
          <Workflow className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[hsl(213,80%,20%)] tracking-tight">FLUJO FORECAST COMPRAS</h2>
          <span className="text-sm font-bold text-[hsl(0,65%,50%)] bg-[hsl(0,65%,95%)] px-3 py-1 rounded-full">ANTES</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {[
            "Identificación de Necesidad",
            "V°B° Gerente",
            "Detalles + TDR",
            "Generación SOLPED",
            "SharePoint",
            "Validación SOLPED",
            "Liberación",
            "Cotización",
            "Orden de Compra",
            "Recepción",
            "Ingreso SAP (MIGO)"
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="px-4 py-3 rounded-xl bg-white border-2 border-[hsl(213,30%,85%)] shadow-sm text-center min-w-[140px]">
                <p className="text-xs font-bold text-[hsl(213,80%,25%)]">{step}</p>
              </div>
              {i < 10 && <ArrowRight className="w-4 h-4 text-[hsl(213,40%,60%)] flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 rounded-xl bg-[hsl(0,65%,50%)]/10 border border-[hsl(0,65%,50%)]/20">
        <p className="text-sm text-[hsl(0,65%,40%)] font-medium text-center">
          ⚠️ Proceso lineal sin control de presupuesto ni automatización — dependencia total de correos y SharePoint
        </p>
      </div>
    </div>
  </div>
);

// Slide 5: Subproceso Identificación
const Slide5 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(150,60%,40%)] flex items-center justify-center">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-black text-[hsl(213,80%,20%)] tracking-tight">SUBPROCESO — IDENTIFICACIÓN</h2>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col gap-4">
            {/* Flow */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 p-5 rounded-xl bg-[hsl(213,80%,25%)] text-white text-center">
                <p className="font-bold text-sm">SOLICITUD DE BIEN O SERVICIO</p>
                <p className="text-xs text-white/70 mt-1">INICIO</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[hsl(213,40%,60%)] flex-shrink-0" />
              <div className="flex-1 p-5 rounded-xl bg-[hsl(45,90%,50%)] text-[hsl(213,80%,15%)] text-center">
                <p className="font-bold text-sm">¿Es un bien?</p>
                <p className="text-xs mt-1">Decisión</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[hsl(213,40%,60%)] flex-shrink-0" />
              <div className="flex-1 p-5 rounded-xl bg-white border-2 border-[hsl(213,30%,85%)] text-center">
                <p className="font-bold text-sm text-[hsl(213,80%,25%)]">PAÑOL</p>
                <p className="text-xs text-[hsl(213,40%,50%)] mt-1">¿Se cuenta con stock?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-5 rounded-xl bg-[hsl(150,60%,95%)] border border-[hsl(150,60%,80%)]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(150,60%,40%)]" />
                  <p className="font-bold text-[hsl(150,60%,30%)]">SI — Stock disponible</p>
                </div>
                <p className="text-sm text-[hsl(150,40%,40%)]">Notificación al área → FIN</p>
              </div>
              <div className="p-5 rounded-xl bg-[hsl(0,60%,97%)] border border-[hsl(0,60%,85%)]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-[hsl(0,65%,50%)]" />
                  <p className="font-bold text-[hsl(0,65%,40%)]">NO — Sin stock</p>
                </div>
                <p className="text-sm text-[hsl(0,40%,40%)]">V°B° Gerente de Proyecto → Continúa proceso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Slide 6: Validación de SOLPEDs
const Slide6 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(270,60%,50%)] flex items-center justify-center">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-black text-[hsl(213,80%,20%)] tracking-tight">VALIDACIÓN DE SOLPEDS</h2>
      </div>
      
      <div className="flex-1 grid grid-cols-3 gap-6">
        {[
          { phase: "Fase 1", title: "Verificación", desc: "Montos relevantes > $5k, liberador encargado", time: "1-2 horas", color: "hsl(213,80%,25%)" },
          { phase: "Fase 2", title: "Alimentar SharePoint", desc: "Registro de SOLPEDs en sistema compartido", time: "1 hora - 1 día", color: "hsl(270,60%,50%)" },
          { phase: "Fase 3", title: "Distribución", desc: "Asignación a encargados por proyecto", time: "Variable", color: "hsl(150,60%,40%)" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col rounded-2xl overflow-hidden border border-[hsl(213,20%,90%)] bg-white shadow-sm">
            <div className="p-4 text-white text-center" style={{ backgroundColor: item.color }}>
              <p className="text-xs font-medium opacity-80">{item.phase}</p>
              <p className="text-lg font-bold">{item.title}</p>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <p className="text-sm text-[hsl(213,40%,40%)]">{item.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-[hsl(213,40%,60%)]">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[hsl(213,80%,97%)] border border-[hsl(213,80%,90%)]">
          <p className="text-xs font-bold text-[hsl(213,80%,25%)] mb-2">Sally Medina</p>
          <p className="text-xs text-[hsl(213,40%,50%)]">Bayóvar, Palas, Toromocho, Marcobre</p>
        </div>
        <div className="p-4 rounded-xl bg-[hsl(270,60%,97%)] border border-[hsl(270,60%,90%)]">
          <p className="text-xs font-bold text-[hsl(270,60%,40%)] mb-2">Josselhing Vilchez</p>
          <p className="text-xs text-[hsl(213,40%,50%)]">Cerro Verde, Cuajone, Quellaveco, Toquepala</p>
        </div>
        <div className="p-4 rounded-xl bg-[hsl(150,60%,97%)] border border-[hsl(150,60%,85%)]">
          <p className="text-xs font-bold text-[hsl(150,60%,35%)] mb-2">Astrid Lucano</p>
          <p className="text-xs text-[hsl(213,40%,50%)]">Bambas, Antamina, Armados, Camiones</p>
        </div>
      </div>
    </div>
  </div>
);

// Slide 7: Liberación de SOLPEDs
const Slide7 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(45,90%,45%)] flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-black text-[hsl(213,80%,20%)] tracking-tight">LIBERACIÓN DE SOLPEDS</h2>
      </div>
      
      <p className="text-sm font-medium text-[hsl(213,40%,50%)] mb-8">Responsable de la liberación según RIA</p>
      
      <div className="flex-1 grid grid-cols-3 gap-6">
        {[
          { name: "Gina Cavaglia", range: "x ≤ $10K", time: "15-30 min", color: "hsl(150,60%,40%)" },
          { name: "Martin Fukuda", range: "$10K < x ≤ $20K", time: "1 hora", color: "hsl(45,90%,45%)" },
          { name: "Juan Vistoso", range: "x > $20K", time: "2-4 días", color: "hsl(0,65%,50%)" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center p-8 rounded-2xl bg-white border-2 shadow-sm" style={{ borderColor: item.color }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: item.color }}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-bold text-[hsl(213,80%,20%)] text-center">{item.name}</p>
            <p className="text-2xl font-black mt-3" style={{ color: item.color }}>{item.range}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-[hsl(213,40%,50%)]">
              <Clock className="w-4 h-4" />
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-xl bg-[hsl(213,80%,97%)] border border-[hsl(213,80%,90%)] text-center">
        <p className="text-sm font-medium text-[hsl(213,80%,25%)]">→ Notificación a Costos tras liberación</p>
      </div>
    </div>
  </div>
);

// Slide 8: Orden de Compra
const Slide8 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(213,80%,25%)] flex items-center justify-center">
          <DollarSign className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-black text-[hsl(213,80%,20%)] tracking-tight">ORDEN DE COMPRA</h2>
      </div>
      
      <div className="flex-1 flex items-center">
        <div className="w-full grid grid-cols-2 gap-8">
          {/* Bienes */}
          <div className="rounded-2xl overflow-hidden border border-[hsl(213,30%,85%)]">
            <div className="p-4 bg-[hsl(213,80%,25%)] text-white">
              <p className="font-bold">📦 BIENES</p>
            </div>
            <div className="p-5 bg-white space-y-4">
              {["Emisión de OC (2 días)", "Liberación de OC (5 días)", "Notificación a Proveedor y Proyecto", "Programa cita en Almacén", "Alimentación a SAP"].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[hsl(213,80%,95%)] flex items-center justify-center text-xs font-bold text-[hsl(213,80%,25%)]">{i + 1}</div>
                  <p className="text-sm text-[hsl(213,40%,30%)]">{s}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Servicios */}
          <div className="rounded-2xl overflow-hidden border border-[hsl(150,40%,80%)]">
            <div className="p-4 bg-[hsl(150,60%,40%)] text-white">
              <p className="font-bold">🔧 SERVICIOS</p>
            </div>
            <div className="p-5 bg-white space-y-4">
              {["Coordinación con Proveedor", "Realización del Servicio", "Generación de HES (SGV)", "¿Es conforme?", "Culminación → FIN"].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[hsl(150,60%,95%)] flex items-center justify-center text-xs font-bold text-[hsl(150,60%,35%)]">{i + 1}</div>
                  <p className="text-sm text-[hsl(213,40%,30%)]">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Slide 9: Impacto y Mejoras
const Slide9 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(213,80%,15%)] via-[hsl(213,70%,22%)] to-[hsl(213,60%,30%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(45,90%,50%)] flex items-center justify-center">
          <TrendingUp className="w-7 h-7 text-[hsl(213,80%,15%)]" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">IMPACTO Y MEJORAS</h2>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-5">
        {[
          { icon: "💰", title: "Control del costo mensual", desc: "Cada área se ajusta al presupuesto asignado, evitando sobrecostos y compras no planificadas." },
          { icon: "📉", title: "Reducción de desviaciones", desc: "Mayor control del gasto. Disminución de diferencias entre presupuesto planificado y ejecutado." },
          { icon: "📊", title: "Información en tiempo real", desc: "Datos confiables y actualizados para la toma de decisiones oportuna." },
          { icon: "⚡", title: "Eficiencia operativa", desc: "Menos reprocesos, mayor control sobre el presupuesto y los recursos." },
          { icon: "🎯", title: "Toma de decisiones informada", desc: "Información consolidada y oportuna para la gerencia en gestión de recursos." },
          { icon: "📈", title: "KPI: Presupuestado vs Real", desc: "Definición clara de métricas de cumplimiento presupuestal por proyecto." },
        ].map((item, i) => (
          <div key={i} className="p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Slide 10: Flujo Ahora
const Slide10 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(150,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(150,60%,40%)] flex items-center justify-center">
          <Workflow className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[hsl(213,80%,20%)] tracking-tight">FLUJO FORECAST COMPRAS</h2>
          <span className="text-sm font-bold text-[hsl(150,60%,35%)] bg-[hsl(150,60%,95%)] px-3 py-1 rounded-full">AHORA ✓</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {[
            { label: "Identificación", highlight: false },
            { label: "V°B°", highlight: false },
            { label: "TDR + SOLPED SAP", highlight: true },
            { label: "Carga Presupuesto", highlight: true },
            { label: "Registro SOLPED", highlight: true },
            { label: "Revisión Status", highlight: true },
            { label: "Liberación", highlight: false },
            { label: "Cotización", highlight: false },
            { label: "Orden de Compra", highlight: false },
            { label: "FIN", highlight: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                "px-4 py-3 rounded-xl border-2 shadow-sm text-center min-w-[130px]",
                step.highlight 
                  ? "bg-[hsl(150,60%,40%)] border-[hsl(150,60%,35%)] text-white" 
                  : "bg-white border-[hsl(213,30%,85%)]"
              )}>
                <p className={cn("text-xs font-bold", !step.highlight && "text-[hsl(213,80%,25%)]")}>{step.label}</p>
              </div>
              {i < 9 && <ArrowRight className="w-4 h-4 text-[hsl(213,40%,60%)] flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 rounded-xl bg-[hsl(150,60%,95%)] border border-[hsl(150,60%,80%)]">
        <p className="text-sm text-[hsl(150,60%,30%)] font-medium text-center">
          ✅ Nuevo: Carga de presupuesto mensual + Registro automatizado + Revisión de status en tiempo real
        </p>
      </div>
    </div>
  </div>
);

// Slide 11: Subproceso Identificación (Ahora)
const Slide11 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(150,60%,40%)] flex items-center justify-center">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[hsl(213,80%,20%)]">IDENTIFICACIÓN</h2>
          <span className="text-sm font-bold text-[hsl(150,60%,35%)] bg-[hsl(150,60%,95%)] px-3 py-1 rounded-full">MEJORADO</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 p-5 rounded-xl bg-[hsl(213,80%,25%)] text-white text-center">
              <p className="font-bold">SOLICITUD DEL BIEN O SERVICIO</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[hsl(213,40%,60%)]" />
            <div className="flex-1 p-5 rounded-xl bg-[hsl(45,90%,50%)] text-[hsl(213,80%,15%)] text-center">
              <p className="font-bold">¿Es un bien o servicio?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[hsl(150,60%,95%)] border border-[hsl(150,60%,80%)]">
              <p className="font-bold text-[hsl(150,60%,30%)] mb-2">✅ Stock disponible</p>
              <p className="text-sm text-[hsl(150,40%,40%)]">Notificación → FIN</p>
            </div>
            <div className="p-5 rounded-xl bg-[hsl(213,80%,97%)] border border-[hsl(213,80%,90%)]">
              <p className="font-bold text-[hsl(213,80%,25%)] mb-2">📋 Sin stock</p>
              <p className="text-sm text-[hsl(213,40%,50%)]">V°B° → Notifica rechazo o continúa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Slide 12: Registro de SOLPEDs
const Slide12 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(270,60%,50%)] flex items-center justify-center">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-black text-[hsl(213,80%,20%)]">REGISTRO DE SOLPEDS</h2>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-6 w-full max-w-5xl">
          {[
            { step: 1, actor: "Usuario", action: "Ingresa presupuesto mensual por agrupación de partida", color: "hsl(213,80%,25%)" },
            { step: 2, actor: "Usuario", action: "Ingresa datos de SOLPED en la hoja", color: "hsl(270,60%,50%)" },
            { step: 3, actor: "Administración", action: "Valida el presupuesto", color: "hsl(45,90%,45%)" },
            { step: 4, actor: "Sistema", action: "Migra los datos con semáforo de control", color: "hsl(150,60%,40%)" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black mb-4" style={{ backgroundColor: item.color }}>
                {item.step}
              </div>
              <p className="font-bold text-sm text-[hsl(213,80%,20%)] text-center">{item.actor}</p>
              <p className="text-xs text-[hsl(213,40%,50%)] text-center mt-2 leading-relaxed">{item.action}</p>
              {i < 3 && <ArrowRight className="w-5 h-5 text-[hsl(213,40%,60%)] absolute right-0 top-1/2 -translate-y-1/2 hidden" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Slide 13: Liberación Mejorada
const Slide13 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(45,90%,45%)] flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[hsl(213,80%,20%)]">LIBERACIÓN DE SOLPEDS</h2>
          <span className="text-sm font-bold text-[hsl(150,60%,35%)] bg-[hsl(150,60%,95%)] px-3 py-1 rounded-full">MEJORADO</span>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-3 gap-6">
        {[
          { name: "Gina Cavaglia", range: "x ≤ $10K", time: "15-30 min", color: "hsl(150,60%,40%)", icon: "🟢" },
          { name: "Martin Fukuda", range: "$10K < x ≤ $20K", time: "1 hora", color: "hsl(45,90%,45%)", icon: "🟡" },
          { name: "Juan Vistoso", range: "x > $20K", time: "2-4 días", color: "hsl(0,65%,50%)", icon: "🔴" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center p-8 rounded-2xl bg-white border shadow-sm">
            <span className="text-4xl mb-3">{item.icon}</span>
            <p className="text-lg font-bold text-[hsl(213,80%,20%)]">{item.name}</p>
            <p className="text-xl font-black mt-2" style={{ color: item.color }}>{item.range}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-[hsl(213,40%,50%)]">
              <Clock className="w-4 h-4" /> {item.time}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center p-4 rounded-xl bg-[hsl(213,80%,97%)] border border-[hsl(213,80%,90%)]">
        <p className="text-sm text-[hsl(213,80%,25%)] font-medium">Notificación automática a Costos tras cada liberación</p>
      </div>
    </div>
  </div>
);

// Slide 14: Revisión de Status
const Slide14 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,98%)] to-[hsl(213,20%,95%)]" />
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(213,80%,25%)] flex items-center justify-center">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-black text-[hsl(213,80%,20%)]">REVISIÓN DE STATUS</h2>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="p-8 rounded-2xl bg-[hsl(213,80%,25%)] text-white">
            <div className="text-3xl mb-4">📊</div>
            <p className="text-xl font-bold mb-3">Administración</p>
            <p className="text-sm text-white/80 leading-relaxed">
              Actualiza el Excel y el Power BI con el estado actual de todas las SOLPEDs
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white border-2 border-[hsl(213,30%,85%)]">
            <div className="text-3xl mb-4">👤</div>
            <p className="text-xl font-bold text-[hsl(213,80%,20%)] mb-3">Usuario</p>
            <p className="text-sm text-[hsl(213,40%,40%)] leading-relaxed">
              Consulta el estado de su SOLPED en tiempo real a través del dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Slide 15: Dashboard
const Slide15 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(213,80%,12%)] to-[hsl(213,70%,20%)]" />
    <div className="relative z-10 flex flex-col h-full px-12 py-10">
      <h2 className="text-3xl font-black text-white mb-6">DASHBOARD DE SEGUIMIENTO</h2>
      
      <div className="flex-1 grid grid-cols-3 gap-4">
        {/* KPI principal */}
        <div className="col-span-1 p-5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
          <p className="text-xs text-white/60 mb-1">Total SOLPED</p>
          <p className="text-3xl font-black text-[hsl(45,90%,55%)]">$30,054</p>
        </div>
        <div className="col-span-1 p-5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
          <p className="text-xs text-white/60 mb-1">Estado</p>
          <p className="text-xl font-bold text-[hsl(150,60%,50%)]">ADJUDICADO</p>
          <p className="text-xs text-white/50 mt-1">Todas liberadas</p>
        </div>
        <div className="col-span-1 p-5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
          <p className="text-xs text-white/60 mb-1">Desviación</p>
          <p className="text-3xl font-black text-white">78%</p>
          <p className="text-xs text-white/50 mt-1">Cumplimiento</p>
        </div>
        
        {/* Tabla */}
        <div className="col-span-2 rounded-xl overflow-hidden border border-white/10">
          <div className="bg-white/10 px-4 py-2">
            <p className="text-xs font-bold text-white/80">Detalle de SOLPEDs</p>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { solped: "11359736", pos: "10", fecha: "03/03/2026", monto: "$750" },
              { solped: "13119865", pos: "10", fecha: "04/03/2026", monto: "$1,610" },
              { solped: "11359959", pos: "10", fecha: "09/03/2026", monto: "$2,371" },
              { solped: "11360429", pos: "10", fecha: "17/03/2026", monto: "$2,663" },
              { solped: "11357839", pos: "30", fecha: "18/02/2026", monto: "$3,407" },
            ].map((row, i) => (
              <div key={i} className="flex items-center px-4 py-2 text-xs text-white/70">
                <span className="flex-1">{row.solped}</span>
                <span className="w-12 text-center">{row.pos}</span>
                <span className="w-24 text-center">{row.fecha}</span>
                <span className="w-20 text-right font-medium text-[hsl(150,60%,50%)]">{row.monto}</span>
                <span className="w-24 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-[hsl(150,60%,40%)]/20 text-[hsl(150,60%,50%)] text-[10px]">Liberado</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top 5 */}
        <div className="col-span-1 rounded-xl bg-white/10 backdrop-blur border border-white/10 p-4">
          <p className="text-xs font-bold text-white/80 mb-3">TOP 5 — Agrupación</p>
          {[
            { name: "Suministros", val: 45 },
            { name: "Costos Diversos", val: 27 },
            { name: "Servicios Pre.", val: 12 },
            { name: "Hospedaje", val: 4 },
            { name: "Capacitaciones", val: 2 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(45,90%,55%)]" style={{ width: `${(item.val / 45) * 100}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-white/60 w-20 truncate">{item.name}</span>
              <span className="text-[10px] font-bold text-white/80 w-6 text-right">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Slide 16: Beneficios Clave
const Slide16 = ({ isActive }: SlideProps) => (
  <div className={cn("slide-content w-full h-full flex flex-col relative overflow-hidden", !isActive && "hidden")}>
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(213,80%,15%)] via-[hsl(213,70%,22%)] to-[hsl(213,60%,30%)]" />
    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[hsl(45,90%,55%)]/5 to-transparent" />
    
    <div className="relative z-10 flex flex-col h-full px-16 py-14">
      <h2 className="text-4xl font-black text-white mb-12 tracking-tight">BENEFICIOS CLAVE</h2>
      
      <div className="flex-1 grid grid-cols-2 gap-6">
        {[
          { icon: "📊", title: "Análisis de cumplimiento presupuestal", desc: "Real vs Planificado en tiempo real" },
          { icon: "⏱️", title: "Control de tiempos", desc: "Ingreso vs revisión de SOLPED" },
          { icon: "💰", title: "Control del gasto en tiempo real", desc: "Prevención de sobrecostos" },
          { icon: "🔍", title: "Visibilidad integral", desc: "Del proceso completo de compras" },
          { icon: "🛡️", title: "Soporte para auditoría", desc: "Trazabilidad completa del proceso" },
          { icon: "📈", title: "Mejora continua", desc: "KPIs definidos para seguimiento" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="font-bold text-white">{item.title}</p>
              <p className="text-sm text-white/60 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(45,90%,50%)] text-[hsl(213,80%,15%)] font-bold">
          <span>KOMATSU MITSUI — Mejora Continua</span>
        </div>
      </div>
    </div>
  </div>
);

const slides = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15, Slide16];

const slideTitles = [
  "Portada", "Objetivo", "Situación Inicial", "Flujo Antes", "Identificación",
  "Validación SOLPED", "Liberación SOLPED", "Orden de Compra", "Impacto y Mejoras",
  "Flujo Ahora", "Identificación (Mejorado)", "Registro SOLPEDs", "Liberación (Mejorado)",
  "Revisión de Status", "Dashboard", "Beneficios Clave"
];

const ControlCompras = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrev = () => setCurrentSlide(Math.max(0, currentSlide - 1));
  const goToNext = () => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Slide Viewer */}
      <div className="bg-[hsl(213,10%,10%)] rounded-2xl overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[hsl(213,10%,8%)] border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white/80">
              {currentSlide + 1} / {slides.length}
            </span>
            <span className="text-xs text-white/40">—</span>
            <span className="text-xs text-white/50">{slideTitles[currentSlide]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white/60 hover:text-white hover:bg-white/10">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Slide Area */}
        <div className="relative aspect-[16/9] bg-[hsl(213,10%,6%)]">
          {slides.map((SlideComponent, i) => (
            <div key={i} className={cn("absolute inset-0", i !== currentSlide && "hidden")}>
              <SlideComponent isActive={i === currentSlide} />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentSlide === slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 disabled:opacity-20 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {slideTitles.map((title, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all border",
              i === currentSlide
                ? "bg-[hsl(213,80%,25%)] text-white border-[hsl(213,80%,35%)]"
                : "bg-card text-muted-foreground border-border hover:bg-accent"
            )}
          >
            <span className="font-bold mr-1">{i + 1}.</span> {title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlCompras;
