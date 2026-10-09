UPDATE ticketing_invitations AS invitation
SET max_uses = 500,
    updated_at = NOW()
WHERE invitation.public_slug = 'gala-2026'
  AND invitation.event_id = (
    SELECT event.id
    FROM ticketing_events AS event
    WHERE event.slug = 'nis-gala-2026'
  )
  AND invitation.max_uses IS DISTINCT FROM 500;
