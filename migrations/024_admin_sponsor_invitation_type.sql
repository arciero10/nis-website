ALTER TABLE ticketing_manual_issuances
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_invitation_type_check,
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_source_payload_v4_check;

ALTER TABLE ticketing_manual_issuances
  ADD CONSTRAINT ticketing_manual_issuances_invitation_type_check
    CHECK (invitation_type IN ('STANDARD','STAMPA','MEDIA','PRESS','OMAGGIO_NIS','SPONSOR')),
  ADD CONSTRAINT ticketing_manual_issuances_source_payload_v4_check CHECK (
    (source='PAYPAL_CHARITY' AND payment_method='PAYPAL' AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL AND NULLIF(BTRIM(transfer_reference),'') IS NOT NULL)
    OR
    (source='BANK_TRANSFER' AND payment_method='BANK_TRANSFER' AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL)
    OR
    (source='CASH' AND payment_method='CASH' AND invitation_type='STANDARD' AND declared_amount IS NOT NULL AND NULLIF(BTRIM(cash_collector),'') IS NOT NULL
      AND ((cash_collection_status='DA_INCASSARE' AND payment_status='PENDING_COLLECTION' AND cash_authorized_by_staff_id IS NOT NULL AND cash_authorized_at IS NOT NULL AND cash_collected_at IS NULL)
        OR (cash_collection_status='INCASSATO' AND payment_status='VERIFIED_MANUAL' AND cash_collected_by_staff_id IS NOT NULL AND cash_collected_at IS NOT NULL)))
    OR
    (source='ADMIN' AND payment_method='COMPLIMENTARY' AND invitation_type IN ('STAMPA','MEDIA','PRESS','OMAGGIO_NIS','SPONSOR') AND payment_status='NOT_REQUIRED' AND declared_amount IS NULL AND document_storage_key IS NULL AND NULLIF(BTRIM(complimentary_reason_other),'') IS NOT NULL)
  );
