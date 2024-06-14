package com.aa.msw.database.helpers;

import com.aa.msw.database.helpers.id.HasId;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.helpers.id.UserId;
import com.aa.msw.database.helpers.id.UserToSpotId;

public record UserToSpot(UserToSpotId userToSpotId, UserId userId, SpotId spotId) implements HasId<UserToSpotId> {
	@Override
	public UserToSpotId getId () {
		return userToSpotId;
	}
}
