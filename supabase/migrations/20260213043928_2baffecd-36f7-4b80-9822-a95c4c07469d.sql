
-- Allow authenticated users to insert notifications (for system-generated notifications)
CREATE POLICY "Authenticated users can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
