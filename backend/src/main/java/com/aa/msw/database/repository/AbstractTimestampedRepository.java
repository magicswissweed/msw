package com.aa.msw.database.repository;

import com.aa.msw.database.helpers.id.DbSyncedId;
import com.aa.msw.database.helpers.id.HasId;
import com.aa.msw.database.repository.dao.TimestampedDao;
import org.jooq.*;
import org.jooq.impl.DSL;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.UUID;

public abstract class AbstractTimestampedRepository<ID extends DbSyncedId,
        DOMAIN extends HasId<ID>,
        RECORD extends UpdatableRecord<RECORD>,
        ENTITY extends Serializable,
        D extends DAO<RECORD, ENTITY, UUID>>
        extends AbstractRepository<ID, DOMAIN, RECORD, ENTITY, D>
        implements TimestampedDao {

    private final TableField<RECORD, OffsetDateTime> timestampField;

    public AbstractTimestampedRepository(DSLContext dsl,
                                         D dao,
                                         Table<RECORD> table,
                                         TableField<RECORD, UUID> idField,
                                         TableField<RECORD, OffsetDateTime> timestampField) {
        super(dsl, dao, table, idField);
        this.timestampField = timestampField;
    }

    @Override
    public void deleteEventsOlderThanXDaysForEventType(int days) {
        dsl.deleteFrom(table)
                .where(timestampField.lessThan(DSL.offsetDateTime(OffsetDateTime.now().minusDays(days))))
                .execute();
    }
}
