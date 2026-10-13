CREATE TABLE IF NOT EXISTS ticketing_ticket_cancellation_audit (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  ticket_id UUID NOT NULL,
  ticket_code TEXT NOT NULL,
  holder_name TEXT NOT NULL,
  source TEXT NOT NULL,
  previous_status TEXT NOT NULL,
  cancelled_by_staff_id UUID NOT NULL,
  cancelled_by_display_name TEXT NOT NULL,
  cancelled_by_role TEXT NOT NULL CHECK (cancelled_by_role='SUPERADMIN'),
  session_id UUID NOT NULL,
  cancelled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancellation_reason TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ticketing_ticket_deletion_audit (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  ticket_id UUID NOT NULL,
  ticket_code TEXT NOT NULL,
  holder_name TEXT NOT NULL,
  source TEXT NOT NULL,
  previous_status TEXT NOT NULL,
  deleted_by_staff_id UUID,
  deleted_by_display_name TEXT NOT NULL,
  deleted_by_role TEXT NOT NULL CHECK (deleted_by_role='SUPERADMIN'),
  session_id UUID,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deletion_reason TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS ticketing_ticket_cancellation_audit_code_idx
  ON ticketing_ticket_cancellation_audit(ticket_code,cancelled_at DESC);

CREATE INDEX IF NOT EXISTS ticketing_ticket_deletion_audit_code_idx
  ON ticketing_ticket_deletion_audit(ticket_code,deleted_at DESC);
