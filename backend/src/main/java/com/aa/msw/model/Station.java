package com.aa.msw.model;

import com.aa.msw.database.helpers.id.HasId;
import com.aa.msw.database.helpers.id.StationId;

public record Station(
        StationId databaseId,
        Integer stationId,
        String label,
        Double latitude,
        Double longitude) implements HasId<StationId> {
    @Override
    public StationId getId() {
        return databaseId;
    }
}
