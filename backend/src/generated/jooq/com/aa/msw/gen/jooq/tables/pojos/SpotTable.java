/*
 * This file is generated by jOOQ.
 */
package com.aa.msw.gen.jooq.tables.pojos;


import com.aa.msw.gen.jooq.enums.Spottype;

import java.io.Serializable;
import java.util.UUID;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class SpotTable implements Serializable {

    private static final long serialVersionUID = 1L;

    private final UUID id;
    private final Spottype type;
    private final Integer stationid;
    private final String name;
    private final Integer minflow;
    private final Integer maxflow;
    private final Boolean ispublic;

    public SpotTable(SpotTable value) {
        this.id = value.id;
        this.type = value.type;
        this.stationid = value.stationid;
        this.name = value.name;
        this.minflow = value.minflow;
        this.maxflow = value.maxflow;
        this.ispublic = value.ispublic;
    }

    public SpotTable(
        UUID id,
        Spottype type,
        Integer stationid,
        String name,
        Integer minflow,
        Integer maxflow,
        Boolean ispublic
    ) {
        this.id = id;
        this.type = type;
        this.stationid = stationid;
        this.name = name;
        this.minflow = minflow;
        this.maxflow = maxflow;
        this.ispublic = ispublic;
    }

    /**
     * Getter for <code>public.spot_table.id</code>.
     */
    public UUID getId() {
        return this.id;
    }

    /**
     * Getter for <code>public.spot_table.type</code>.
     */
    public Spottype getType() {
        return this.type;
    }

    /**
     * Getter for <code>public.spot_table.stationid</code>.
     */
    public Integer getStationid() {
        return this.stationid;
    }

    /**
     * Getter for <code>public.spot_table.name</code>.
     */
    public String getName() {
        return this.name;
    }

    /**
     * Getter for <code>public.spot_table.minflow</code>.
     */
    public Integer getMinflow() {
        return this.minflow;
    }

    /**
     * Getter for <code>public.spot_table.maxflow</code>.
     */
    public Integer getMaxflow() {
        return this.maxflow;
    }

    /**
     * Getter for <code>public.spot_table.ispublic</code>.
     */
    public Boolean getIspublic() {
        return this.ispublic;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final SpotTable other = (SpotTable) obj;
        if (this.id == null) {
            if (other.id != null)
                return false;
        }
        else if (!this.id.equals(other.id))
            return false;
        if (this.type == null) {
            if (other.type != null)
                return false;
        }
        else if (!this.type.equals(other.type))
            return false;
        if (this.stationid == null) {
            if (other.stationid != null)
                return false;
        }
        else if (!this.stationid.equals(other.stationid))
            return false;
        if (this.name == null) {
            if (other.name != null)
                return false;
        }
        else if (!this.name.equals(other.name))
            return false;
        if (this.minflow == null) {
            if (other.minflow != null)
                return false;
        }
        else if (!this.minflow.equals(other.minflow))
            return false;
        if (this.maxflow == null) {
            if (other.maxflow != null)
                return false;
        }
        else if (!this.maxflow.equals(other.maxflow))
            return false;
        if (this.ispublic == null) {
            if (other.ispublic != null)
                return false;
        }
        else if (!this.ispublic.equals(other.ispublic))
            return false;
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((this.id == null) ? 0 : this.id.hashCode());
        result = prime * result + ((this.type == null) ? 0 : this.type.hashCode());
        result = prime * result + ((this.stationid == null) ? 0 : this.stationid.hashCode());
        result = prime * result + ((this.name == null) ? 0 : this.name.hashCode());
        result = prime * result + ((this.minflow == null) ? 0 : this.minflow.hashCode());
        result = prime * result + ((this.maxflow == null) ? 0 : this.maxflow.hashCode());
        result = prime * result + ((this.ispublic == null) ? 0 : this.ispublic.hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("SpotTable (");

        sb.append(id);
        sb.append(", ").append(type);
        sb.append(", ").append(stationid);
        sb.append(", ").append(name);
        sb.append(", ").append(minflow);
        sb.append(", ").append(maxflow);
        sb.append(", ").append(ispublic);

        sb.append(")");
        return sb.toString();
    }
}
