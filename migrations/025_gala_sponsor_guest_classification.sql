ALTER TABLE ticketing_manual_issuances
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_invitation_type_check,
  DROP CONSTRAINT IF EXISTS ticketing_manual_issuances_source_payload_v4_check;

ALTER TABLE ticketing_manual_issuances
  ADD CONSTRAINT ticketing_manual_issuances_invitation_type_check
    CHECK (invitation_type IN ('STANDARD','STAMPA','MEDIA','PRESS','OMAGGIO_NIS','SPONSOR','OSPITE')),
  ADD CONSTRAINT ticketing_manual_issuances_source_payload_v4_check CHECK (
    (source='PAYPAL_CHARITY' AND payment_method='PAYPAL' AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL AND NULLIF(BTRIM(transfer_reference),'') IS NOT NULL)
    OR
    (source='BANK_TRANSFER' AND payment_method='BANK_TRANSFER' AND invitation_type='STANDARD' AND payment_status='VERIFIED_MANUAL' AND declared_amount IS NOT NULL)
    OR
    (source='CASH' AND payment_method='CASH' AND invitation_type='STANDARD' AND declared_amount IS NOT NULL AND NULLIF(BTRIM(cash_collector),'') IS NOT NULL
      AND ((cash_collection_status='DA_INCASSARE' AND payment_status='PENDING_COLLECTION' AND cash_authorized_by_staff_id IS NOT NULL AND cash_authorized_at IS NOT NULL AND cash_collected_at IS NULL)
        OR (cash_collection_status='INCASSATO' AND payment_status='VERIFIED_MANUAL' AND cash_collected_by_staff_id IS NOT NULL AND cash_collected_at IS NOT NULL)))
    OR
    (source='ADMIN' AND payment_method='COMPLIMENTARY' AND invitation_type IN ('STAMPA','MEDIA','PRESS','OMAGGIO_NIS','SPONSOR','OSPITE') AND payment_status='NOT_REQUIRED' AND declared_amount IS NULL AND document_storage_key IS NULL AND NULLIF(BTRIM(complimentary_reason_other),'') IS NOT NULL)
  );

DO $$
DECLARE
  guest_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO guest_count
  FROM ticketing_tickets ticket
  JOIN ticketing_attendees attendee ON attendee.id=ticket.attendee_id
  WHERE ticket.ticket_code IN ('NIS26-J8BQ7EMR','NIS26-EJ93G6D6','NIS26-Q32P8CJ4','NIS26-74QGRZ37','NIS26-FE6RSYGL')
    AND ticket.status='ACTIVE'
    AND ticket.issuance_source='ADMIN'
    AND ticket.manual_issuance_id IS NOT NULL
    AND (ticket.ticket_code,LOWER(attendee.email),attendee.first_name,attendee.last_name) IN (
      ('NIS26-J8BQ7EMR','riccardometello@gmail.com','Adriana','Biondi'),
      ('NIS26-EJ93G6D6','andbors@hotmail.com','Andrea','Borsetti'),
      ('NIS26-Q32P8CJ4','vasco.90@tiscali.it','Vasco Maria','Garzoni Provenzani'),
      ('NIS26-74QGRZ37','lorenzoesposito480@gmail.com','Lorenzo','Esposito'),
      ('NIS26-FE6RSYGL','tommaso.amadei@me.com','Tommaso','Amadei')
    );
  IF guest_count<>5 THEN
    RAISE EXCEPTION 'Expected 5 exact active AnotherStudio guest tickets, found %',guest_count;
  END IF;
END $$;

UPDATE ticketing_partner_allocations
SET allocation_type='SPONSOR',updated_at=NOW()
WHERE company_name='ITALIAN PATHOLOGY & GENOMICS'
  AND status='ACTIVE'
  AND allocation_type='AZIENDA';

UPDATE ticketing_tickets ticket
SET invitation_type='SPONSOR',updated_at=NOW()
FROM ticketing_partner_allocations allocation
WHERE ticket.partner_allocation_id=allocation.id
  AND allocation.company_name='ITALIAN PATHOLOGY & GENOMICS'
  AND allocation.status='ACTIVE'
  AND ticket.status IN ('ACTIVE','USED')
  AND ticket.invitation_type='AZIENDA';

UPDATE ticketing_attendees attendee
SET company='AnotherStudio',updated_at=NOW()
FROM ticketing_tickets ticket
WHERE ticket.attendee_id=attendee.id
  AND ticket.ticket_code IN ('NIS26-J8BQ7EMR','NIS26-EJ93G6D6','NIS26-Q32P8CJ4','NIS26-74QGRZ37','NIS26-FE6RSYGL')
  AND ticket.status='ACTIVE';

UPDATE ticketing_manual_issuances issuance
SET invitation_type='OSPITE',organization='AnotherStudio',updated_at=NOW()
FROM ticketing_tickets ticket
WHERE ticket.manual_issuance_id=issuance.id
  AND ticket.ticket_code IN ('NIS26-J8BQ7EMR','NIS26-EJ93G6D6','NIS26-Q32P8CJ4','NIS26-74QGRZ37','NIS26-FE6RSYGL')
  AND ticket.status='ACTIVE';

UPDATE ticketing_tickets
SET invitation_type='OSPITE',updated_at=NOW()
WHERE ticket_code IN ('NIS26-J8BQ7EMR','NIS26-EJ93G6D6','NIS26-Q32P8CJ4','NIS26-74QGRZ37','NIS26-FE6RSYGL')
  AND status='ACTIVE'
  AND issuance_source='ADMIN';
