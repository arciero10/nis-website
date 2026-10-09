CREATE TABLE IF NOT EXISTS ticketing_partner_allocations (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  company_name TEXT NOT NULL,
  package_name TEXT,
  partnership_amount_cents BIGINT CHECK (partnership_amount_cents IS NULL OR partnership_amount_cents >= 0),
  allocated_quantity INTEGER NOT NULL CHECK (allocated_quantity > 0),
  status TEXT NOT NULL CHECK (status IN ('ACTIVE','CANCELLED')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ticketing_attendees
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'STANDARD',
  ADD COLUMN IF NOT EXISTS partner_allocation_id UUID REFERENCES ticketing_partner_allocations(id) ON DELETE RESTRICT;

ALTER TABLE ticketing_tickets
  ALTER COLUMN order_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS partner_allocation_id UUID REFERENCES ticketing_partner_allocations(id) ON DELETE RESTRICT;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_attendees_source_check') THEN
    ALTER TABLE ticketing_attendees
      ADD CONSTRAINT ticketing_attendees_source_check CHECK (source IN ('STANDARD','PARTNER'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_attendees_partner_source_check') THEN
    ALTER TABLE ticketing_attendees
      ADD CONSTRAINT ticketing_attendees_partner_source_check CHECK (
        (source='STANDARD' AND partner_allocation_id IS NULL)
        OR (source='PARTNER' AND partner_allocation_id IS NOT NULL)
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_tickets_single_origin_check') THEN
    ALTER TABLE ticketing_tickets
      ADD CONSTRAINT ticketing_tickets_single_origin_check CHECK (
        (order_id IS NOT NULL AND partner_allocation_id IS NULL)
        OR (order_id IS NULL AND partner_allocation_id IS NOT NULL)
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_tickets_partner_category_check') THEN
    ALTER TABLE ticketing_tickets
      ADD CONSTRAINT ticketing_tickets_partner_category_check CHECK (
        partner_allocation_id IS NULL OR category='PARTNER'
      );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_tickets_partner_attendee_uidx
  ON ticketing_tickets(partner_allocation_id,attendee_id)
  WHERE partner_allocation_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ticketing_partner_allocations_event_status_idx
  ON ticketing_partner_allocations(event_id,status);

CREATE INDEX IF NOT EXISTS ticketing_attendees_partner_allocation_idx
  ON ticketing_attendees(partner_allocation_id)
  WHERE partner_allocation_id IS NOT NULL;
