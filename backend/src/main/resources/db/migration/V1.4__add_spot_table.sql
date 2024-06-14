CREATE TABLE spot_table
(
    id                                  UUID PRIMARY KEY,
    stationId                           INTEGER NOT NULL,
    name                                VARCHAR(255),
    minFlow                             INTEGER NOT NULL,
    maxFlow                             INTEGER NOT NULL
);
