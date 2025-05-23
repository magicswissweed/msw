/*
 * This file is generated by jOOQ.
 */
package com.aa.msw.gen.jooq.tables.records;


import com.aa.msw.gen.jooq.tables.StationTable;

import java.util.UUID;

import org.jooq.Record1;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class StationTableRecord extends UpdatableRecordImpl<StationTableRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>public.station_table.db_id</code>.
     */
    public StationTableRecord setDbId(UUID value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>public.station_table.db_id</code>.
     */
    public UUID getDbId() {
        return (UUID) get(0);
    }

    /**
     * Setter for <code>public.station_table.stationid</code>.
     */
    public StationTableRecord setStationid(Integer value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for <code>public.station_table.stationid</code>.
     */
    public Integer getStationid() {
        return (Integer) get(1);
    }

    /**
     * Setter for <code>public.station_table.label</code>.
     */
    public StationTableRecord setLabel(String value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>public.station_table.label</code>.
     */
    public String getLabel() {
        return (String) get(2);
    }

    /**
     * Setter for <code>public.station_table.latitude</code>.
     */
    public StationTableRecord setLatitude(Double value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for <code>public.station_table.latitude</code>.
     */
    public Double getLatitude() {
        return (Double) get(3);
    }

    /**
     * Setter for <code>public.station_table.longitude</code>.
     */
    public StationTableRecord setLongitude(Double value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for <code>public.station_table.longitude</code>.
     */
    public Double getLongitude() {
        return (Double) get(4);
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
     * Create a detached StationTableRecord
     */
    public StationTableRecord() {
        super(StationTable.STATION_TABLE);
    }

    /**
     * Create a detached, initialised StationTableRecord
     */
    public StationTableRecord(UUID dbId, Integer stationid, String label, Double latitude, Double longitude) {
        super(StationTable.STATION_TABLE);

        setDbId(dbId);
        setStationid(stationid);
        setLabel(label);
        setLatitude(latitude);
        setLongitude(longitude);
        resetChangedOnNotNull();
    }

    /**
     * Create a detached, initialised StationTableRecord
     */
    public StationTableRecord(com.aa.msw.gen.jooq.tables.pojos.StationTable value) {
        super(StationTable.STATION_TABLE);

        if (value != null) {
            setDbId(value.getDbId());
            setStationid(value.getStationid());
            setLabel(value.getLabel());
            setLatitude(value.getLatitude());
            setLongitude(value.getLongitude());
            resetChangedOnNotNull();
        }
    }
}
