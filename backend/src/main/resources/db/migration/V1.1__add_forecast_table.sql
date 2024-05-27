CREATE TABLE forecast_table
(
    id                                  UUID PRIMARY KEY,
    stationId                           INTEGER NOT NULL,
    measuredData                        JSONB,
    median                              JSONB,
    twentyFiveToSeventyFivePercentile   JSONB,
    max                                 JSONB,
    min                                 JSONB
);