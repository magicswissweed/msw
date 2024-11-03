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
import com.aa.msw.model.SpotTypeEnum;
import com.aa.msw.model.UserSpot;
import org.jooq.DSLContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
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
        increasePositionOfAllSpotsOfTypeByOne(spot.type());
        persistUserToSpot(spot, position);
    }

    @Override
    @Transactional
    public void updatePrivateSpot(Spot updatedSpot) {
        Spot existingSpot = spotDao.get(updatedSpot.getId());
        if (!existingSpot.isPublic() && userHasSpot(existingSpot.getId())){
            spotDao.update(updatedSpot);
        }
    }

    private void increasePositionOfAllSpotsOfTypeByOne(SpotTypeEnum type) {
        List<UserToSpot> userToSpots = getUserToSpotOrderedOfType(type);

        for(int i = 0; i < userToSpots.size(); i++) {
            UserToSpot userToSpot = userToSpots.get(i);
            userToSpot.setPosition(i + 1);
            update(userToSpot);
        }
    }

    @Transactional
    public void persistUserToSpot(Spot spot, int position) {
        persist(
                new UserToSpot(
                        new UserToSpotId(),
                        UserContext.getCurrentUser().userId(),
                        spot.spotId(),
                        position
                )
        );
    }

    @Override
    @Transactional
    public List<UserSpot> getUserSpotsOrdered() {
        return getUserToSpotOrdered()
                .stream()
                .map(userToSpot -> new UserSpot(userToSpot.position(), spotDao.get(userToSpot.spotId())))
                .sorted(Comparator.comparingInt(UserSpot::position))
                .collect(Collectors.toList());
    }

    private boolean userHasSpot(SpotId id) {
        return !dsl.selectFrom(TABLE)
                .where(TABLE.USER_ID.eq(UserContext.getCurrentUser().userId().getId()))
                .and(TABLE.SPOT_ID.eq(id.getId()))
                .fetch(this::mapRecord)
                .isEmpty();
    }

    private List<UserToSpot> getUserToSpotOrdered() {
        return dsl.selectFrom(TABLE)
                .where(TABLE.USER_ID.eq(UserContext.getCurrentUser().userId().getId()))
                .orderBy(TABLE.POSITION)
                .fetch(this::mapRecord);
    }

    private List<UserToSpot> getUserToSpotOrderedOfType(SpotTypeEnum type) {
        return getUserToSpotOrdered().stream()
                .filter(userToSpot -> spotDao.get(userToSpot.spotId()).type() == type)
                .toList();
    }

    @Override
    @Transactional
    public void addAllPublicSpotsToUser() {
        List<Spot> publicSpots = new ArrayList<>();
        publicSpots.addAll(spotDao.getPublicBungeeSurfSpots());
        publicSpots.addAll(spotDao.getPublicRiverSurfSpots());

        for (Spot publicSpot : publicSpots) {
            Spot privateSpot = new Spot(
                    new SpotId(UUID.randomUUID(), false),
                    false,
                    publicSpot.type(),
                    publicSpot.name(),
                    publicSpot.stationId(),
                    publicSpot.minFlow(),
                    publicSpot.maxFlow());
            spotDao.persist(privateSpot);
            persistUserToSpot(privateSpot, 0);
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
