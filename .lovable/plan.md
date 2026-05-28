# Portal SOLPEDs & Presupuestos

Plan para construir un nuevo módulo dentro del portal corporativo, manteniendo el sistema visual existente (azules Komatsu Mitsui, glasmorfismo, sin amarillo).

## Alcance funcional (MVP)

### 1. Registro de SOLPEDs — grid tipo Excel
- Vista tabla densa con columnas: Proyecto, Código SOLPED, Fecha, Solicitante, Centro de costo, Descripción, Monto, Prioridad, Estado, Observaciones.
- Edición inline (click / Enter), navegación con teclado (Tab, Shift+Tab, flechas, Enter).
- Pegado masivo desde Excel (parse TSV en `onPaste`).
- Agregar filas rápidas, duplicar fila, eliminar selección.
- Filtros por columna + búsqueda global, ordenamiento, columnas fijas.
- Autoguardado por celda con indicador "Guardando / Guardado".
- Validaciones (monto numérico, fecha válida, campos obligatorios) con resaltado de celda.
- Estados con color: Pendiente (gris), En revisión (azul), Liberado (verde), Observado (ámbar suave no amarillo puro → naranja), Rechazado (rojo).

### 2. Liberación / Aprobación
- Bandeja del aprobador filtrada por proyecto y prioridad.
- Acciones: Aprobar, Rechazar, Observar — con comentario obligatorio en rechazo/observación.
- Historial de cambios por SOLPED (timeline: usuario, fecha, acción, comentario).
- Actualización en tiempo real (Supabase Realtime).

### 3. Presupuestos por proyecto
- CRUD de proyectos con presupuesto total.
- Cálculo automático: consumido = SUM(SOLPEDs liberadas), disponible = total − consumido.
- Barra de avance, alerta visual al superar 80% y 100%.
- Historial de movimientos (cada liberación impacta el saldo).
- Resumen financiero por proyecto.

### 4. Dashboard Ejecutivo
- KPIs: SOLPEDs pendientes, liberadas hoy, monto liberado mes, tiempo promedio de aprobación, % avance presupuestal global.
- Gráficos (Recharts): barras consumo por proyecto, línea tendencia mensual, donut por estado, top proyectos por gasto.
- Filtros por proyecto y rango de fechas.

### 5. Roles
- `solicitante`, `aprobador`, `administrador` en tabla `user_roles` separada + `has_role()` SECURITY DEFINER.
- Solicitante: crea/edita sus SOLPEDs mientras estén Pendiente/Observado.
- Aprobador: ve pendientes de proyectos asignados, aprueba/rechaza/observa.
- Administrador: gestiona proyectos, presupuestos, usuarios y ve todo.

## Arquitectura técnica

- **Frontend:** React + Vite + Tailwind + shadcn (ya en el proyecto). Grid construido con TanStack Table + virtualización (TanStack Virtual) para sentir Excel sin agregar AG Grid (licencia). Recharts para dashboards.
- **Backend:** Lovable Cloud (Supabase) — auth email/password + Google, Postgres, Realtime, RLS.
- **Estado servidor:** TanStack Query con mutaciones optimistas para autoguardado.

### Esquema de BD (resumen)

```text
projects(id, code, name, budget_total, created_at)
user_roles(id, user_id, role)              -- enum: solicitante|aprobador|administrador
project_members(project_id, user_id)       -- aprobadores asignados
solpeds(id, project_id, code, date, requester_id, cost_center,
        description, amount, priority, status, observations, created_at, updated_at)
solped_history(id, solped_id, user_id, action, comment, created_at)
budget_movements(id, project_id, solped_id, amount, type, created_at)
```

RLS:
- `solpeds` SELECT: solicitante propio, aprobador del proyecto, admin.
- `solpeds` INSERT/UPDATE: solicitante (solo propias, estados editables), aprobador (solo status+observations), admin (todo).
- `projects`/`budget_*`: lectura para miembros, escritura solo admin.
- Cada tabla con `GRANT` explícito a `authenticated` y `service_role`.

## Rutas nuevas

- `/solpeds` — grid de registro
- `/solpeds/aprobaciones` — bandeja del aprobador
- `/presupuestos` — proyectos y saldos
- `/solpeds/dashboard` — dashboard ejecutivo
- Entradas en el `DashboardSidebar` agrupadas bajo "SOLPEDs".

## Plan de entrega por fases

1. **Fase 1 — Cimientos:** activar Lovable Cloud, esquema + RLS + roles, auth, sidebar y rutas vacías.
2. **Fase 2 — Grid de SOLPEDs:** tabla editable, pegado Excel, autoguardado, filtros, validaciones.
3. **Fase 3 — Aprobaciones + historial + realtime.**
4. **Fase 4 — Presupuestos + alertas + movimientos.**
5. **Fase 5 — Dashboard ejecutivo.**
6. **Fase 6 — Admin de proyectos/usuarios y pulido UX (atajos, dark mode ya existente).**

## Preguntas antes de implementar

1. ¿Activo **Lovable Cloud** ahora para auth + BD + realtime? (recomendado)
2. ¿Empezamos por **Fase 1 + Fase 2** (cimientos + grid de SOLPEDs funcional) en esta iteración, y seguimos con aprobaciones/presupuestos/dashboard después?
3. ¿Los **códigos SOLPED** los ingresa el usuario o los genera el sistema (ej. `SP-2026-0001`)?
4. ¿Un solicitante pertenece a **un proyecto o varios**? ¿Y los aprobadores son por proyecto o globales?
