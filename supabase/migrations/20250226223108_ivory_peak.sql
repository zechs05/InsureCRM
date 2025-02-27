/*
  # Fix leads table permissions

  1. Changes
    - Update RLS policies for leads table to allow authenticated users to access leads
    - Remove dependency on auth.users table in RLS policies
    - Add simpler policies that allow authenticated users to perform CRUD operations
*/

-- Drop existing policies that are causing permission errors
DROP POLICY IF EXISTS "Users can view leads they created or are assigned to" ON leads;
DROP POLICY IF EXISTS "Users can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can update leads they created or are assigned to" ON leads;

-- Create new simplified policies
CREATE POLICY "Allow authenticated users to select leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete leads"
  ON leads
  FOR DELETE
  TO authenticated
  USING (true);