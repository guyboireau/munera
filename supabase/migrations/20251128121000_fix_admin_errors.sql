-- Fix 409: Add ON DELETE CASCADE to votes
ALTER TABLE votes
DROP CONSTRAINT IF EXISTS votes_contestant_id_fkey,
ADD CONSTRAINT votes_contestant_id_fkey
  FOREIGN KEY (contestant_id)
  REFERENCES contestants(id)
  ON DELETE CASCADE;

-- Ensure buckets exist
INSERT INTO storage.buckets (id, name, public) VALUES ('contest-photos', 'contest-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

-- Fix Storage Policies (Re-apply all to be safe)

-- Contest Photos
DROP POLICY IF EXISTS "Public Access Contest" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects; -- Remove old generic name if exists
CREATE POLICY "Public Access Contest" ON storage.objects FOR SELECT USING (bucket_id = 'contest-photos');

DROP POLICY IF EXISTS "Auth Upload Contest" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects; -- Remove old generic name
CREATE POLICY "Auth Upload Contest" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'contest-photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Update Contest" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects; -- Remove old generic name
CREATE POLICY "Auth Update Contest" ON storage.objects FOR UPDATE USING (bucket_id = 'contest-photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Delete Contest" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects; -- Remove old generic name
CREATE POLICY "Auth Delete Contest" ON storage.objects FOR DELETE USING (bucket_id = 'contest-photos' AND auth.role() = 'authenticated');

-- Product Images
DROP POLICY IF EXISTS "Public Access Products" ON storage.objects;
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Auth Upload Products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Products" ON storage.objects; -- Fix potential naming mismatch
CREATE POLICY "Auth Upload Products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Update Products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Products" ON storage.objects;
CREATE POLICY "Auth Update Products" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Delete Products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Products" ON storage.objects;
CREATE POLICY "Auth Delete Products" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
