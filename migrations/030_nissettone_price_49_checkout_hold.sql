UPDATE nissettone_products
SET unit_price_cents=4900,
    status='DRAFT',
    updated_at=NOW()
WHERE slug='nissettone-2026'
  AND unit_price_cents=5500;
