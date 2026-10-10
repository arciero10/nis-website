ALTER TABLE ticketing_partner_allocations
  ADD COLUMN IF NOT EXISTS allocation_type TEXT NOT NULL DEFAULT 'AZIENDA';

UPDATE ticketing_partner_allocations
SET allocation_type='AZIENDA'
WHERE allocation_type IS NULL OR allocation_type NOT IN ('SPONSOR','DONATORE','AZIENDA','OSPITE');

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='ticketing_partner_allocations_type_check') THEN
    ALTER TABLE ticketing_partner_allocations
      ADD CONSTRAINT ticketing_partner_allocations_type_check
      CHECK (allocation_type IN ('SPONSOR','DONATORE','AZIENDA','OSPITE'));
  END IF;
END $$;

