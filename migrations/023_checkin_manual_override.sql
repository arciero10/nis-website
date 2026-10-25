ALTER TABLE ticketing_events
  ADD COLUMN IF NOT EXISTS checkin_override_state TEXT,
  ADD COLUMN IF NOT EXISTS checkin_override_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS checkin_override_changed_by_staff_id UUID,
  ADD COLUMN IF NOT EXISTS checkin_override_changed_by_display_name TEXT,
  ADD COLUMN IF NOT EXISTS checkin_override_session_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_events_checkin_override_state_check') THEN
    ALTER TABLE ticketing_events
      ADD CONSTRAINT ticketing_events_checkin_override_state_check
      CHECK (checkin_override_state IS NULL OR checkin_override_state IN ('OPEN','CLOSED'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS ticketing_checkin_window_audit (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('OPEN','CLOSE')),
  performed_by_staff_id UUID NOT NULL,
  performed_by_display_name TEXT NOT NULL,
  session_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ticketing_checkin_window_audit_reason_check
    CHECK (reason IS NULL OR char_length(btrim(reason)) BETWEEN 3 AND 500)
);

CREATE INDEX IF NOT EXISTS ticketing_checkin_window_audit_event_idx
  ON ticketing_checkin_window_audit(event_id,created_at DESC);
