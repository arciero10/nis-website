CREATE TABLE IF NOT EXISTS ticketing_staff_sessions (
  id UUID PRIMARY KEY,
  token_hash CHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS ticketing_staff_sessions_active_idx
  ON ticketing_staff_sessions(expires_at)
  WHERE revoked_at IS NULL;
