package com.aa.msw.database.helpers.id;

import com.aa.msw.database.helpers.AbstractUUID;

import java.io.Serializable;
import java.util.UUID;

public class DbSyncedId extends AbstractUUID implements Serializable {

    private final boolean dbSynced;

    private DbSyncedId(UUID identifier, boolean dbSynced) {
        super(identifier);
        this.dbSynced = dbSynced;
    }

    public DbSyncedId() {
        this(UUID.randomUUID(), false);
    }

    public DbSyncedId(UUID identifier) {
        this(identifier, true);
    }

    public boolean isDbSynced() {
        return dbSynced;
    }
}
