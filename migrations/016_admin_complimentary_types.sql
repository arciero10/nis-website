ALTER TABLE ticketing_manual_issuances
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_invitation_type_check,
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_source_payload_v3_check;

ALTER TABLE ticketing_tickets
  DROP CONSTRAINT IF EXISTS ticketing_tickets_invitation_type_check;

UPDATE ticketing_manual_issuances
SET invitation_type='OMAGGIO_NIS',updated_at=NOW()
WHERE source='ADMIN' AND invitation_type='OMAGGIO';

UPDATE ticketing_tickets
SET invitation_type='OMAGGIO_NIS',updated_at=NOW()
WHERE issuance_source='ADMIN' AND invitation_type='OMAGGIO';

UPDATE ticketing_tickets
SET category='COMPLIMENTARY',updated_at=NOW()
WHERE issuance_source='ADMIN'
  AND invitation_type IN ('STAMPA','MEDIA','PRESS','OMAGGIO_NIS')
  AND category<>'COMPLIMENTARY';

ALTER TABLE ticketing_manual_issuances
  ADD CONSTRAINT ticketing_manual_issuances_invitation_type_check
    CHECK (invitation_type IN ('STANDARD','STAMPA','MEDIA','PRESS','OMAGGIO_NIS')),
  ADD CONSTRAINT ticketing_manual_issuances_source_payload_v3_check CHECK (
    (source IN ('PAYPAL_CHARITY','BANK_TRANSFER') AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL)
    OR
    (source='ADMIN' AND invitation_type IN ('STAMPA','MEDIA','PRESS','OMAGGIO_NIS') AND payment_status='NOT_REQUIRED' AND declared_amount IS NULL AND document_storage_key IS NULL AND NULLIF(BTRIM(complimentary_reason_other),'') IS NOT NULL)
  );

ALTER TABLE ticketing_tickets
  ADD CONSTRAINT ticketing_tickets_invitation_type_check
    CHECK (invitation_type IN ('STANDARD','SPONSOR','DONATORE','AZIENDA','OSPITE','STAMPA','MEDIA','PRESS','OMAGGIO_NIS'));

