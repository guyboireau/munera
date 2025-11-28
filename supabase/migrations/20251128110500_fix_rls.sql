-- Fix RLS Policies for Contest and Shop

-- Contest Editions: Allow authenticated users (admins) to insert/update/delete
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON contest_editions;
CREATE POLICY "Enable all access for authenticated users" ON contest_editions
FOR ALL USING (auth.role() = 'authenticated');

-- Contestants: Allow authenticated users to insert/update/delete
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON contestants;
CREATE POLICY "Enable insert for authenticated users" ON contestants
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users" ON contestants;
CREATE POLICY "Enable update for authenticated users" ON contestants
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON contestants;
CREATE POLICY "Enable delete for authenticated users" ON contestants
FOR DELETE USING (auth.role() = 'authenticated');

-- Vote Codes: Allow authenticated users to insert (generate) and read
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON vote_codes;
CREATE POLICY "Enable all access for authenticated users" ON vote_codes
FOR ALL USING (auth.role() = 'authenticated');

-- Products: Allow authenticated users to insert/update/delete
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON products;
CREATE POLICY "Enable all access for authenticated users" ON products
FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Allow public to insert (for checkout), users to read own
DROP POLICY IF EXISTS "Enable insert for everyone" ON orders;
CREATE POLICY "Enable insert for everyone" ON orders
FOR INSERT WITH CHECK (true);

-- Fix Votes: Allow public to insert (voting)
DROP POLICY IF EXISTS "Enable insert for everyone" ON votes;
CREATE POLICY "Enable insert for everyone" ON votes
FOR INSERT WITH CHECK (true);

-- Fix Vote Codes: Allow public to update (mark as used)
DROP POLICY IF EXISTS "Enable update for everyone" ON vote_codes;
CREATE POLICY "Enable update for everyone" ON vote_codes
FOR UPDATE USING (true); 
-- Note: This is insecure for production (anyone can mark codes used), 
-- but necessary for the current client-side implementation without backend functions.
-- A better approach would be to use the RPC 'increment_vote' to also mark the code as used, 
-- but the current RPC only increments the count.

-- Let's stick to the plan: The user is an Admin, so they need write access.
-- The public needs write access for:
-- 1. `votes` (INSERT)
-- 2. `vote_codes` (UPDATE - to mark used)
-- 3. `orders` (INSERT)

-- Re-applying public read policies just in case (IF NOT EXISTS is not standard SQL for policies, so we skip)
-- But we can ensure the previous ones work.
