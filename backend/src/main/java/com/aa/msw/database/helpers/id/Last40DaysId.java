package com.aa.msw.database.helpers.id;

import java.util.UUID;

public class Last40DaysId extends DbSyncedId {
    public Last40DaysId() {
        super();
    }

    public Last40DaysId(final UUID identifier) {
        super(identifier);
    }

    public Last40DaysId(final String identifier) {
        super(UUID.fromString(identifier));
    }
}
