package com.aa.msw.database.repository.dao;

import com.aa.msw.database.helpers.UserToSpot;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.helpers.id.UserId;
import com.aa.msw.database.helpers.id.UserToSpotId;

import java.util.Set;

public interface UserToSpotDao extends Dao<UserToSpotId, UserToSpot> {
	Set<SpotId> getSpotIdsForUser (UserId userId);
}
