ALTER TABLE ticketing_invitations
  ADD COLUMN IF NOT EXISTS public_slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS ticketing_invitations_public_slug_uidx
  ON ticketing_invitations(public_slug)
  WHERE public_slug IS NOT NULL;

WITH gala_invitation AS (
  SELECT invitation.id
  FROM ticketing_invitations invitation
  JOIN ticketing_events event ON event.id=invitation.event_id
  WHERE event.slug='nis-gala-2026'
    AND invitation.status='ACTIVE'
    AND invitation.used_count<invitation.max_uses
    AND (invitation.expires_at IS NULL OR invitation.expires_at>NOW())
    AND NOT EXISTS (
      SELECT 1 FROM ticketing_invitations existing
      WHERE existing.public_slug='gala-2026'
    )
  ORDER BY invitation.created_at DESC
  LIMIT 1
)
UPDATE ticketing_invitations invitation
SET public_slug='gala-2026',updated_at=NOW()
FROM gala_invitation
WHERE invitation.id=gala_invitation.id;
