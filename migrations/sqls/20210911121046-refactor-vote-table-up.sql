DELETE FROM event;

ALTER TABLE vote
    ALTER COLUMN person SET NOT NULL;

ALTER TABLE vote
    ADD CONSTRAINT person_event_date_id UNIQUE (person, event_date_id);
