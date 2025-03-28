package com.aa.msw.database.helpers.id;

import java.util.UUID;

public class StationId extends DbSyncedId {
    public StationId() {
        super();
    }

    public StationId(final UUID identifier) {
        super(identifier);
    }

    public StationId(final String identifier) {
        super(UUID.fromString(identifier));
    }
}
