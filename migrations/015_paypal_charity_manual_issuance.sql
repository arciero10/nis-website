ALTER TABLE ticketing_manual_issuances
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_source_v2_check,
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_source_payload_v2_check;

ALTER TABLE ticketing_tickets
  DROP CONSTRAINT IF EXISTS ticketing_tickets_issuance_source_v2_check,
  DROP CONSTRAINT IF EXISTS ticketing_tickets_single_origin_v3_check;

ALTER TABLE ticketing_manual_issuances
  ADD CONSTRAINT ticketing_manual_issuances_source_v3_check
    CHECK (source IN ('PAYPAL_CHARITY','BANK_TRANSFER','ADMIN')),
  ADD CONSTRAINT ticketing_manual_issuances_source_payload_v3_check CHECK (
    (source IN ('PAYPAL_CHARITY','BANK_TRANSFER') AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL)
    OR
    (source='ADMIN' AND invitation_type IN ('STAMPA','MEDIA','PRESS','OMAGGIO') AND payment_status='NOT_REQUIRED' AND declared_amount IS NULL AND document_storage_key IS NULL AND NULLIF(BTRIM(complimentary_reason_other),'') IS NOT NULL)
  );

ALTER TABLE ticketing_tickets
  ADD CONSTRAINT ticketing_tickets_issuance_source_v3_check
    CHECK (issuance_source IN ('PAYPAL','PAYPAL_CHARITY','BANK_TRANSFER','COMPANY','ADMIN')),
  ADD CONSTRAINT ticketing_tickets_single_origin_v4_check CHECK (
    ((order_id IS NOT NULL)::integer + (partner_allocation_id IS NOT NULL)::integer + (manual_issuance_id IS NOT NULL)::integer)=1
    AND (order_id IS NULL OR (issuance_source='PAYPAL' AND invitation_type='STANDARD'))
    AND (partner_allocation_id IS NULL OR (issuance_source='COMPANY' AND invitation_type IN ('SPONSOR','DONATORE','AZIENDA','OSPITE')))
    AND (manual_issuance_id IS NULL OR issuance_source IN ('PAYPAL_CHARITY','BANK_TRANSFER','ADMIN'))
  );
