/*
  # Add profile pictures storage bucket

  1. New Storage Bucket
    - Create a new storage bucket for profile pictures
    - Set public access to true for easy retrieval
  2. Security
    - Enable RLS on the bucket
    - Add policies for authenticated users to manage their own profile pictures
*/

-- Create the storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_pictures', 'profile_pictures', true);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile_pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to update their own profile pictures
CREATE POLICY "Users can update their own profile pictures"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile_pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile_pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to read their own profile pictures
CREATE POLICY "Users can read their own profile pictures"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile_pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow public read access to all profile pictures
CREATE POLICY "Public read access for profile pictures"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'profile_pictures'
);