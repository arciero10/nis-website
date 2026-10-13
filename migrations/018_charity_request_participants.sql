ALTER TABLE ticketing_charity_requests
  ADD COLUMN IF NOT EXISTS request_code TEXT,
  ADD COLUMN IF NOT EXISTS admin_email_attempted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_email_last_error TEXT,
  ADD COLUMN IF NOT EXISTS issued_at TIMESTAMPTZ;

UPDATE ticketing_charity_requests
SET request_code='NIS-REQ-' || UPPER(SUBSTRING(REPLACE(id::text,'-','') FROM 1 FOR 8))
WHERE request_code IS NULL;

ALTER TABLE ticketing_charity_requests
  ALTER COLUMN request_code SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_charity_requests_request_code_uidx
  ON ticketing_charity_requests(request_code);

CREATE TABLE IF NOT EXISTS ticketing_charity_request_participants (
  id UUID PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES ticketing_charity_requests(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 10),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(request_id,position)
);

INSERT INTO ticketing_charity_request_participants(id,request_id,position,first_name,last_name)
SELECT gen_random_uuid(),request.id,position.value,request.first_name,request.last_name
FROM ticketing_charity_requests request
CROSS JOIN LATERAL generate_series(1,request.quantity) AS position(value)
WHERE NOT EXISTS (
  SELECT 1 FROM ticketing_charity_request_participants participant
  WHERE participant.request_id=request.id
);

CREATE INDEX IF NOT EXISTS ticketing_charity_request_participants_request_idx
  ON ticketing_charity_request_participants(request_id,position);
