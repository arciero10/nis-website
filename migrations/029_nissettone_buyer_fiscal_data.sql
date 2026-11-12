ALTER TABLE nissettone_orders
  ADD COLUMN IF NOT EXISTS buyer_type TEXT,
  ADD COLUMN IF NOT EXISTS legal_name TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_code TEXT,
  ADD COLUMN IF NOT EXISTS vat_number TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_street TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_house_number TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_postcode TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_city TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_province TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_country TEXT,
  ADD COLUMN IF NOT EXISTS sdi_code TEXT,
  ADD COLUMN IF NOT EXISTS pec TEXT,
  ADD COLUMN IF NOT EXISTS administrative_email TEXT,
  ADD COLUMN IF NOT EXISTS invoice_requested BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS document_status TEXT NOT NULL DEFAULT 'NOT_REQUESTED',
  ADD COLUMN IF NOT EXISTS document_number TEXT,
  ADD COLUMN IF NOT EXISTS document_date DATE,
  ADD COLUMN IF NOT EXISTS administrative_notes TEXT;

ALTER TABLE nissettone_orders
  ADD CONSTRAINT nissettone_orders_buyer_type_check
    CHECK (buyer_type IN ('PRIVATE','ORGANIZATION')),
  ADD CONSTRAINT nissettone_orders_document_status_check
    CHECK (document_status IN ('NOT_REQUESTED','REQUESTED','TO_REVIEW','ISSUED','NOT_DUE','CANCELLED'));

CREATE INDEX IF NOT EXISTS nissettone_orders_buyer_type_idx
  ON nissettone_orders(buyer_type,created_at DESC);

CREATE INDEX IF NOT EXISTS nissettone_orders_document_status_idx
  ON nissettone_orders(document_status,created_at DESC);

UPDATE nissettone_products p
SET unit_price_cents=5500,
    updated_at=NOW()
WHERE p.slug='nissettone-2026'
  AND p.status='DRAFT'
  AND p.stock_committed=0
  AND NOT EXISTS (
    SELECT 1 FROM nissettone_orders o WHERE o.product_id=p.id
  );
