-- Migration: Add latitude and longitude to events table
-- Created: 2025-11-26
-- Description: Adds GPS coordinates columns to enable map display of events

-- Add latitude and longitude columns
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision;

-- Add comment to document the columns
COMMENT ON COLUMN public.events.latitude IS 'Latitude GPS de l''événement (géocodé automatiquement)';
COMMENT ON COLUMN public.events.longitude IS 'Longitude GPS de l''événement (géocodé automatiquement)';
