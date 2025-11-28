-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to view images
DROP POLICY IF EXISTS "Public Access Products" ON storage.objects;
CREATE POLICY "Public Access Products"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Policy to allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated Upload Products" ON storage.objects;
CREATE POLICY "Authenticated Upload Products"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Policy to allow authenticated users to update images
DROP POLICY IF EXISTS "Authenticated Update Products" ON storage.objects;
CREATE POLICY "Authenticated Update Products"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Policy to allow authenticated users to delete images
DROP POLICY IF EXISTS "Authenticated Delete Products" ON storage.objects;
CREATE POLICY "Authenticated Delete Products"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);
