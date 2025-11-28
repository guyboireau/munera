-- DJ CONTEST TABLES

CREATE TABLE IF NOT EXISTS contest_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('active', 'finished', 'upcoming')) DEFAULT 'upcoming',
  winner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID REFERENCES contest_editions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  soundcloud_url TEXT,
  instagram_url TEXT,
  photo_url TEXT,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for winner_id safely
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_winner') THEN 
    ALTER TABLE contest_editions ADD CONSTRAINT fk_winner FOREIGN KEY (winner_id) REFERENCES contestants(id); 
  END IF; 
END $$;

CREATE TABLE IF NOT EXISTS vote_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  contest_id UUID REFERENCES contest_editions(id) ON DELETE CASCADE,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  voted_for UUID REFERENCES contestants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_code_id UUID REFERENCES vote_codes(id),
  contestant_id UUID REFERENCES contestants(id),
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT
);

-- SHOP TABLES

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  images JSONB,
  category TEXT,
  stock INTEGER DEFAULT 0,
  sizes JSONB,
  active BOOLEAN DEFAULT TRUE,
  stripe_product_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  delivery_method TEXT CHECK (delivery_method IN ('shipping', 'pickup')),
  pickup_event_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE
);

-- RLS POLICIES

-- Enable RLS (Safe to re-run)
ALTER TABLE contest_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies (Drop if exists then create)
DROP POLICY IF EXISTS "Public read contest_editions" ON contest_editions;
CREATE POLICY "Public read contest_editions" ON contest_editions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read contestants" ON contestants;
CREATE POLICY "Public read contestants" ON contestants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users see own orders" ON orders;
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (
  auth.jwt() ->> 'email' = customer_email
);

-- INDEXES (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_vote_codes_code ON vote_codes(code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- RPC
CREATE OR REPLACE FUNCTION increment_vote(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE contestants
  SET total_votes = total_votes + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
