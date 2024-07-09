package com.aa.msw.database.helpers.id;

import java.util.UUID;

public class ForecastId extends DbSyncedId {
    public ForecastId() {
        super();
    }

    public ForecastId(final UUID identifier) {
        super(identifier);
    }

    public ForecastId(final String identifier) {
        super(UUID.fromString(identifier));
    }
}
