package com.aa.msw.database.helpers.id;

import java.util.UUID;

public class SampleId extends DbSyncedId {
    public SampleId() {
        super();
    }

    public SampleId(final UUID identifier) {
        super(identifier);
    }

    public SampleId(final String identifier) {
        super(UUID.fromString(identifier));
    }
}
