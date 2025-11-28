-- Switch to Auth-based Voting

-- 1. Update votes table
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS contest_id UUID REFERENCES contest_editions(id);

-- 2. Populate contest_id for existing votes (if any) based on contestant
UPDATE votes v
SET contest_id = c.contest_id
FROM contestants c
WHERE v.contestant_id = c.id;

-- 3. Add Unique Constraint: One vote per user per contest
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'unique_vote_per_user_per_contest') THEN 
    ALTER TABLE votes ADD CONSTRAINT unique_vote_per_user_per_contest UNIQUE (user_id, contest_id); 
  END IF; 
END $$;

-- 4. Update RLS for votes
DROP POLICY IF EXISTS "Enable insert for everyone" ON votes;
DROP POLICY IF EXISTS "Users can insert their own vote" ON votes;
DROP POLICY IF EXISTS "Users can view their own votes" ON votes;

CREATE POLICY "Users can insert their own vote" ON votes
FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can view their own votes" ON votes
FOR SELECT USING (
  auth.uid() = user_id
);

-- 5. (Optional) We can keep vote_codes table for legacy or hybrid, 
-- but we won't use it in the new frontend flow.
