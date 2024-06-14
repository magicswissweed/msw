CREATE TYPE spotType as ENUM (
    'RIVER_SURF',
    'BUNGEE_SURF');

CREATE TABLE spot_table
(
    id        UUID PRIMARY KEY,
    type      spotType NOT NULL,
    stationId INTEGER  NOT NULL,
    name      VARCHAR(255),
    minFlow   INTEGER  NOT NULL,
    maxFlow   INTEGER  NOT NULL
);
