package com.aa.msw.model;

import com.aa.msw.database.helpers.id.HasId;
import com.aa.msw.database.helpers.id.UserExtId;
import com.aa.msw.database.helpers.id.UserId;

public record User(
		UserId userId,
		UserExtId externalId,
		String email,
		String username
) implements HasId<UserId> {
	@Override
	public UserId getId () {
		return userId;
	}
}
