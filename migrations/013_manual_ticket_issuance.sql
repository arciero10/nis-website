CREATE TABLE IF NOT EXISTS ticketing_manual_issuances (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  idempotency_key TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('BANK_TRANSFER','COMPLIMENTARY')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 10),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('VERIFIED_MANUAL','NOT_REQUIRED')),
  declared_amount NUMERIC(10,2) CHECK (declared_amount IS NULL OR declared_amount >= 0),
  transfer_date DATE,
  transfer_reference TEXT,
  complimentary_reason TEXT CHECK (complimentary_reason IS NULL OR complimentary_reason IN ('INSTITUTIONAL_GUEST','NIS_GUEST','SPEAKER','STAFF_ORGANIZATION','COURTESY','OTHER')),
  complimentary_reason_other TEXT,
  notes TEXT,
  document_storage_key TEXT,
  document_original_filename TEXT,
  document_mime_type TEXT,
  document_size BIGINT CHECK (document_size IS NULL OR document_size > 0),
  document_uploaded_at TIMESTAMPTZ,
  document_uploaded_by_staff_id UUID,
  document_uploaded_by_display_name TEXT,
  created_by_staff_id UUID NOT NULL,
  created_by_display_name TEXT NOT NULL,
  created_by_role TEXT NOT NULL CHECK (created_by_role IN ('STAFF','SUPERADMIN')),
  session_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (source='BANK_TRANSFER' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL AND complimentary_reason IS NULL)
    OR
    (source='COMPLIMENTARY' AND payment_status='NOT_REQUIRED' AND declared_amount IS NULL AND complimentary_reason IS NOT NULL AND document_storage_key IS NULL)
  ),
  CHECK (complimentary_reason<>'OTHER' OR NULLIF(BTRIM(complimentary_reason_other),'') IS NOT NULL)
);

ALTER TABLE ticketing_tickets
  ADD COLUMN IF NOT EXISTS issuance_source TEXT NOT NULL DEFAULT 'PAYPAL',
  ADD COLUMN IF NOT EXISTS manual_issuance_id UUID REFERENCES ticketing_manual_issuances(id) ON DELETE RESTRICT;

UPDATE ticketing_tickets SET issuance_source='COMPANY' WHERE partner_allocation_id IS NOT NULL;

WITH ranked_partner_tickets AS (
  SELECT ticket.id,
    ROW_NUMBER() OVER (PARTITION BY ticket.partner_allocation_id ORDER BY ticket.created_at,ticket.id)::integer AS sequence_number,
    allocation.allocated_quantity AS total_quantity
  FROM ticketing_tickets ticket
  JOIN ticketing_partner_allocations allocation ON allocation.id=ticket.partner_allocation_id
  WHERE ticket.partner_allocation_id IS NOT NULL
)
UPDATE ticketing_tickets ticket
SET sequence_number=COALESCE(ticket.sequence_number,ranked.sequence_number),
    total_quantity=COALESCE(ticket.total_quantity,ranked.total_quantity)
FROM ranked_partner_tickets ranked
WHERE ticket.id=ranked.id;

ALTER TABLE ticketing_tickets DROP CONSTRAINT IF EXISTS ticketing_tickets_single_origin_check;
ALTER TABLE ticketing_tickets DROP CONSTRAINT IF EXISTS ticketing_tickets_partner_sequence_check;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_tickets_issuance_source_check') THEN
    ALTER TABLE ticketing_tickets ADD CONSTRAINT ticketing_tickets_issuance_source_check
      CHECK (issuance_source IN ('PAYPAL','BANK_TRANSFER','COMPANY','COMPLIMENTARY'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_tickets_single_origin_v2_check') THEN
    ALTER TABLE ticketing_tickets ADD CONSTRAINT ticketing_tickets_single_origin_v2_check CHECK (
      ((order_id IS NOT NULL)::integer + (partner_allocation_id IS NOT NULL)::integer + (manual_issuance_id IS NOT NULL)::integer)=1
      AND (order_id IS NULL OR issuance_source='PAYPAL')
      AND (partner_allocation_id IS NULL OR issuance_source='COMPANY')
      AND (manual_issuance_id IS NULL OR issuance_source IN ('BANK_TRANSFER','COMPLIMENTARY'))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_tickets_sequence_v2_check') THEN
    ALTER TABLE ticketing_tickets ADD CONSTRAINT ticketing_tickets_sequence_v2_check CHECK (
      ((partner_allocation_id IS NULL AND manual_issuance_id IS NULL) AND sequence_number IS NULL AND total_quantity IS NULL)
      OR
      ((partner_allocation_id IS NOT NULL OR manual_issuance_id IS NOT NULL)
        AND sequence_number > 0 AND total_quantity > 0 AND sequence_number <= total_quantity)
    );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_manual_ticket_sequence_uidx
  ON ticketing_tickets(manual_issuance_id,sequence_number)
  WHERE manual_issuance_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ticketing_manual_issuances_event_created_idx
  ON ticketing_manual_issuances(event_id,created_at DESC);
