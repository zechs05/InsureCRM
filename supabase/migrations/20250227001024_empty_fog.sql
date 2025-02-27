/*
  # Create contacts table

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text)
      - `phone` (text)
      - `coverage` (text)
      - `age` (integer)
      - `date_of_birth` (date, not null)
      - `smoker` (boolean, default false)
      - `assigned_team_member_id` (uuid, references auth.users)
      - `source` (text, not null)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `created_by` (uuid, references auth.users)
  2. Security
    - Enable RLS on `contacts` table
    - Add policies for authenticated users to manage contacts
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  coverage text,
  age integer,
  date_of_birth date NOT NULL,
  smoker boolean DEFAULT false,
  assigned_team_member_id uuid REFERENCES auth.users(id),
  source text NOT NULL DEFAULT 'manual',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policies for contact management
CREATE POLICY "Users can view contacts they created or are assigned to"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_team_member_id OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can insert contacts"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update contacts they created or are assigned to"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_team_member_id OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can delete contacts they created"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS contacts_source_idx ON contacts(source);
CREATE INDEX IF NOT EXISTS contacts_assigned_team_member_id_idx ON contacts(assigned_team_member_id);
CREATE INDEX IF NOT EXISTS contacts_created_by_idx ON contacts(created_by);
CREATE INDEX IF NOT EXISTS contacts_smoker_idx ON contacts(smoker);

-- Function to update updated_at timestamp
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();