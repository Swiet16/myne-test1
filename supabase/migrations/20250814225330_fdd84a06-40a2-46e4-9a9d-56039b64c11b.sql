-- Fix security warnings by setting search_path for functions

-- Update get_user_role function with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = user_uuid 
  ORDER BY created_at DESC 
  LIMIT 1;
$$;

-- Update is_admin function with proper search_path
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

-- Update update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;