ALTER TABLE ticketing_tickets
  ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_claimed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_last_error TEXT,
  ADD COLUMN IF NOT EXISTS email_send_attempts INTEGER NOT NULL DEFAULT 0 CHECK (email_send_attempts >= 0);

CREATE INDEX IF NOT EXISTS ticketing_tickets_email_pending_idx
  ON ticketing_tickets(email_sent_at,email_claimed_at)
  WHERE email_sent_at IS NULL;
