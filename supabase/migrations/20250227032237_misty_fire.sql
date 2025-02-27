/*
  # Add Facebook Lead Ads Configuration Table

  1. New Tables
    - `facebook_config`
      - `id` (uuid, primary key)
      - `access_token` (text)
      - `ad_account_id` (text)
      - `page_id` (text)
      - `form_id` (text)
      - `field_mapping` (jsonb)
      - `sync_interval` (integer)
      - `webhook_secret` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `facebook_config` table
    - Add policies for admin access
*/

-- Create facebook_config table
CREATE TABLE IF NOT EXISTS facebook_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text NOT NULL,
  ad_account_id text NOT NULL,
  page_id text NOT NULL,
  form_id text NOT NULL,
  field_mapping jsonb DEFAULT '{}'::jsonb,
  sync_interval integer DEFAULT 5,
  webhook_secret text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE facebook_config ENABLE ROW LEVEL SECURITY;

-- Policies for facebook_config
CREATE POLICY "Only admins can view facebook config"
  ON facebook_config
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Only admins can insert facebook config"
  ON facebook_config
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Only admins can update facebook config"
  ON facebook_config
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Update trigger for updated_at
CREATE TRIGGER update_facebook_config_updated_at
  BEFORE UPDATE ON facebook_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add facebook_lead_id column to leads table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'facebook_lead_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN facebook_lead_id text;
    CREATE INDEX leads_facebook_lead_id_idx ON leads(facebook_lead_id);
  END IF;
END $$;