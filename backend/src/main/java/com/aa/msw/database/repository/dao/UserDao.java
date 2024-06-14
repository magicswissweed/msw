package com.aa.msw.database.repository.dao;

import com.aa.msw.database.exceptions.NoSuchUserException;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.helpers.id.UserExtId;
import com.aa.msw.database.helpers.id.UserId;
import com.aa.msw.model.User;

import java.util.Set;

public interface UserDao extends Dao<UserId, User> {

	User getUser (UserExtId externalId) throws NoSuchUserException;

	Set<SpotId> getPrivateSpotIds (UserId userId);
}
