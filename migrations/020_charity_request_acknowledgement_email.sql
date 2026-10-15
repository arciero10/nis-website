ALTER TABLE ticketing_charity_requests
  ADD COLUMN IF NOT EXISTS requester_email_attempted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS requester_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS requester_email_send_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS requester_email_last_error TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname='ticketing_charity_requests_requester_email_attempts_check'
  ) THEN
    ALTER TABLE ticketing_charity_requests
      ADD CONSTRAINT ticketing_charity_requests_requester_email_attempts_check
      CHECK (requester_email_send_attempts >= 0);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ticketing_charity_requests_requester_email_idx
  ON ticketing_charity_requests(requester_email_sent_at,requester_email_attempted_at)
  WHERE requester_email_sent_at IS NULL;
