/*
  # Create leads table with Facebook integration

  1. New Tables
    - `leads`
      - Basic lead information (name, email, phone)
      - Lead status and source tracking
      - Facebook-specific fields for integration
      - Timestamps for lead creation and updates
  
  2. Security
    - Enable RLS on leads table
    - Add policies for authenticated users to manage leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'new',
  source text NOT NULL DEFAULT 'manual',
  policy_type text,
  coverage_amount integer,
  notes text,
  facebook_lead_id text,
  facebook_ad_id text,
  facebook_form_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_contacted_at timestamptz,
  assigned_to uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies for lead management
CREATE POLICY "Users can view leads they created or are assigned to"
  ON leads
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can insert leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update leads they created or are assigned to"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads(source);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS leads_created_by_idx ON leads(created_by);
CREATE INDEX IF NOT EXISTS leads_facebook_lead_id_idx ON leads(facebook_lead_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();