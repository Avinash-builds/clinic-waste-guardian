
-- Allow authenticated users to insert clinics
CREATE POLICY "Authenticated users can insert clinics"
ON public.clinics
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to insert recycling logs
CREATE POLICY "Authenticated users can insert recycling logs"
ON public.recycling_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update recycling logs
CREATE POLICY "Authenticated users can update recycling logs"
ON public.recycling_logs
FOR UPDATE
TO authenticated
USING (true);

-- Allow admins to view all user roles (for user management page)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = user_id);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
