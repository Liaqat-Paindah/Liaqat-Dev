-- Enable Supabase Realtime for messaging tables.
-- Run in Supabase SQL Editor if postgres_changes events are not received.

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_status;

-- If tables were already added, ignore duplicate errors.
-- To verify:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
