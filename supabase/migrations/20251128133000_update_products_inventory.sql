-- Update products table for inventory management

ALTER TABLE products
ADD COLUMN inventory JSONB DEFAULT '{}'::jsonb;

-- Drop old columns
ALTER TABLE products
DROP COLUMN sizes,
DROP COLUMN stock;
