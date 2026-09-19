-- ======================================================================================
-- AKSHAR ENGINEERING SERVICES (AES) - SUPABASE BACKEND SCHEMA
-- ======================================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/sql
-- 2. Paste this entire script into the SQL Editor and click "Run".
-- ======================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================================================================================
-- 1. TABLE: inspection_requests
-- ======================================================================================
CREATE TABLE IF NOT EXISTS public.inspection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    client_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT,
    location_and_scope TEXT,
    preferred_date TEXT,
    attachment_url TEXT,
    source_page TEXT DEFAULT 'website',
    status TEXT DEFAULT 'New / Pending Review'
);

-- ======================================================================================
-- 2. TABLE: support_tickets
-- ======================================================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ticket_id TEXT DEFAULT ('AES-TKT-' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8))),
    category TEXT NOT NULL,
    full_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    dynamic_details JSONB DEFAULT '{}'::JSONB,
    attachment_url TEXT,
    status TEXT DEFAULT 'Open / In Progress'
);

-- ======================================================================================
-- 3. TABLE: career_applications
-- ======================================================================================
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    current_location TEXT NOT NULL,
    position_applied TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    highest_qualification TEXT NOT NULL,
    certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
    notice_period TEXT NOT NULL,
    technical_summary TEXT,
    resume_url TEXT,
    status TEXT DEFAULT 'Under Review'
);

-- ======================================================================================
-- 4. TABLE: document_verifications
-- ======================================================================================
CREATE TABLE IF NOT EXISTS public.document_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    requester_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    report_no TEXT NOT NULL,
    attachment_url TEXT,
    verification_status TEXT DEFAULT 'Pending Authentication'
);

-- ======================================================================================
-- 5. TABLE: certificates_records (Master repository for live authentication)
-- ======================================================================================
CREATE TABLE IF NOT EXISTS public.certificates_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    certificate_no TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    equipment_desc TEXT,
    inspection_date DATE,
    lead_inspector TEXT,
    inspection_standard TEXT,
    auth_status TEXT DEFAULT 'Valid & Code Compliant',
    certificate_pdf_url TEXT
);

-- Sample certificates
INSERT INTO public.certificates_records (certificate_no, client_name, project_name, equipment_desc, inspection_date, lead_inspector, inspection_standard, auth_status)
VALUES 
('AES/IRN/2026/8941', 'Larsen & Toubro Ltd', 'Cryogenic Storage Tank Project', 'Spherical Pressure Vessel 120KL', '2026-08-15', 'K. Sharma (Level III)', 'ASME Sec VIII Div 1 & API 620', 'Valid & Code Compliant'),
('AES/QC/2026/5021', 'ISGEC Heavy Engineering', 'High Pressure Boiler Piping', 'P91 Superheater Steam Header', '2026-07-22', 'R. Verma (CWI / CSWIP 3.2)', 'IBR & ASME B31.1', 'Valid & Code Compliant')
ON CONFLICT (certificate_no) DO NOTHING;


-- ======================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - PERMISSIVE PUBLIC POLICIES
-- ======================================================================================
ALTER TABLE public.inspection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates_records ENABLE ROW LEVEL SECURITY;

-- 1. inspection_requests
DROP POLICY IF EXISTS "Public can insert inspection requests" ON public.inspection_requests;
DROP POLICY IF EXISTS "Public can select inspection requests" ON public.inspection_requests;
CREATE POLICY "Public can insert inspection requests" ON public.inspection_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can select inspection requests" ON public.inspection_requests FOR SELECT TO public USING (true);

-- 2. support_tickets
DROP POLICY IF EXISTS "Public can insert support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Public can select support tickets" ON public.support_tickets;
CREATE POLICY "Public can insert support tickets" ON public.support_tickets FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can select support tickets" ON public.support_tickets FOR SELECT TO public USING (true);

-- 3. career_applications
DROP POLICY IF EXISTS "Public can insert career applications" ON public.career_applications;
DROP POLICY IF EXISTS "Public can select career applications" ON public.career_applications;
CREATE POLICY "Public can insert career applications" ON public.career_applications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can select career applications" ON public.career_applications FOR SELECT TO public USING (true);

-- 4. document_verifications
DROP POLICY IF EXISTS "Public can insert document verifications" ON public.document_verifications;
DROP POLICY IF EXISTS "Public can select document verifications" ON public.document_verifications;
CREATE POLICY "Public can insert document verifications" ON public.document_verifications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can select document verifications" ON public.document_verifications FOR SELECT TO public USING (true);

-- 5. certificates_records
DROP POLICY IF EXISTS "Public can lookup certificates by certificate_no" ON public.certificates_records;
DROP POLICY IF EXISTS "Public can select certificates_records" ON public.certificates_records;
CREATE POLICY "Public can select certificates_records" ON public.certificates_records FOR SELECT TO public USING (true);


-- ======================================================================================
-- STORAGE BUCKETS CONFIGURATION
-- ======================================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('aes-resumes', 'aes-resumes', true), ('aes-attachments', 'aes-attachments', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public can view resumes" ON storage.objects;
CREATE POLICY "Public can upload resumes" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'aes-resumes');
CREATE POLICY "Public can view resumes" ON storage.objects FOR SELECT TO public USING (bucket_id = 'aes-resumes');

DROP POLICY IF EXISTS "Public can upload attachments" ON storage.objects;
DROP POLICY IF EXISTS "Public can view attachments" ON storage.objects;
CREATE POLICY "Public can upload attachments" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'aes-attachments');
CREATE POLICY "Public can view attachments" ON storage.objects FOR SELECT TO public USING (bucket_id = 'aes-attachments');
