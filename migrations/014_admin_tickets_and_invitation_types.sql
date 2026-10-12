ALTER TABLE ticketing_manual_issuances
  ADD COLUMN IF NOT EXISTS invitation_type TEXT,
  ADD COLUMN IF NOT EXISTS organization TEXT;

ALTER TABLE ticketing_tickets
  ADD COLUMN IF NOT EXISTS invitation_type TEXT NOT NULL DEFAULT 'STANDARD';

DO $$
DECLARE constraint_row RECORD;
BEGIN
  FOR constraint_row IN
    SELECT conname FROM pg_constraint
    WHERE conrelid='ticketing_manual_issuances'::regclass
      AND contype='c'
      AND pg_get_constraintdef(oid) ILIKE '%COMPLIMENTARY%'
  LOOP
    EXECUTE format('ALTER TABLE ticketing_manual_issuances DROP CONSTRAINT %I',constraint_row.conname);
  END LOOP;
END $$;

ALTER TABLE ticketing_tickets
  DROP CONSTRAINT IF EXISTS ticketing_tickets_issuance_source_check,
  DROP CONSTRAINT IF EXISTS ticketing_tickets_single_origin_v2_check;

UPDATE ticketing_manual_issuances
SET source='ADMIN',invitation_type='OMAGGIO'
WHERE source='COMPLIMENTARY';

UPDATE ticketing_manual_issuances
SET invitation_type='STANDARD'
WHERE source='BANK_TRANSFER' AND invitation_type IS NULL;

UPDATE ticketing_tickets
SET issuance_source='ADMIN',invitation_type='OMAGGIO'
WHERE issuance_source='COMPLIMENTARY';

UPDATE ticketing_tickets ticket
SET invitation_type=allocation.allocation_type
FROM ticketing_partner_allocations allocation
WHERE ticket.partner_allocation_id=allocation.id;

ALTER TABLE ticketing_manual_issuances ALTER COLUMN invitation_type SET NOT NULL;

ALTER TABLE ticketing_manual_issuances
  ADD CONSTRAINT ticketing_manual_issuances_source_v2_check CHECK (source IN ('BANK_TRANSFER','ADMIN')),
  ADD CONSTRAINT ticketing_manual_issuances_invitation_type_check CHECK (invitation_type IN ('STANDARD','STAMPA','MEDIA','PRESS','OMAGGIO')),
  ADD CONSTRAINT ticketing_manual_issuances_source_payload_v2_check CHECK (
    (source='BANK_TRANSFER' AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL)
    OR
    (source='ADMIN' AND invitation_type IN ('STAMPA','MEDIA','PRESS','OMAGGIO') AND payment_status='NOT_REQUIRED' AND declared_amount IS NULL AND document_storage_key IS NULL AND NULLIF(BTRIM(complimentary_reason_other),'') IS NOT NULL)
  );

ALTER TABLE ticketing_tickets
  ADD CONSTRAINT ticketing_tickets_issuance_source_v2_check CHECK (issuance_source IN ('PAYPAL','BANK_TRANSFER','COMPANY','ADMIN')),
  ADD CONSTRAINT ticketing_tickets_invitation_type_check CHECK (invitation_type IN ('STANDARD','SPONSOR','DONATORE','AZIENDA','OSPITE','STAMPA','MEDIA','PRESS','OMAGGIO')),
  ADD CONSTRAINT ticketing_tickets_single_origin_v3_check CHECK (
    ((order_id IS NOT NULL)::integer + (partner_allocation_id IS NOT NULL)::integer + (manual_issuance_id IS NOT NULL)::integer)=1
    AND (order_id IS NULL OR (issuance_source='PAYPAL' AND invitation_type='STANDARD'))
    AND (partner_allocation_id IS NULL OR (issuance_source='COMPANY' AND invitation_type IN ('SPONSOR','DONATORE','AZIENDA','OSPITE')))
    AND (manual_issuance_id IS NULL OR issuance_source IN ('BANK_TRANSFER','ADMIN'))
  );

CREATE INDEX IF NOT EXISTS ticketing_tickets_source_type_idx
  ON ticketing_tickets(event_id,issuance_source,invitation_type,status);
