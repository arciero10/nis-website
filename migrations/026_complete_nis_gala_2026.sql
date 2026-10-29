ALTER TABLE ticketing_events
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ticketing_events WHERE slug='nis-gala-2026') THEN
    RAISE EXCEPTION 'NIS Gala 2026 event not found';
  END IF;

  IF EXISTS (SELECT 1 FROM ticketing_events WHERE slug='nis-gala-2026' AND status='CANCELLED') THEN
    RAISE EXCEPTION 'NIS Gala 2026 is cancelled and cannot be completed automatically';
  END IF;
END $$;

UPDATE ticketing_events
SET status='COMPLETED',
    completed_at=COALESCE(completed_at,TIMESTAMPTZ '2026-10-29 00:20:00+01:00'),
    updated_at=NOW()
WHERE slug='nis-gala-2026'
  AND (status<>'COMPLETED' OR completed_at IS NULL);
