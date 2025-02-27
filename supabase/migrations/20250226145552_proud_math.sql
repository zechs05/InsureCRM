/*
  # Create communications table for tracking all client interactions

  1. New Tables
    - `communications`
      - Basic communication info (type, content, status)
      - Email-specific fields (subject, recipient)
      - Call-specific fields (scheduled_at, duration)
      - Template tracking
      - Timestamps and relationships
  
  2. Security
    - Enable RLS on communications table
    - Add policies for authenticated users to manage communications
*/

CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('email', 'sms', 'call')),
  lead_id uuid REFERENCES leads(id),
  content text,
  subject text,
  recipient text,
  status text NOT NULL DEFAULT 'sent',
  template_id text,
  scheduled_at timestamptz,
  duration integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Policies for communication management
CREATE POLICY "Users can view communications they created"
  ON communications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = communications.lead_id
      AND (leads.created_by = auth.uid() OR leads.assigned_to = auth.uid())
    )
  );

CREATE POLICY "Users can insert communications"
  ON communications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS communications_type_idx ON communications(type);
CREATE INDEX IF NOT EXISTS communications_lead_id_idx ON communications(lead_id);
CREATE INDEX IF NOT EXISTS communications_status_idx ON communications(status);
CREATE INDEX IF NOT EXISTS communications_created_by_idx ON communications(created_by);

-- Function to update updated_at timestamp
CREATE TRIGGER update_communications_updated_at
  BEFORE UPDATE ON communications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();