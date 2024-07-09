package com.aa.msw.database.helpers.id;

import java.util.UUID;

public class UserId extends DbSyncedId {
    public UserId() {
        super();
    }

    public UserId(final UUID identifier) {
        super(identifier);
    }

    public UserId(final String identifier) {
        super(UUID.fromString(identifier));
    }
}
