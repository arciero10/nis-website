UPDATE ticketing_events
SET capacity = 300,
    updated_at = NOW()
WHERE slug = 'nis-gala-2026'
  AND capacity IS DISTINCT FROM 300;
