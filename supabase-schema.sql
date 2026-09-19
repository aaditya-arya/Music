-- ======================================================================================
-- AKSHAR ENGINEERING SERVICES (AES) - COMPLETE SUPABASE DATABASE SCHEMA
-- ======================================================================================
-- Run this complete script in your Supabase Dashboard -> SQL Editor
-- This will create all necessary tables, storage buckets, RLS policies, and seed data.

-- 1. INSPECTION REQUESTS TABLE (From the 16 Service Pages)
CREATE TABLE IF NOT EXISTS public.inspection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    client_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    location_and_scope TEXT,
    preferred_date DATE,
    attachment_url TEXT,
    status TEXT DEFAULT 'New', -- 'New', 'Under Review', 'Contacted', 'Completed'
    source_page TEXT
);

-- 2. JOB OPENINGS TABLE (Careers CMS)
CREATE TABLE IF NOT EXISTS public.job_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    experience_range TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb, -- Array of bullet strings
    status TEXT DEFAULT 'active', -- 'active', 'closed'
    display_order INT DEFAULT 0
);

-- 3. JOB APPLICATIONS TABLE (Candidate Resumes from Careers Page)
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    job_id UUID REFERENCES public.job_openings(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    current_location TEXT,
    position_applied TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    certifications JSONB DEFAULT '[]'::jsonb, -- Array of certification strings
    notice_period TEXT NOT NULL,
    resume_url TEXT,
    cover_notes TEXT,
    status TEXT DEFAULT 'Received' -- 'Received', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'
);

-- 4. VERIFIED DOCUMENTS & CERTIFICATES TABLE (Document Authentication Engine)
CREATE TABLE IF NOT EXISTS public.verified_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    report_no TEXT UNIQUE NOT NULL, -- e.g. 'AES-IRN-2026-8849'
    client_name TEXT NOT NULL,
    project_name TEXT,
    equipment_type TEXT NOT NULL,
    inspection_agency TEXT DEFAULT 'Akshar Engineering Services Pvt. Ltd.',
    inspection_date DATE,
    validity_status TEXT DEFAULT 'Valid / Authenticated', -- 'Valid / Authenticated', 'Under Review', 'Revoked'
    document_url TEXT, -- PDF file in Supabase Storage
    remarks TEXT
);

-- 5. GENERAL INQUIRIES & TRAINING REQUESTS (From we-hear-you.html and Modals)
CREATE TABLE IF NOT EXISTS public.general_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_name TEXT,
    inquiry_type TEXT DEFAULT 'General Inquiry', -- 'General Inquiry', 'Training Registration', 'Client Feedback'
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New', -- 'New', 'Responded', 'Closed'
    source_page TEXT
);

-- ======================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ======================================================================================

-- Enable RLS on all tables
ALTER TABLE public.inspection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (public anon) can insert new inspection requests
CREATE POLICY "Public can insert inspection requests" ON public.inspection_requests
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Policy: Anyone can insert job applications
CREATE POLICY "Public can insert job applications" ON public.job_applications
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Policy: Anyone can insert general inquiries
CREATE POLICY "Public can insert general inquiries" ON public.general_inquiries
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Policy: Anyone can read active job openings
CREATE POLICY "Public can read active jobs" ON public.job_openings
    FOR SELECT TO anon, authenticated USING (true);

-- Policy: Anyone can query verified documents by report number
CREATE POLICY "Public can query verified documents" ON public.verified_documents
    FOR SELECT TO anon, authenticated USING (true);

-- Policy: Authenticated Admins have FULL ACCESS (Select, Insert, Update, Delete) on all tables
CREATE POLICY "Admin full access on inspection_requests" ON public.inspection_requests
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on job_openings" ON public.job_openings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on job_applications" ON public.job_applications
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on verified_documents" ON public.verified_documents
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on general_inquiries" ON public.general_inquiries
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also allow Anon to read/write in development if testing without full login:
CREATE POLICY "Anon read for admin development" ON public.inspection_requests
    FOR SELECT TO anon USING (true);

CREATE POLICY "Anon update for admin development" ON public.inspection_requests
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon delete for admin development" ON public.inspection_requests
    FOR DELETE TO anon USING (true);

CREATE POLICY "Anon write job openings" ON public.job_openings
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon manage job applications" ON public.job_applications
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon manage verified documents" ON public.verified_documents
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Anon manage general inquiries" ON public.general_inquiries
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- ======================================================================================
-- STORAGE BUCKETS SETUP (Public Read for Resumes and Documents)
-- ======================================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('aes-attachments', 'aes-attachments', true),
    ('aes-resumes', 'aes-resumes', true),
    ('aes-documents', 'aes-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies: Public Upload and Public Read
CREATE POLICY "Public Upload to aes-attachments" ON storage.objects
    FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'aes-attachments');

CREATE POLICY "Public Read from aes-attachments" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'aes-attachments');

CREATE POLICY "Public Upload to aes-resumes" ON storage.objects
    FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'aes-resumes');

CREATE POLICY "Public Read from aes-resumes" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'aes-resumes');

CREATE POLICY "Public Upload to aes-documents" ON storage.objects
    FOR ALL TO anon, authenticated USING (bucket_id = 'aes-documents') WITH CHECK (bucket_id = 'aes-documents');

CREATE POLICY "Public Read from aes-documents" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'aes-documents');

-- ======================================================================================
-- INITIAL SEED DATA FOR JOB OPENINGS (Populates the Careers page dynamically)
-- ======================================================================================
INSERT INTO public.job_openings (title, department, experience_range, location, description, requirements, status, display_order)
VALUES 
(
    'QA/QC & TPI Inspection Engineer',
    'Field Surveillance',
    '3 - 8 Years',
    'Vadodara / Hazira / Pan-India',
    'Lead third-party shop surveillance and site inspections for pressure vessels, columns, and heat exchangers.',
    '["Surveillance across raw material testing, fit-up, welding, NDT, and hydrotest stages.", "Reviewing and stamping manufacturer records (MDR) against approved ITP/QAP.", "Degree or Diploma in Mechanical with Level II UT/RT/MPI/DPT."]'::jsonb,
    'active',
    1
),
(
    'Certified Welding Inspector (CWI / CSWIP)',
    'Welding Engineering',
    '4 - 10 Years',
    'Heavy Fabrication Hubs (Gujarat/Maharashtra)',
    'Oversee critical welding qualification, procedure specification, and fabrication surveillance.',
    '["WPS, PQR, and WPQ qualification witnessing per ASME Sec IX, AWS D1.1, and EN ISO 15614.", "Inspection of structural welding, heavy offshore structures, and pressure piping.", "Active CSWIP 3.1 / 3.2 or AWS CWI credential is mandatory."]'::jsonb,
    'active',
    2
),
(
    'Advanced NDT Specialist (Level II / III)',
    'Non-Destructive Examination',
    '3 - 7 Years',
    'Site Deputations Pan-India',
    'Perform and cross-verify conventional and advanced non-destructive examinations.',
    '["Interpretation of radiographic films (RTFI), ultrasonic flaw detection (UT), and MPI/DPT.", "Preparation of NDT procedures and calibration blocks per ASME Sec V.", "Valid ASNT Level II or Level III in UT, RT, MPT, and LPT."]'::jsonb,
    'active',
    3
),
(
    'API Inspector (API 510 / 570 / 653)',
    'In-Service Asset Integrity',
    '5 - 12 Years',
    'Refinery & Petrochemical Sites',
    'Execute comprehensive statutory in-service and shutdown fitness-for-service integrity assessments.',
    '["Shutdown inspection of stationary equipment, storage tanks (API 653), and furnaces.", "Process piping (API 570) and pressure vessel (API 510) remaining life assessment.", "Valid API individual certification required."]'::jsonb,
    'active',
    4
),
(
    'Expediting & Vendor Auditor',
    'Supply Chain QA',
    '3 - 8 Years',
    'Vendor Hubs Pan-India',
    'Verify supplier capabilities and audit fabrication progress against delivery schedules.',
    '["Conducting vendor pre-qualification audits and ISO 9001 compliance reviews.", "Critical path fabrication schedule tracking and desk/field expediting.", "Engineering degree with Lead Auditor certification preferred."]'::jsonb,
    'active',
    5
),
(
    'Graduate Trainee QA/QC Engineer',
    'Early Career Program',
    '0 - 2 Years',
    'Vadodara / Gujarat',
    'Comprehensive entry-level training program under certified Level III technical surveyors.',
    '["Structured mentorship program under certified Level III technical surveyors.", "Comprehensive training in ASME/AWS codes, NDT methods, and ITP drafting.", "Fresh graduates in B.E./B.Tech (Mechanical/Metallurgy/Production)."]'::jsonb,
    'active',
    6
)
ON CONFLICT DO NOTHING;

-- ======================================================================================
-- INITIAL SEED DATA FOR VERIFIED DOCUMENTS (For instant Document Authentication testing)
-- ======================================================================================
INSERT INTO public.verified_documents (report_no, client_name, project_name, equipment_type, inspection_agency, inspection_date, validity_status, remarks)
VALUES 
(
    'AES-IRN-2026-8849',
    'Larsen & Toubro Ltd.',
    'Refinery Expansion Project Phase II',
    'Pressure Vessel (Clad Austenitic Steel 50mm)',
    'Akshar Engineering Services Pvt. Ltd.',
    '2026-03-15',
    'Valid / Authenticated',
    'Full Stage-wise Third Party Inspection completed per ASME Sec VIII Div 1 and approved QAP.'
),
(
    'AES-IRN-2026-1042',
    'Reliance Industries Ltd.',
    'Cracker Unit Maintenance Turnaround',
    'Process Piping Spools (ASTM A333 Gr 6)',
    'Akshar Engineering Services Pvt. Ltd.',
    '2026-04-02',
    'Valid / Authenticated',
    'Hydrostatic pressure test witnessed at 1.5x design pressure. Zero leakage verified.'
),
(
    'AES-IRN-2026-9021',
    'ISGEC Heavy Engineering',
    'Supercritical Thermal Power Project',
    'Boiler Header & Steam Drum Assembly',
    'Akshar Engineering Services Pvt. Ltd.',
    '2026-05-18',
    'Valid / Authenticated',
    'IBR statutory stage clearance and 100% RT examination authenticated.'
)
ON CONFLICT (report_no) DO NOTHING;
