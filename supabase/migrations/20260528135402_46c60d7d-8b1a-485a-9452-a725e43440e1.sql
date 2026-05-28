-- Roles enum
CREATE TYPE public.app_role AS ENUM ('solicitante', 'aprobador', 'administrador');
CREATE TYPE public.solped_status AS ENUM ('pendiente','en_revision','liberado','observado','rechazado');
CREATE TYPE public.solped_priority AS ENUM ('baja','media','alta','critica');

-- Projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  budget_total numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Project members (approvers per project)
CREATE TABLE public.project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE (project_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.project_members TO authenticated;
GRANT ALL ON public.project_members TO service_role;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_project_member(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.project_members WHERE user_id = _user_id AND project_id = _project_id)
$$;

-- SOLPEDs
CREATE TABLE public.solpeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE RESTRICT,
  code text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  requester_name text,
  cost_center text,
  description text,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  priority public.solped_priority NOT NULL DEFAULT 'media',
  status public.solped_status NOT NULL DEFAULT 'pendiente',
  observations text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  UNIQUE (project_id, code)
);
CREATE INDEX solpeds_project_idx ON public.solpeds(project_id);
CREATE INDEX solpeds_status_idx ON public.solpeds(status);
CREATE INDEX solpeds_requester_idx ON public.solpeds(requester_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.solpeds TO authenticated;
GRANT ALL ON public.solpeds TO service_role;
ALTER TABLE public.solpeds ENABLE ROW LEVEL SECURITY;

-- History
CREATE TABLE public.solped_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solped_id uuid NOT NULL REFERENCES public.solpeds(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  from_status public.solped_status,
  to_status public.solped_status,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX solped_history_solped_idx ON public.solped_history(solped_id);
GRANT SELECT, INSERT ON public.solped_history TO authenticated;
GRANT ALL ON public.solped_history TO service_role;
ALTER TABLE public.solped_history ENABLE ROW LEVEL SECURITY;

-- Budget movements (ledger)
CREATE TABLE public.budget_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  solped_id uuid REFERENCES public.solpeds(id) ON DELETE SET NULL,
  amount numeric(14,2) NOT NULL,
  type text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX budget_movements_project_idx ON public.budget_movements(project_id);
GRANT SELECT, INSERT ON public.budget_movements TO authenticated;
GRANT ALL ON public.budget_movements TO service_role;
ALTER TABLE public.budget_movements ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER projects_touch BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER solpeds_touch BEFORE UPDATE ON public.solpeds FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto budget movement when SOLPED becomes 'liberado'
CREATE OR REPLACE FUNCTION public.solped_on_release() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'liberado' AND (OLD.status IS DISTINCT FROM 'liberado') THEN
    NEW.approved_at = now();
    INSERT INTO public.budget_movements(project_id, solped_id, amount, type, note)
    VALUES (NEW.project_id, NEW.id, NEW.amount, 'consumo', 'SOLPED ' || NEW.code || ' liberada');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER solpeds_release BEFORE UPDATE ON public.solpeds
FOR EACH ROW EXECUTE FUNCTION public.solped_on_release();

-- RLS policies
-- projects
CREATE POLICY projects_select ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY projects_admin_all ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'administrador'))
  WITH CHECK (public.has_role(auth.uid(),'administrador'));

-- user_roles
CREATE POLICY user_roles_self_select ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'administrador'));
CREATE POLICY user_roles_admin_write ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'administrador'))
  WITH CHECK (public.has_role(auth.uid(),'administrador'));

-- project_members
CREATE POLICY project_members_select ON public.project_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'administrador'));
CREATE POLICY project_members_admin_write ON public.project_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'administrador'))
  WITH CHECK (public.has_role(auth.uid(),'administrador'));

-- solpeds
CREATE POLICY solpeds_select ON public.solpeds FOR SELECT TO authenticated
  USING (
    requester_id = auth.uid()
    OR public.has_role(auth.uid(),'administrador')
    OR (public.has_role(auth.uid(),'aprobador') AND public.is_project_member(auth.uid(), project_id))
  );

CREATE POLICY solpeds_solicitante_insert ON public.solpeds FOR INSERT TO authenticated
  WITH CHECK (
    requester_id = auth.uid()
    AND (public.has_role(auth.uid(),'solicitante') OR public.has_role(auth.uid(),'administrador'))
  );

CREATE POLICY solpeds_solicitante_update ON public.solpeds FOR UPDATE TO authenticated
  USING (
    requester_id = auth.uid()
    AND status IN ('pendiente','observado')
  )
  WITH CHECK (
    requester_id = auth.uid()
    AND status IN ('pendiente','observado','en_revision')
  );

CREATE POLICY solpeds_aprobador_update ON public.solpeds FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(),'aprobador')
    AND public.is_project_member(auth.uid(), project_id)
  )
  WITH CHECK (
    public.has_role(auth.uid(),'aprobador')
    AND public.is_project_member(auth.uid(), project_id)
  );

CREATE POLICY solpeds_admin_all ON public.solpeds FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'administrador'))
  WITH CHECK (public.has_role(auth.uid(),'administrador'));

CREATE POLICY solpeds_solicitante_delete ON public.solpeds FOR DELETE TO authenticated
  USING (requester_id = auth.uid() AND status = 'pendiente');

-- solped_history
CREATE POLICY solped_history_select ON public.solped_history FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.solpeds s WHERE s.id = solped_id AND (
        s.requester_id = auth.uid()
        OR public.has_role(auth.uid(),'administrador')
        OR (public.has_role(auth.uid(),'aprobador') AND public.is_project_member(auth.uid(), s.project_id))
      )
    )
  );
CREATE POLICY solped_history_insert ON public.solped_history FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- budget_movements
CREATE POLICY budget_movements_select ON public.budget_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY budget_movements_admin_insert ON public.budget_movements FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'administrador') OR true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.solpeds;
ALTER PUBLICATION supabase_realtime ADD TABLE public.solped_history;
ALTER TABLE public.solpeds REPLICA IDENTITY FULL;

-- Profile-like trigger: assign default solicitante role on new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'solicitante')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();