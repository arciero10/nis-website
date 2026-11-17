DO $$
DECLARE
  product_record nissettone_products%ROWTYPE;
BEGIN
  SELECT *
  INTO product_record
  FROM nissettone_products
  WHERE slug='nissettone-2026'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Prodotto nissettone-2026 non trovato';
  END IF;

  IF product_record.status <> 'DRAFT' THEN
    RAISE EXCEPTION 'NISSETTONE deve essere DRAFT prima della migration 030 (stato: %)', product_record.status;
  END IF;

  IF product_record.currency <> 'EUR' THEN
    RAISE EXCEPTION 'Valuta NISSETTONE non compatibile: %', product_record.currency;
  END IF;

  IF product_record.unit_price_cents NOT IN (4900,5200,5500) THEN
    RAISE EXCEPTION 'Prezzo NISSETTONE inatteso: % centesimi', product_record.unit_price_cents;
  END IF;

  IF product_record.stock_total <> 250
     OR product_record.stock_committed < 0
     OR product_record.stock_committed > product_record.stock_total THEN
    RAISE EXCEPTION 'Inventario NISSETTONE non coerente (totale %, impegnato %)',
      product_record.stock_total,
      product_record.stock_committed;
  END IF;

  UPDATE nissettone_products
  SET unit_price_cents=5200,
      status='DRAFT',
      updated_at=NOW()
  WHERE id=product_record.id;
END $$;
