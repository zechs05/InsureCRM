-- Drop existing facebook_config table if it exists
DROP TABLE IF EXISTS facebook_config;

-- Create facebook_config table with simplified structure
CREATE TABLE facebook_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text NOT NULL,
  page_id text,
  form_id text,
  sync_interval integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE facebook_config ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "Users can view facebook config"
  ON facebook_config
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert facebook config"
  ON facebook_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update facebook config"
  ON facebook_config
  FOR UPDATE
  TO authenticated
  USING (true);

-- Update trigger for updated_at
CREATE TRIGGER update_facebook_config_updated_at
  BEFORE UPDATE ON facebook_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();