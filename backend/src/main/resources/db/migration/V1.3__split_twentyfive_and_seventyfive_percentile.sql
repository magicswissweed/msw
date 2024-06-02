ALTER TABLE forecast_table DROP COLUMN twentyfivetoseventyfivepercentile;
ALTER TABLE forecast_table ADD COLUMN twentyFivePercentile JSONB;
ALTER TABLE forecast_table ADD COLUMN seventyFivePercentile JSONB;
