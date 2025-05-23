/*
 * This file is generated by jOOQ.
 */
package com.aa.msw.gen.jooq.tables.pojos;


import java.io.Serializable;
import java.util.UUID;

import org.jooq.JSONB;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class Last_40DaysSamplesTable implements Serializable {

    private static final long serialVersionUID = 1L;

    private final UUID dbId;
    private final Integer stationId;
    private final JSONB last40dayssamples;

    public Last_40DaysSamplesTable(Last_40DaysSamplesTable value) {
        this.dbId = value.dbId;
        this.stationId = value.stationId;
        this.last40dayssamples = value.last40dayssamples;
    }

    public Last_40DaysSamplesTable(
        UUID dbId,
        Integer stationId,
        JSONB last40dayssamples
    ) {
        this.dbId = dbId;
        this.stationId = stationId;
        this.last40dayssamples = last40dayssamples;
    }

    /**
     * Getter for <code>public.last_40_days_samples_table.db_id</code>.
     */
    public UUID getDbId() {
        return this.dbId;
    }

    /**
     * Getter for <code>public.last_40_days_samples_table.station_id</code>.
     */
    public Integer getStationId() {
        return this.stationId;
    }

    /**
     * Getter for
     * <code>public.last_40_days_samples_table.last40dayssamples</code>.
     */
    public JSONB getLast40dayssamples() {
        return this.last40dayssamples;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final Last_40DaysSamplesTable other = (Last_40DaysSamplesTable) obj;
        if (this.dbId == null) {
            if (other.dbId != null)
                return false;
        }
        else if (!this.dbId.equals(other.dbId))
            return false;
        if (this.stationId == null) {
            if (other.stationId != null)
                return false;
        }
        else if (!this.stationId.equals(other.stationId))
            return false;
        if (this.last40dayssamples == null) {
            if (other.last40dayssamples != null)
                return false;
        }
        else if (!this.last40dayssamples.equals(other.last40dayssamples))
            return false;
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((this.dbId == null) ? 0 : this.dbId.hashCode());
        result = prime * result + ((this.stationId == null) ? 0 : this.stationId.hashCode());
        result = prime * result + ((this.last40dayssamples == null) ? 0 : this.last40dayssamples.hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Last_40DaysSamplesTable (");

        sb.append(dbId);
        sb.append(", ").append(stationId);
        sb.append(", ").append(last40dayssamples);

        sb.append(")");
        return sb.toString();
    }
}
