CREATE TABLE IF NOT EXISTS home_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    url text NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL
);

-- Enable RLS
ALTER TABLE home_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policies for home_images
CREATE POLICY "Public read access for home_images"
ON home_images FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin full access for home_images"
ON home_images FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for app_settings
CREATE POLICY "Public read access for app_settings"
ON app_settings FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin full access for app_settings"
ON app_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create storage bucket for home images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('home-images', 'home-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'home-images' );

CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'home-images' );

CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'home-images' );
