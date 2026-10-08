CREATE TABLE IF NOT EXISTS ticketing_events (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT,
  event_date TIMESTAMPTZ,
  doors_open_at TIMESTAMPTZ,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  currency CHAR(3) NOT NULL CHECK (currency = 'EUR'),
  capacity INTEGER CHECK (capacity IS NULL OR capacity > 0),
  status TEXT NOT NULL CHECK (status IN ('DRAFT','ANNOUNCED','PUBLISHED','SOLD_OUT','CANCELLED','COMPLETED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticketing_invitations (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE CASCADE,
  access_token_hash CHAR(64) NOT NULL UNIQUE,
  label TEXT NOT NULL,
  max_uses INTEGER NOT NULL CHECK (max_uses > 0),
  used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0 AND used_count <= max_uses),
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE','DISABLED','EXPIRED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticketing_attendees (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticketing_orders (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  attendee_id UUID NOT NULL REFERENCES ticketing_attendees(id) ON DELETE RESTRICT,
  invitation_id UUID NOT NULL REFERENCES ticketing_invitations(id) ON DELETE RESTRICT,
  request_id UUID NOT NULL UNIQUE,
  provider TEXT NOT NULL CHECK (provider = 'PAYPAL'),
  provider_order_id TEXT UNIQUE,
  provider_capture_id TEXT UNIQUE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  currency CHAR(3) NOT NULL CHECK (currency = 'EUR'),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('PENDING','PAID','FAILED','REFUNDED','CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ticketing_tickets (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES ticketing_events(id) ON DELETE RESTRICT,
  attendee_id UUID NOT NULL REFERENCES ticketing_attendees(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL UNIQUE REFERENCES ticketing_orders(id) ON DELETE RESTRICT,
  ticket_code TEXT NOT NULL UNIQUE,
  qr_token TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('STANDARD','VIP','PARTNER','SPONSOR','STAFF','ARTIST','PRESS','COMPLIMENTARY')),
  access_mode TEXT NOT NULL CHECK (access_mode IN ('ONE_SHOT','MULTI_ENTRY')),
  status TEXT NOT NULL CHECK (status IN ('ACTIVE','USED','CANCELLED','REFUNDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_check_in_at TIMESTAMPTZ,
  last_check_in_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ticketing_check_ins (
  id UUID PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES ticketing_tickets(id) ON DELETE RESTRICT,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result TEXT NOT NULL CHECK (result IN ('ALLOWED','ALREADY_USED','INVALID','CANCELLED'))
);

CREATE INDEX IF NOT EXISTS ticketing_orders_event_status_idx ON ticketing_orders(event_id,payment_status);
CREATE INDEX IF NOT EXISTS ticketing_tickets_event_status_idx ON ticketing_tickets(event_id,status);
CREATE INDEX IF NOT EXISTS ticketing_check_ins_ticket_idx ON ticketing_check_ins(ticket_id,checked_in_at);

INSERT INTO ticketing_events (
  id,slug,title,description,price,currency,capacity,status,created_at,updated_at
) VALUES (
  '5e57f9a1-0c89-4eb9-a44b-07cd67c2a601',
  'nis-gala-2026',
  'NIS Gala Charity Night',
  'Evento charity della Nazionale Italiana Sanitari.',
  200.00,
  'EUR',
  NULL,
  'ANNOUNCED',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title,
  description=EXCLUDED.description,
  price=EXCLUDED.price,
  currency=EXCLUDED.currency,
  updated_at=NOW();
