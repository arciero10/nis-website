CREATE TABLE IF NOT EXISTS nissettone_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  stock_total INTEGER NOT NULL CHECK (stock_total >= 0),
  stock_committed INTEGER NOT NULL DEFAULT 0 CHECK (stock_committed >= 0 AND stock_committed <= stock_total),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','SOLD_OUT','ARCHIVED')),
  available_from TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nissettone_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES nissettone_products(id),
  request_id UUID NOT NULL UNIQUE,
  order_code TEXT NOT NULL UNIQUE,
  public_token TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 250),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  total_cents INTEGER NOT NULL CHECK (total_cents = quantity * unit_price_cents),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('PICKUP','DELIVERY')),
  delivery_street TEXT,
  delivery_house_number TEXT,
  delivery_postcode TEXT,
  delivery_city TEXT,
  delivery_details TEXT,
  delivery_notes TEXT,
  address_verification_status TEXT NOT NULL CHECK (address_verification_status IN ('NOT_REQUIRED','PENDING','APPROVED','REJECTED')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING','PAID','FAILED','REFUNDED','CANCELLED')),
  fulfillment_status TEXT NOT NULL DEFAULT 'TO_PREPARE' CHECK (fulfillment_status IN ('TO_PREPARE','PREPARING','READY_FOR_PICKUP','OUT_FOR_DELIVERY','COMPLETED','CANCELLED')),
  provider TEXT CHECK (provider IS NULL OR provider = 'PAYPAL'),
  provider_environment TEXT CHECK (provider_environment IS NULL OR provider_environment IN ('SANDBOX','LIVE')),
  provider_order_id TEXT UNIQUE,
  provider_capture_id TEXT UNIQUE,
  reservation_expires_at TIMESTAMPTZ,
  stock_committed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (delivery_method = 'PICKUP' OR (delivery_street IS NOT NULL AND delivery_house_number IS NOT NULL AND delivery_postcode IS NOT NULL AND delivery_city IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS nissettone_orders_admin_idx ON nissettone_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS nissettone_orders_payment_idx ON nissettone_orders(payment_status,created_at DESC);
CREATE INDEX IF NOT EXISTS nissettone_orders_fulfillment_idx ON nissettone_orders(fulfillment_status,created_at DESC);
CREATE INDEX IF NOT EXISTS nissettone_orders_reservation_idx ON nissettone_orders(reservation_expires_at) WHERE payment_status = 'PENDING';

CREATE TABLE IF NOT EXISTS nissettone_inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES nissettone_products(id),
  order_id UUID REFERENCES nissettone_orders(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('COMMIT','REFUND','ADJUSTMENT')),
  quantity INTEGER NOT NULL CHECK (quantity <> 0),
  actor TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nissettone_admin_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES nissettone_orders(id),
  product_id UUID REFERENCES nissettone_products(id),
  operator_id UUID NOT NULL,
  operator_name TEXT NOT NULL,
  action TEXT NOT NULL,
  previous_value TEXT,
  next_value TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nissettone_paypal_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  order_id UUID REFERENCES nissettone_orders(id),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nissettone_email_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES nissettone_orders(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('PREORDER','PAID','READY','DELIVERY_UPDATE','CANCELLED','REFUNDED')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SENDING','SENT','FAILED')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  sent_at TIMESTAMPTZ,
  last_error TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(order_id,message_type)
);

INSERT INTO nissettone_products(slug,name,unit_price_cents,currency,stock_total,status,available_from)
VALUES('nissettone-2026','NISSETTONE 2026',5000,'EUR',250,'DRAFT','2026-11-20T00:00:00+01:00')
ON CONFLICT (slug) DO NOTHING;
