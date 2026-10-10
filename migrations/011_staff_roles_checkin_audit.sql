ALTER TABLE ticketing_events
  ADD COLUMN IF NOT EXISTS checkin_opens_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS checkin_closes_at TIMESTAMPTZ;

ALTER TABLE ticketing_staff_sessions
  ADD COLUMN IF NOT EXISTS operator_id UUID,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS login_at TIMESTAMPTZ;

UPDATE ticketing_staff_sessions
SET operator_id=COALESCE(operator_id,id),
    display_name=COALESCE(NULLIF(display_name,''),'Staff'),
    role=COALESCE(role,'STAFF'),
    login_at=COALESCE(login_at,created_at)
WHERE operator_id IS NULL OR display_name IS NULL OR role IS NULL OR login_at IS NULL;

ALTER TABLE ticketing_staff_sessions
  ALTER COLUMN operator_id SET NOT NULL,
  ALTER COLUMN display_name SET NOT NULL,
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN login_at SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_staff_sessions_role_check') THEN
    ALTER TABLE ticketing_staff_sessions
      ADD CONSTRAINT ticketing_staff_sessions_role_check CHECK (role IN ('STAFF','SUPERADMIN'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_events_checkin_window_check') THEN
    ALTER TABLE ticketing_events
      ADD CONSTRAINT ticketing_events_checkin_window_check
      CHECK (checkin_opens_at IS NULL OR checkin_closes_at IS NULL OR checkin_opens_at < checkin_closes_at);
  END IF;
END $$;

ALTER TABLE ticketing_check_ins
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS checked_in_by_staff_id UUID,
  ADD COLUMN IF NOT EXISTS checked_in_by_display_name TEXT,
  ADD COLUMN IF NOT EXISTS checkin_method TEXT,
  ADD COLUMN IF NOT EXISTS session_id UUID,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS window_bypassed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reversed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reversed_by_staff_id UUID,
  ADD COLUMN IF NOT EXISTS reversed_by_display_name TEXT,
  ADD COLUMN IF NOT EXISTS reverse_reason TEXT,
  ADD COLUMN IF NOT EXISTS reverse_session_id UUID;

UPDATE ticketing_check_ins checkin
SET event_id=COALESCE(checkin.event_id,ticket.event_id),
    checkin_method=COALESCE(checkin.checkin_method,'MANUAL'),
    status=COALESCE(checkin.status,'ACTIVE')
FROM ticketing_tickets ticket
WHERE ticket.id=checkin.ticket_id
  AND (checkin.event_id IS NULL OR checkin.checkin_method IS NULL OR checkin.status IS NULL);

ALTER TABLE ticketing_check_ins
  ALTER COLUMN event_id SET NOT NULL,
  ALTER COLUMN checkin_method SET NOT NULL,
  ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_check_ins_method_check') THEN
    ALTER TABLE ticketing_check_ins
      ADD CONSTRAINT ticketing_check_ins_method_check CHECK (checkin_method IN ('QR','MANUAL'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_check_ins_status_check') THEN
    ALTER TABLE ticketing_check_ins
      ADD CONSTRAINT ticketing_check_ins_status_check CHECK (status IN ('ACTIVE','REVERSED'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_check_ins_reverse_audit_check') THEN
    ALTER TABLE ticketing_check_ins
      ADD CONSTRAINT ticketing_check_ins_reverse_audit_check CHECK (
        (status='ACTIVE' AND reversed_at IS NULL AND reverse_reason IS NULL)
        OR
        (status='REVERSED' AND reversed_at IS NOT NULL AND reverse_reason IS NOT NULL)
      );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_check_ins_one_active_per_ticket_uidx
  ON ticketing_check_ins(ticket_id)
  WHERE status='ACTIVE' AND result='ALLOWED';

CREATE INDEX IF NOT EXISTS ticketing_check_ins_event_audit_idx
  ON ticketing_check_ins(event_id,checked_in_at DESC);
