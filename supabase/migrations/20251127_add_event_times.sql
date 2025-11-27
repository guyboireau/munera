-- Add start_time and end_time columns to events table
ALTER TABLE events 
ADD COLUMN start_time TIME,
ADD COLUMN end_time TIME;

-- Add comment to explain the columns
COMMENT ON COLUMN events.start_time IS 'Heure de début de l''événement';
COMMENT ON COLUMN events.end_time IS 'Heure de fin de l''événement';
