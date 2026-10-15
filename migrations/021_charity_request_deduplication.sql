ALTER TABLE ticketing_charity_requests
  ADD COLUMN IF NOT EXISTS dedupe_email_key TEXT,
  ADD COLUMN IF NOT EXISTS dedupe_phone_key TEXT,
  ADD COLUMN IF NOT EXISTS duplicate_review_required BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS duplicate_review_reason TEXT,
  ADD COLUMN IF NOT EXISTS verified_paypal_reference TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_charity_requests_active_email_dedupe_uidx
  ON ticketing_charity_requests(dedupe_email_key)
  WHERE dedupe_email_key IS NOT NULL AND status IN ('PENDING_DONATION','VERIFIED');

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_charity_requests_active_phone_dedupe_uidx
  ON ticketing_charity_requests(dedupe_phone_key)
  WHERE dedupe_phone_key IS NOT NULL AND status IN ('PENDING_DONATION','VERIFIED');

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_charity_requests_paypal_reference_uidx
  ON ticketing_charity_requests((UPPER(REGEXP_REPLACE(BTRIM(verified_paypal_reference),'\s+','','g'))))
  WHERE verified_paypal_reference IS NOT NULL;

CREATE TABLE IF NOT EXISTS ticketing_verified_paypal_donations (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  manual_issuance_id UUID NOT NULL UNIQUE,
  reference_normalized TEXT NOT NULL UNIQUE,
  verified_by_staff_id UUID NOT NULL,
  verified_by_display_name TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ticketing_verified_paypal_donations_event_idx
  ON ticketing_verified_paypal_donations(event_id,verified_at DESC);
