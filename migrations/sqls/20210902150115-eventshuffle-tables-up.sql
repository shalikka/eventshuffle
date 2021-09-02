CREATE TABLE event (
    id          BIGINT PRIMARY KEY,
    name        TEXT
);

CREATE TABLE event_date (
    id          BIGINT PRIMARY KEY,
    date        DATE NOT NULL,
    event_id    BIGINT REFERENCES event (id) ON DELETE CASCADE
);

CREATE TABLE vote (
    id          BIGINT PRIMARY KEY,
    person      VARCHAR(100),
    event_id    BIGINT REFERENCES event (id) ON DELETE CASCADE,
    event_date  BIGINT REFERENCES event (id) ON DELETE CASCADE
);
