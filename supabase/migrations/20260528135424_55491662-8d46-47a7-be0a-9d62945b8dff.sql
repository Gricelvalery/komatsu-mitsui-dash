CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE OR REPLACE FUNCTION public.solped_on_release() RETURNS trigger LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN
  IF NEW.status = 'liberado' AND (OLD.status IS DISTINCT FROM 'liberado') THEN
    NEW.approved_at = now();
    INSERT INTO public.budget_movements(project_id, solped_id, amount, type, note)
    VALUES (NEW.project_id, NEW.id, NEW.amount, 'consumo', 'SOLPED ' || NEW.code || ' liberada');
  END IF;
  RETURN NEW;
END $$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_project_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.solped_on_release() FROM PUBLIC, anon, authenticated;