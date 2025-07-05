-- Add suitability_data column to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS suitability_data jsonb DEFAULT '{}'::jsonb; 