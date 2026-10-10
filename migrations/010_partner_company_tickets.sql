ALTER TABLE ticketing_partner_allocations
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS email_delivery_status TEXT NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS email_claimed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_send_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS email_last_error TEXT;

ALTER TABLE ticketing_tickets
  ADD COLUMN IF NOT EXISTS sequence_number INTEGER,
  ADD COLUMN IF NOT EXISTS total_quantity INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_partner_allocations_email_status_check') THEN
    ALTER TABLE ticketing_partner_allocations
      ADD CONSTRAINT ticketing_partner_allocations_email_status_check
      CHECK (email_delivery_status IN ('PENDING','SENT','FAILED'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_partner_allocations_email_attempts_check') THEN
    ALTER TABLE ticketing_partner_allocations
      ADD CONSTRAINT ticketing_partner_allocations_email_attempts_check
      CHECK (email_send_attempts >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_tickets_partner_sequence_check') THEN
    ALTER TABLE ticketing_tickets
      ADD CONSTRAINT ticketing_tickets_partner_sequence_check
      CHECK (
        (partner_allocation_id IS NULL AND sequence_number IS NULL AND total_quantity IS NULL)
        OR (
          partner_allocation_id IS NOT NULL
          AND (sequence_number IS NULL OR sequence_number > 0)
          AND (total_quantity IS NULL OR total_quantity > 0)
          AND (sequence_number IS NULL OR total_quantity IS NULL OR sequence_number <= total_quantity)
        )
      );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_partner_ticket_sequence_uidx
  ON ticketing_tickets(partner_allocation_id,sequence_number)
  WHERE partner_allocation_id IS NOT NULL AND sequence_number IS NOT NULL;
