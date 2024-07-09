package com.aa.msw.database.repository;

import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.database.helpers.UserToSpot;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.helpers.id.UserId;
import com.aa.msw.database.helpers.id.UserToSpotId;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.database.repository.dao.UserToSpotDao;
import com.aa.msw.gen.jooq.tables.UserToSpotTable;
import com.aa.msw.gen.jooq.tables.daos.UserToSpotTableDao;
import com.aa.msw.gen.jooq.tables.records.UserToSpotTableRecord;
import com.aa.msw.model.Spot;
import com.aa.msw.model.UserSpot;
import org.jooq.DSLContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class UserToSpotRepository extends AbstractRepository<UserToSpotId, UserToSpot, UserToSpotTableRecord, com.aa.msw.gen.jooq.tables.pojos.UserToSpotTable, UserToSpotTableDao>
        implements UserToSpotDao {

    private static final UserToSpotTable TABLE = UserToSpotTable.USER_TO_SPOT_TABLE;
    private final SpotDao spotDao;

    public UserToSpotRepository(final DSLContext dsl, SpotDao spotDao) {
        super(dsl, new UserToSpotTableDao(dsl.configuration()), TABLE, TABLE.ID);
        this.spotDao = spotDao;
    }

    @Override
    @Transactional
    public void addPrivateSpot(Spot spot, int position) {
        spotDao.persist(spot);
        persist(
                new UserToSpot(
                        new UserToSpotId(),
                        UserContext.getCurrentUser().userId(),
                        spot.spotId(),
                        position
                ));
    }

    @Override
    @Transactional
    public List<UserSpot> getUserSpotsOrdered(UserId userId) {
        mapPublicSpotsToUserIfNotMapped(userId);

        return dsl.selectFrom(TABLE)
                .where(TABLE.USER_ID.eq(userId.getId()))
                .orderBy(TABLE.POSITION)
                .fetch(this::mapRecord)
                .stream()
                .map(userToSpot -> new UserSpot(userToSpot.position(), spotDao.get(userToSpot.spotId())))
                .sorted(Comparator.comparingInt(UserSpot::position))
                .collect(Collectors.toList());
    }

    @Transactional
    public void mapPublicSpotsToUserIfNotMapped(UserId userId) {
        mapPublicSpotsToUserIfNotMapped(userId, spotDao.getPublicRiverSurfSpots());
        mapPublicSpotsToUserIfNotMapped(userId, spotDao.getPublicBungeeSurfSpots());
    }

    @Transactional
    public void mapPublicSpotsToUserIfNotMapped(UserId userId, List<Spot> publicSpots) {
        List<SpotId> mappedSpotIds = dsl.selectFrom(TABLE)
                .where(TABLE.USER_ID.eq(userId.getId()))
                .fetch(this::mapRecord)
                .stream()
                .map(UserToSpot::spotId)
                .toList();

        for (Spot publicSpot : publicSpots) {
            if (!mappedSpotIds.contains(publicSpot.getId())) {
                persist(new UserToSpot(new UserToSpotId(), userId, publicSpot.getId(), 0));
            }
        }
    }

    @Override
    public void setPosition(SpotId spotId, int position) {
        UserId userId = UserContext.getCurrentUser().userId();

        dsl.update(TABLE)
                .set(TABLE.POSITION, position)
                .where(TABLE.USER_ID.eq(userId.getId())
                        .and(TABLE.SPOT_ID.eq(spotId.getId())))
                .execute();
    }

    @Override
    @Transactional
    // this only deletes the mapping from the user to the spot. The spot stays in the db.
    public void deletePrivateSpot(SpotId spotId) {
        dsl.deleteFrom(TABLE)
                .where(TABLE.SPOT_ID.eq(spotId.getId())
                        .and(TABLE.USER_ID.eq(UserContext.getCurrentUser().userId().getId())))
                .execute();
    }

    @Override
    protected UserToSpot mapRecord(UserToSpotTableRecord record) {
        return new UserToSpot(
                new UserToSpotId(record.getId()),
                new UserId(record.getUserId()),
                new SpotId(record.getSpotId()),
                record.getPosition()
        );
    }

    @Override
    protected UserToSpotTableRecord mapDomain(UserToSpot userToSpot) {
        UserToSpotTableRecord record = dsl.newRecord(TABLE);
        record.setId(userToSpot.getId().getId());
        record.setUserId(userToSpot.userId().getId());
        record.setSpotId(userToSpot.spotId().getId());
        record.setPosition(userToSpot.position());
        return record;
    }

    @Override
    protected UserToSpot mapEntity(com.aa.msw.gen.jooq.tables.pojos.UserToSpotTable userToSpotTable) {
        return new UserToSpot(
                new UserToSpotId(userToSpotTable.getId()),
                new UserId(userToSpotTable.getUserId()),
                new SpotId(userToSpotTable.getSpotId()),
                userToSpotTable.getPosition()
        );
    }
}
