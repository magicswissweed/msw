CREATE TABLE station_table
(
    db_id                             UUID PRIMARY KEY,
    stationId                         INTEGER NOT NULL,
    label                             VARCHAR(255),
    latitude                          DOUBLE PRECISION,
    longitude                         DOUBLE PRECISION
);