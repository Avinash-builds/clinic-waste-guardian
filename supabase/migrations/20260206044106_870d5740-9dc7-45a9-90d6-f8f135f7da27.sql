
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'clinic_staff');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clinics table
CREATE TABLE public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    license_number TEXT,
    compliance_status TEXT DEFAULT 'pending',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create waste_categories table
CREATE TABLE public.waste_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color_code TEXT NOT NULL,
    description TEXT,
    disposal_method TEXT,
    is_recyclable BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create waste_records table
CREATE TABLE public.waste_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.waste_categories(id) NOT NULL,
    weight_kg DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    disposal_method TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    recorded_by UUID REFERENCES auth.users(id),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disposal_logs table
CREATE TABLE public.disposal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waste_record_id UUID REFERENCES public.waste_records(id) ON DELETE CASCADE NOT NULL,
    disposed_by UUID REFERENCES auth.users(id),
    disposal_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    vendor_name TEXT,
    vehicle_number TEXT,
    manifest_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recycling_logs table
CREATE TABLE public.recycling_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waste_record_id UUID REFERENCES public.waste_records(id) ON DELETE CASCADE,
    batch_number TEXT NOT NULL,
    category_id UUID REFERENCES public.waste_categories(id),
    input_weight_kg DECIMAL(10,2),
    output_weight_kg DECIMAL(10,2),
    recycling_rate DECIMAL(5,2),
    processing_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'processing',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disposal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clinics_updated_at
    BEFORE UPDATE ON public.clinics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    
    -- Assign default role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'clinic_staff');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for clinics
CREATE POLICY "Authenticated users can view clinics"
    ON public.clinics FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage clinics"
    ON public.clinics FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for waste_categories
CREATE POLICY "Anyone can view waste categories"
    ON public.waste_categories FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage waste categories"
    ON public.waste_categories FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for waste_records
CREATE POLICY "Authenticated users can view waste records"
    ON public.waste_records FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert waste records"
    ON public.waste_records FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = recorded_by);

CREATE POLICY "Users can update their own waste records"
    ON public.waste_records FOR UPDATE
    TO authenticated
    USING (auth.uid() = recorded_by OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for disposal_logs
CREATE POLICY "Authenticated users can view disposal logs"
    ON public.disposal_logs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert disposal logs"
    ON public.disposal_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = disposed_by);

-- RLS Policies for recycling_logs
CREATE POLICY "Authenticated users can view recycling logs"
    ON public.recycling_logs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage recycling logs"
    ON public.recycling_logs FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Insert default waste categories
INSERT INTO public.waste_categories (name, color_code, description, disposal_method, is_recyclable) VALUES
    ('Yellow', '#F59E0B', 'Human anatomical waste, soiled waste, expired medicines', 'Incineration', false),
    ('Red', '#EF4444', 'Contaminated recyclable waste - tubing, bottles, catheters', 'Autoclaving/Microwaving', true),
    ('Blue', '#3B82F6', 'Glassware, metallic body implants', 'Autoclaving/Chemical treatment', true),
    ('White', '#F3F4F6', 'Sharp objects - needles, syringes, blades', 'Autoclaving and shredding', false),
    ('Sharps', '#6B7280', 'Needles, syringes, scalpels', 'Puncture-proof containers', false);
