package com.aa.msw.database.helpers.id;

import java.util.UUID;

public class SpotId extends DbSyncedId {
    public SpotId() {
        super();
    }

    public SpotId(final UUID identifier) {
        super(identifier);
    }

    public SpotId(final UUID identifier, boolean isDbSynced) {
        super(identifier, isDbSynced);
    }

    public SpotId(final String identifier) {
        super(UUID.fromString(identifier));
    }
}
