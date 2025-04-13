CREATE TABLE last_40_days_samples_table
(
    db_id             UUID PRIMARY KEY,
    station_id        INTEGER NOT NULL,
    last40DaysSamples JSONB   NOT NULL
);