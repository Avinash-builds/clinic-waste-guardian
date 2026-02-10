
-- Create pickup_schedules table for managing waste pickup requests
CREATE TABLE public.pickup_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES auth.users(id),
  waste_details JSONB DEFAULT '[]'::jsonb,
  total_weight_kg NUMERIC NOT NULL DEFAULT 0,
  requested_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  verified_by UUID REFERENCES auth.users(id),
  vehicle_number TEXT,
  driver_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pickup_schedules ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view pickup schedules"
  ON public.pickup_schedules FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert pickup schedules"
  ON public.pickup_schedules FOR INSERT WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "Admins can manage all pickup schedules"
  ON public.pickup_schedules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own pickup requests"
  ON public.pickup_schedules FOR UPDATE USING (auth.uid() = requested_by OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_pickup_schedules_updated_at
  BEFORE UPDATE ON public.pickup_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
