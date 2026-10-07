-- Enable pg_cron extension if not already enabled (Supabase standard)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule a dummy query to run every day at midnight.
-- This creates database activity, preventing Supabase from pausing the free tier project due to inactivity.
SELECT cron.schedule(
  'prevent-idle-pause', -- Job name
  '0 0 * * *',          -- Every day at midnight
  'SELECT 1;'           -- Dummy query to register activity
);
