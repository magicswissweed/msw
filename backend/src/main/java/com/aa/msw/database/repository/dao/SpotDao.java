package com.aa.msw.database.repository.dao;

import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.model.Spot;

import java.util.Set;

public interface SpotDao extends Dao<SpotId, Spot> {
	Set<Integer> getAllStationIds ();

	Set<Spot> getSpots (Set<SpotId> spotIds);
}
