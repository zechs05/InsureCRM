/*
  # Add call outcomes tracking

  1. New Tables
    - `call_outcomes`
      - `id` (uuid, primary key)
      - `call_id` (uuid, references communications)
      - `status` (text) - completed, no_answer, rescheduled, cancelled
      - `duration_actual` (integer) - actual call duration in minutes
      - `notes` (text) - call notes and summary
      - `follow_up_needed` (boolean)
      - `follow_up_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `call_outcomes` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS call_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid REFERENCES communications(id),
  status text NOT NULL CHECK (status IN ('completed', 'no_answer', 'rescheduled', 'cancelled')),
  duration_actual integer,
  notes text,
  follow_up_needed boolean DEFAULT false,
  follow_up_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE call_outcomes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view call outcomes they created"
  ON call_outcomes
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM communications
      WHERE communications.id = call_outcomes.call_id
      AND communications.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert call outcomes"
  ON call_outcomes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS call_outcomes_call_id_idx ON call_outcomes(call_id);
CREATE INDEX IF NOT EXISTS call_outcomes_status_idx ON call_outcomes(status);
CREATE INDEX IF NOT EXISTS call_outcomes_created_by_idx ON call_outcomes(created_by);

-- Update trigger
CREATE TRIGGER update_call_outcomes_updated_at
  BEFORE UPDATE ON call_outcomes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();