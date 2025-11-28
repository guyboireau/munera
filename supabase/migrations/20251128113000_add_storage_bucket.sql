-- Create Storage Bucket for Contest Photos
-- Note: We insert into storage.buckets if it doesn't exist.
-- This requires permissions on the storage schema which migrations usually have.

INSERT INTO storage.buckets (id, name, public)
VALUES ('contest-photos', 'contest-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies

-- 1. Allow public read access
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'contest-photos' );

-- 2. Allow authenticated users (admins) to upload
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'contest-photos' 
  AND auth.role() = 'authenticated'
);

-- 3. Allow authenticated users to update/delete
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'contest-photos' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'contest-photos' AND auth.role() = 'authenticated' );
