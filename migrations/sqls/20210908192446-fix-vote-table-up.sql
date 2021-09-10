DROP TABLE IF EXISTS vote;

CREATE TABLE vote (
    id              BIGSERIAL PRIMARY KEY,
    person          VARCHAR(100),
    event_date_id   BIGINT REFERENCES event_date (id) ON DELETE CASCADE
);
