package com.aa.msw.database.repository.dao;

import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.model.Spot;

import java.util.List;
import java.util.Set;

public interface SpotDao extends Dao<SpotId, Spot> {
    boolean isPublicSpot(SpotId spotId);

    Set<Integer> getAllStationIds();

    List<Spot> getPublicRiverSurfSpots();

    List<Spot> getPublicBungeeSurfSpots();
}
