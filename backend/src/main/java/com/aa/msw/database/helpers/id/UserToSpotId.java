package com.aa.msw.database.helpers.id;

import java.util.UUID;

public class UserToSpotId extends DbSyncedId {
    public UserToSpotId() {
        super();
    }

    public UserToSpotId(final UUID identifier) {
        super(identifier);
    }

    public UserToSpotId(final String identifier) {
        super(UUID.fromString(identifier));
    }
}
