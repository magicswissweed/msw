/*
 * This file is generated by jOOQ.
 */
package com.aa.msw.gen.jooq.tables.records;


import com.aa.msw.gen.jooq.tables.HistoricalYearsDataTable;

import java.util.UUID;

import org.jooq.JSONB;
import org.jooq.Record1;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class HistoricalYearsDataTableRecord extends UpdatableRecordImpl<HistoricalYearsDataTableRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>public.historical_years_data_table.db_id</code>.
     */
    public HistoricalYearsDataTableRecord setDbId(UUID value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.historical_years_data_table.db_id</code>.
     */
    public UUID getDbId() {
        return (UUID) get(0);
    }

    /**
     * Setter for <code>public.historical_years_data_table.station_id</code>.
     */
    public HistoricalYearsDataTableRecord setStationId(Integer value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.historical_years_data_table.station_id</code>.
     */
    public Integer getStationId() {
        return (Integer) get(1);
    }

    /**
     * Setter for <code>public.historical_years_data_table.median</code>.
     */
    public HistoricalYearsDataTableRecord setMedian(JSONB value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.historical_years_data_table.median</code>.
     */
    public JSONB getMedian() {
        return (JSONB) get(2);
    }

    /**
     * Setter for
     * <code>public.historical_years_data_table.twenty_five_percentile</code>.
     */
    public HistoricalYearsDataTableRecord setTwentyFivePercentile(JSONB value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for
     * <code>public.historical_years_data_table.twenty_five_percentile</code>.
     */
    public JSONB getTwentyFivePercentile() {
        return (JSONB) get(3);
    }

    /**
     * Setter for
     * <code>public.historical_years_data_table.seventy_five_percentile</code>.
     */
    public HistoricalYearsDataTableRecord setSeventyFivePercentile(JSONB value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for
     * <code>public.historical_years_data_table.seventy_five_percentile</code>.
     */
    public JSONB getSeventyFivePercentile() {
        return (JSONB) get(4);
    }

    /**
     * Setter for <code>public.historical_years_data_table.max</code>.
     */
    public HistoricalYearsDataTableRecord setMax(JSONB value) {
        set(5, value);
        return this;
    }

    /**
     * Getter for <code>public.historical_years_data_table.max</code>.
     */
    public JSONB getMax() {
        return (JSONB) get(5);
    }

    /**
     * Setter for <code>public.historical_years_data_table.min</code>.
     */
    public HistoricalYearsDataTableRecord setMin(JSONB value) {
        set(6, value);
        return this;
    }

    /**
     * Getter for <code>public.historical_years_data_table.min</code>.
     */
    public JSONB getMin() {
        return (JSONB) get(6);
    }

    /**
     * Setter for <code>public.historical_years_data_table.current_year</code>.
     */
    public HistoricalYearsDataTableRecord setCurrentYear(JSONB value) {
        set(7, value);
        return this;
    }

    /**
     * Getter for <code>public.historical_years_data_table.current_year</code>.
     */
    public JSONB getCurrentYear() {
        return (JSONB) get(7);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<UUID> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached HistoricalYearsDataTableRecord
     */
    public HistoricalYearsDataTableRecord() {
        super(HistoricalYearsDataTable.HISTORICAL_YEARS_DATA_TABLE);
    }

    /**
     * Create a detached, initialised HistoricalYearsDataTableRecord
     */
    public HistoricalYearsDataTableRecord(UUID dbId, Integer stationId, JSONB median, JSONB twentyFivePercentile, JSONB seventyFivePercentile, JSONB max, JSONB min, JSONB currentYear) {
        super(HistoricalYearsDataTable.HISTORICAL_YEARS_DATA_TABLE);

        setDbId(dbId);
        setStationId(stationId);
        setMedian(median);
        setTwentyFivePercentile(twentyFivePercentile);
        setSeventyFivePercentile(seventyFivePercentile);
        setMax(max);
        setMin(min);
        setCurrentYear(currentYear);
        resetChangedOnNotNull();
    }

    /**
     * Create a detached, initialised HistoricalYearsDataTableRecord
     */
    public HistoricalYearsDataTableRecord(com.aa.msw.gen.jooq.tables.pojos.HistoricalYearsDataTable value) {
        super(HistoricalYearsDataTable.HISTORICAL_YEARS_DATA_TABLE);

        if (value != null) {
            setDbId(value.getDbId());
            setStationId(value.getStationId());
            setMedian(value.getMedian());
            setTwentyFivePercentile(value.getTwentyFivePercentile());
            setSeventyFivePercentile(value.getSeventyFivePercentile());
            setMax(value.getMax());
            setMin(value.getMin());
            setCurrentYear(value.getCurrentYear());
            resetChangedOnNotNull();
        }
    }
}
