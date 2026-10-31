ALTER TABLE ticketing_events
  ADD COLUMN IF NOT EXISTS long_description TEXT,
  ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS registration_opens_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS registration_closes_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_free BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_charity BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'PRIVATE',
  ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'OTHER',
  ADD COLUMN IF NOT EXISTS allows_companions BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS max_companions INTEGER,
  ADD COLUMN IF NOT EXISTS organizational_notes TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS public_url TEXT,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE ticketing_events
  ALTER COLUMN price DROP NOT NULL;

ALTER TABLE ticketing_events
  DROP CONSTRAINT IF EXISTS ticketing_events_status_check,
  DROP CONSTRAINT IF EXISTS ticketing_events_currency_check;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_events_status_v2_check') THEN
    ALTER TABLE ticketing_events ADD CONSTRAINT ticketing_events_status_v2_check
      CHECK (status IN ('DRAFT','PUBLISHED','OPEN','CLOSED','COMPLETED','ARCHIVED','CANCELLED','ANNOUNCED','SOLD_OUT'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_events_type_check') THEN
    ALTER TABLE ticketing_events ADD CONSTRAINT ticketing_events_type_check
      CHECK (event_type IN ('CHARITY','INTERNAL','PUBLIC','PRIVATE','CORPORATE','OTHER'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_events_visibility_check') THEN
    ALTER TABLE ticketing_events ADD CONSTRAINT ticketing_events_visibility_check
      CHECK (visibility IN ('PUBLIC','PRIVATE','INTERNAL'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_events_configuration_check') THEN
    ALTER TABLE ticketing_events ADD CONSTRAINT ticketing_events_configuration_check CHECK (
      (event_date IS NULL OR ends_at IS NULL OR event_date < ends_at)
      AND (registration_opens_at IS NULL OR registration_closes_at IS NULL OR registration_opens_at < registration_closes_at)
      AND (max_companions IS NULL OR max_companions >= 0)
      AND (allows_companions OR max_companions IS NULL OR max_companions = 0)
      AND (price IS NULL OR price >= 0)
      AND currency ~ '^[A-Z]{3}$'
    );
  END IF;
END $$;

UPDATE ticketing_events
SET event_type='CHARITY',visibility='PUBLIC',is_charity=TRUE
WHERE slug='nis-gala-2026'
  AND (event_type='OTHER' OR visibility='PRIVATE' OR is_charity=FALSE);

CREATE TABLE IF NOT EXISTS ticketing_event_ticket_types (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  price NUMERIC(10,2),
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  max_quantity INTEGER,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id,code),
  CHECK (code ~ '^[A-Z][A-Z0-9_]{1,49}$'),
  CHECK (price IS NULL OR price >= 0),
  CHECK (currency ~ '^[A-Z]{3}$'),
  CHECK (max_quantity IS NULL OR max_quantity > 0),
  CHECK (is_free OR price IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS ticketing_event_ticket_types_event_idx
  ON ticketing_event_ticket_types(event_id,is_active,display_order);

CREATE TABLE IF NOT EXISTS ticketing_registrations (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  attendee_id UUID REFERENCES ticketing_attendees(id) ON DELETE RESTRICT,
  ticket_id UUID REFERENCES ticketing_tickets(id) ON DELETE RESTRICT,
  ticket_type_id UUID REFERENCES ticketing_event_ticket_types(id) ON DELETE RESTRICT,
  primary_registration_id UUID REFERENCES ticketing_registrations(id) ON DELETE RESTRICT,
  participant_role TEXT NOT NULL DEFAULT 'PRIMARY',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'PENDING',
  payment_status TEXT NOT NULL DEFAULT 'NOT_REQUIRED',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(ticket_id),
  CHECK (participant_role IN ('PRIMARY','COMPANION','GUEST','COMPANY','STAFF')),
  CHECK (rsvp_status IN ('CONFIRMED','DECLINED','WAITLIST','PENDING')),
  CHECK (payment_status IN ('NOT_REQUIRED','PENDING','PAID','FAILED','REFUNDED','PENDING_BANK_TRANSFER','PENDING_CASH','CANCELLED')),
  CHECK ((participant_role='COMPANION' AND primary_registration_id IS NOT NULL) OR participant_role<>'COMPANION')
);

CREATE INDEX IF NOT EXISTS ticketing_registrations_event_status_idx
  ON ticketing_registrations(event_id,rsvp_status,created_at DESC);
CREATE INDEX IF NOT EXISTS ticketing_registrations_primary_idx
  ON ticketing_registrations(primary_registration_id)
  WHERE primary_registration_id IS NOT NULL;

ALTER TABLE ticketing_staff_sessions
  ADD COLUMN IF NOT EXISTS selected_event_id UUID REFERENCES ticketing_events(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS ticketing_staff_sessions_selected_event_idx
  ON ticketing_staff_sessions(selected_event_id)
  WHERE selected_event_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS ticketing_event_audit (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  performed_by_staff_id UUID NOT NULL,
  performed_by_display_name TEXT NOT NULL,
  session_id UUID NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (action IN ('CREATED','DUPLICATED','SELECTED','STATUS_CHANGED','UPDATED'))
);

CREATE INDEX IF NOT EXISTS ticketing_event_audit_event_idx
  ON ticketing_event_audit(event_id,created_at DESC);

INSERT INTO ticketing_event_ticket_types(id,event_id,code,label,price,currency,is_free,is_public,is_active,display_order,notes)
SELECT gen_random_uuid(),event.id,seed.code,seed.label,seed.price,'EUR',seed.is_free,FALSE,TRUE,seed.display_order,'Configurazione storica Gala; nessun ticket esistente viene modificato.'
FROM ticketing_events event
CROSS JOIN (VALUES
  ('STANDARD','Standard',200.00::numeric,FALSE,10),
  ('SPONSOR','Sponsor',NULL::numeric,TRUE,20),
  ('OSPITE','Ospite',NULL::numeric,TRUE,30),
  ('STAMPA','Stampa',NULL::numeric,TRUE,40),
  ('MEDIA','Media',NULL::numeric,TRUE,50),
  ('OMAGGIO','Omaggio',NULL::numeric,TRUE,60),
  ('STAFF','Staff',NULL::numeric,TRUE,70)
) AS seed(code,label,price,is_free,display_order)
WHERE event.slug='nis-gala-2026'
ON CONFLICT (event_id,code) DO NOTHING;
