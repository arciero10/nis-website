ALTER TABLE ticketing_orders
  ADD COLUMN IF NOT EXISTS provider_environment TEXT;

-- Tutti gli ordini precedenti a questa migration sono certamente Sandbox:
-- fino a questo punto il client PayPal rifiutava ogni PAYPAL_ENV diverso da sandbox.
UPDATE ticketing_orders
SET provider_environment='SANDBOX'
WHERE provider='PAYPAL'
  AND provider_environment IS NULL;

ALTER TABLE ticketing_orders
  ALTER COLUMN provider_environment SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname='ticketing_orders_provider_environment_check'
  ) THEN
    ALTER TABLE ticketing_orders
      ADD CONSTRAINT ticketing_orders_provider_environment_check
      CHECK (provider_environment IN ('SANDBOX','LIVE'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ticketing_orders_provider_environment_idx
  ON ticketing_orders(provider,provider_environment,created_at);
