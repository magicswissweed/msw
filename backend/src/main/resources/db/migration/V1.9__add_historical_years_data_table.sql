CREATE TABLE historical_years_data_table (
   db_id                            UUID PRIMARY KEY,
   station_id                       INTEGER NOT NULL,
   median                           JSONB NOT NULL,
   twenty_five_percentile           JSONB NOT NULL,
   seventy_five_percentile          JSONB NOT NULL,
   max                              JSONB NOT NULL,
   min                              JSONB NOT NULL,
   current_year                     JSONB NOT NULL
);