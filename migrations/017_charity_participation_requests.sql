CREATE TABLE IF NOT EXISTS ticketing_charity_requests (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  invitation_id UUID NOT NULL REFERENCES ticketing_invitations(id) ON DELETE RESTRICT,
  request_id UUID NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 10),
  expected_amount NUMERIC(10,2) NOT NULL CHECK (expected_amount > 0),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency='EUR'),
  status TEXT NOT NULL DEFAULT 'PENDING_DONATION' CHECK (status IN ('PENDING_DONATION','VERIFIED','TICKETS_ISSUED','CANCELLED')),
  privacy_accepted_at TIMESTAMPTZ NOT NULL,
  manual_issuance_id UUID UNIQUE REFERENCES ticketing_manual_issuances(id) ON DELETE RESTRICT,
  verified_at TIMESTAMPTZ,
  verified_by_staff_id UUID,
  verified_by_display_name TEXT,
  verified_session_id UUID,
  cancelled_at TIMESTAMPTZ,
  cancelled_by_staff_id UUID,
  cancelled_by_display_name TEXT,
  cancelled_session_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((status='TICKETS_ISSUED')=(manual_issuance_id IS NOT NULL)),
  CHECK (status<>'CANCELLED' OR cancelled_at IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS ticketing_charity_requests_event_status_created_idx
  ON ticketing_charity_requests(event_id,status,created_at DESC);
