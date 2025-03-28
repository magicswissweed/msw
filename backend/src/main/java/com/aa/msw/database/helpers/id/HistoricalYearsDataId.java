package com.aa.msw.database.helpers.id;

import java.util.UUID;

public class HistoricalYearsDataId extends DbSyncedId {
    public HistoricalYearsDataId() {
        super();
    }

    public HistoricalYearsDataId(final UUID identifier) {
        super(identifier);
    }

    public HistoricalYearsDataId(final String identifier) {
        super(UUID.fromString(identifier));
    }
}
