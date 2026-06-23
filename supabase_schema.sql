-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'divisi' CHECK (role IN ('admin', 'divisi')),
    division TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date DATE NOT NULL,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    constraints TEXT,
    documentation_link TEXT,
    pic_id UUID REFERENCES public.profiles(id) NOT NULL,
    division TEXT NOT NULL,
    result TEXT,
    follow_up TEXT,
    verification_status TEXT NOT NULL DEFAULT 'Belum Diverifikasi' CHECK (verification_status IN ('Terverifikasi', 'Perlu Revisi', 'Belum Diverifikasi')),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Activities Policies
CREATE POLICY "Admin can do everything on activities" ON public.activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Divisi can view activities of their own division" ON public.activities
    FOR SELECT USING (
        division = (SELECT division FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Divisi can insert activities for their own division" ON public.activities
    FOR INSERT WITH CHECK (
        division = (SELECT division FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Divisi can update own activities if not verified" ON public.activities
    FOR UPDATE USING (
        created_by = auth.uid() AND verification_status = 'Belum Diverifikasi'
    ) WITH CHECK (
        created_by = auth.uid() AND verification_status = 'Belum Diverifikasi'
    );

CREATE POLICY "Divisi can delete own activities if not verified" ON public.activities
    FOR DELETE USING (
        created_by = auth.uid() AND verification_status = 'Belum Diverifikasi'
    );
