CREATE TABLE sample_table
(
    id          UUID PRIMARY KEY,
    stationId   INTEGER NOT NULL,
    timestamp   TIMESTAMP WITH TIME ZONE,
    temperature REAL,
    flow        INTEGER
)