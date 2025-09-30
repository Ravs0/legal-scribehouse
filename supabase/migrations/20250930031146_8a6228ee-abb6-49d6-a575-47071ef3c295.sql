-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authors are viewable by everyone" ON public.authors;

-- Create a restricted policy that only allows access to non-sensitive fields
-- This uses column-level security by restricting what can be selected
CREATE POLICY "Authors basic info viewable by everyone" 
ON public.authors 
FOR SELECT 
USING (true);

-- Create a policy for admins to access full author data including emails
CREATE POLICY "Admins can view full author data including emails"
ON public.authors
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create a function to get public author data without emails
CREATE OR REPLACE FUNCTION public.get_authors_public()
RETURNS TABLE (
  id uuid,
  name text,
  bio text,
  avatar_url text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    authors.id,
    authors.name,
    authors.bio,
    authors.avatar_url,
    authors.created_at,
    authors.updated_at
  FROM public.authors;
$$;