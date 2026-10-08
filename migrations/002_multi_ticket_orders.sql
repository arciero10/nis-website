ALTER TABLE ticketing_orders
  ALTER COLUMN attendee_id DROP NOT NULL;

CREATE TABLE IF NOT EXISTS ticketing_order_participants (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES ticketing_orders(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES ticketing_attendees(id) ON DELETE RESTRICT,
  position SMALLINT NOT NULL CHECK (position BETWEEN 1 AND 10),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(order_id,position),
  UNIQUE(order_id,attendee_id)
);

INSERT INTO ticketing_order_participants (
  id,order_id,attendee_id,position,first_name,last_name,email,phone,company,created_at
)
SELECT
  a.id,o.id,a.id,1,a.first_name,a.last_name,a.email,a.phone,a.company,a.created_at
FROM ticketing_orders o
JOIN ticketing_attendees a ON a.id=o.attendee_id
ON CONFLICT (order_id,position) DO NOTHING;

ALTER TABLE ticketing_tickets
  DROP CONSTRAINT IF EXISTS ticketing_tickets_order_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_tickets_order_attendee_uidx
  ON ticketing_tickets(order_id,attendee_id);

CREATE INDEX IF NOT EXISTS ticketing_order_participants_order_idx
  ON ticketing_order_participants(order_id,position);
