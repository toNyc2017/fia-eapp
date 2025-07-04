-- Create applications table with simplified schema
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  agent_name TEXT NOT NULL,
  agent_email TEXT NOT NULL,
  session_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  
  -- Applicant Information (Step 1)
  applicant_first_name TEXT,
  applicant_last_name TEXT,
  applicant_email TEXT,
  applicant_phone TEXT,
  applicant_date_of_birth DATE,
  applicant_ssn TEXT,
  applicant_address TEXT,
  applicant_city TEXT,
  applicant_state TEXT,
  applicant_zip TEXT,
  
  -- Product Selection (Step 2)
  product_id TEXT,
  product_name TEXT,
  premium_amount DECIMAL(15,2),
  term_length INTEGER,
  ownership_type TEXT,
  plan_type TEXT,
  account_designation TEXT,
  
  -- Owner Information (Step 3) - Simplified JSONB
  owner_info JSONB DEFAULT '{}'::jsonb,
  
  -- Joint Owner Information (Step 4) - Simplified JSONB
  joint_owner_info JSONB DEFAULT '{}'::jsonb,
  
  -- Application metadata
  form_version TEXT DEFAULT '1.0',
  logs JSONB DEFAULT '[]'::jsonb
);

-- Create indexes for better performance
CREATE INDEX idx_applications_session_id ON applications(session_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_agent_email ON applications(agent_email);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_applications_form_version ON applications(form_version);

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (we can restrict this later)
CREATE POLICY "Allow all operations" ON applications
  FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
