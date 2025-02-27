/*
  # Create goals table

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `type` (text)
      - `target` (integer)
      - `current` (integer)
      - `period` (text)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('revenue', 'leads', 'policies')),
  target integer NOT NULL CHECK (target > 0),
  current integer NOT NULL DEFAULT 0,
  period text NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view goals they created"
  ON goals
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can insert goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS goals_type_idx ON goals(type);
CREATE INDEX IF NOT EXISTS goals_period_idx ON goals(period);
CREATE INDEX IF NOT EXISTS goals_created_by_idx ON goals(created_by);

-- Update trigger
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();