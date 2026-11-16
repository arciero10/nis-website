UPDATE nissettone_products
SET unit_price_cents=5200,
    status='DRAFT',
    updated_at=NOW()
WHERE slug='nissettone-2026'
  AND unit_price_cents IN (4900,5500);
