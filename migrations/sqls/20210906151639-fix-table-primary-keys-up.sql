DROP TABLE IF EXISTS event_date,
    vote,
    event;

CREATE TABLE event (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT
);

CREATE TABLE event_date (
    id          BIGSERIAL PRIMARY KEY,
    date        DATE NOT NULL,
    event_id    BIGINT REFERENCES event (id) ON DELETE CASCADE
);

CREATE TABLE vote (
    id          BIGSERIAL PRIMARY KEY,
    person      VARCHAR(100),
    event_id    BIGINT REFERENCES event (id) ON DELETE CASCADE,
    event_date  BIGINT REFERENCES event (id) ON DELETE CASCADE
);
