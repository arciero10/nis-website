ALTER TABLE ticketing_manual_issuances
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS cash_collector TEXT,
  ADD COLUMN IF NOT EXISTS cash_collection_status TEXT,
  ADD COLUMN IF NOT EXISTS cash_authorized_by_staff_id UUID,
  ADD COLUMN IF NOT EXISTS cash_authorized_by_display_name TEXT,
  ADD COLUMN IF NOT EXISTS cash_authorized_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cash_collected_by_staff_id UUID,
  ADD COLUMN IF NOT EXISTS cash_collected_by_display_name TEXT,
  ADD COLUMN IF NOT EXISTS cash_collected_at TIMESTAMPTZ;

UPDATE ticketing_manual_issuances
SET payment_method=CASE source
  WHEN 'PAYPAL_CHARITY' THEN 'PAYPAL'
  WHEN 'BANK_TRANSFER' THEN 'BANK_TRANSFER'
  WHEN 'ADMIN' THEN 'COMPLIMENTARY'
  ELSE payment_method
END
WHERE payment_method IS NULL;

ALTER TABLE ticketing_manual_issuances
  ALTER COLUMN payment_method SET NOT NULL,
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_payment_status_check,
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_source_v3_check,
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_source_payload_v3_check;

ALTER TABLE ticketing_manual_issuances
  ADD CONSTRAINT ticketing_manual_issuances_payment_status_v2_check
    CHECK (payment_status IN ('PENDING_COLLECTION','VERIFIED_MANUAL','NOT_REQUIRED')),
  ADD CONSTRAINT ticketing_manual_issuances_payment_method_check
    CHECK (payment_method IN ('PAYPAL','CASH','BANK_TRANSFER','COMPLIMENTARY')),
  ADD CONSTRAINT ticketing_manual_issuances_cash_collection_status_check
    CHECK (cash_collection_status IS NULL OR cash_collection_status IN ('DA_INCASSARE','INCASSATO')),
  ADD CONSTRAINT ticketing_manual_issuances_source_v4_check
    CHECK (source IN ('PAYPAL_CHARITY','CASH','BANK_TRANSFER','ADMIN')),
  ADD CONSTRAINT ticketing_manual_issuances_source_payload_v4_check CHECK (
    (source='PAYPAL_CHARITY' AND payment_method='PAYPAL' AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL AND NULLIF(BTRIM(transfer_reference),'') IS NOT NULL)
    OR
    (source='BANK_TRANSFER' AND payment_method='BANK_TRANSFER' AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL)
    OR
    (source='CASH' AND payment_method='CASH' AND invitation_type='STANDARD' AND declared_amount IS NOT NULL AND NULLIF(BTRIM(cash_collector),'') IS NOT NULL
      AND ((cash_collection_status='DA_INCASSARE' AND payment_status='PENDING_COLLECTION' AND cash_authorized_by_staff_id IS NOT NULL AND cash_authorized_at IS NOT NULL AND cash_collected_at IS NULL)
        OR (cash_collection_status='INCASSATO' AND payment_status='VERIFIED_MANUAL' AND cash_collected_by_staff_id IS NOT NULL AND cash_collected_at IS NOT NULL)))
    OR
    (source='ADMIN' AND payment_method='COMPLIMENTARY' AND invitation_type IN ('STAMPA','MEDIA','PRESS','OMAGGIO_NIS') AND payment_status='NOT_REQUIRED' AND declared_amount IS NULL AND document_storage_key IS NULL AND NULLIF(BTRIM(complimentary_reason_other),'') IS NOT NULL)
  );

ALTER TABLE ticketing_tickets
  DROP CONSTRAINT IF EXISTS ticketing_tickets_issuance_source_v3_check,
  DROP CONSTRAINT IF EXISTS ticketing_tickets_single_origin_v4_check;

ALTER TABLE ticketing_tickets
  ADD CONSTRAINT ticketing_tickets_issuance_source_v4_check
    CHECK (issuance_source IN ('PAYPAL','PAYPAL_CHARITY','CASH','BANK_TRANSFER','COMPANY','ADMIN')),
  ADD CONSTRAINT ticketing_tickets_single_origin_v5_check CHECK (
    ((order_id IS NOT NULL)::integer + (partner_allocation_id IS NOT NULL)::integer + (manual_issuance_id IS NOT NULL)::integer)=1
    AND (order_id IS NULL OR (issuance_source='PAYPAL' AND invitation_type='STANDARD'))
    AND (partner_allocation_id IS NULL OR (issuance_source='COMPANY' AND invitation_type IN ('SPONSOR','DONATORE','AZIENDA','OSPITE')))
    AND (manual_issuance_id IS NULL OR issuance_source IN ('PAYPAL_CHARITY','CASH','BANK_TRANSFER','ADMIN'))
  );

CREATE INDEX IF NOT EXISTS ticketing_manual_cash_collection_idx
  ON ticketing_manual_issuances(cash_collection_status,created_at DESC)
  WHERE source='CASH';
