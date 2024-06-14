package com.aa.msw.database.repository;

import com.aa.msw.database.helpers.UserToSpot;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.helpers.id.UserId;
import com.aa.msw.database.helpers.id.UserToSpotId;
import com.aa.msw.database.repository.dao.UserToSpotDao;
import com.aa.msw.gen.jooq.tables.UserToSpotTable;
import com.aa.msw.gen.jooq.tables.daos.UserToSpotTableDao;
import com.aa.msw.gen.jooq.tables.records.UserToSpotTableRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;


@Component
public class UserToSpotRepository extends AbstractRepository<UserToSpotId, UserToSpot, UserToSpotTableRecord, com.aa.msw.gen.jooq.tables.pojos.UserToSpotTable, UserToSpotTableDao>
		implements UserToSpotDao {

	private static final UserToSpotTable TABLE = UserToSpotTable.USER_TO_SPOT_TABLE;

	public UserToSpotRepository (final DSLContext dsl) {
		super(dsl, new UserToSpotTableDao(dsl.configuration()), TABLE, TABLE.ID);
	}

	@Override
	public Set<SpotId> getSpotIdsForUser (UserId userId) {
		return dsl.selectFrom(TABLE)
				.where(TABLE.USER_ID.eq(userId.getId()))
				.fetch(this::mapRecord)
				.stream()
				.map(UserToSpot::spotId)
				.collect(Collectors.toSet());
	}

	@Override
	protected UserToSpot mapRecord (UserToSpotTableRecord record) {
		return new UserToSpot(
				new UserToSpotId(record.getId()),
				new UserId(record.getUserId()),
				new SpotId(record.getSpotId())
		);
	}

	@Override
	protected UserToSpotTableRecord mapDomain (UserToSpot userToSpot) {
		return new UserToSpotTableRecord(
				userToSpot.getId().getId(),
				userToSpot.userId().getId(),
				userToSpot.spotId().getId()
		);
	}

	@Override
	protected UserToSpot mapEntity (com.aa.msw.gen.jooq.tables.pojos.UserToSpotTable userToSpotTable) {
		return new UserToSpot(
				new UserToSpotId(userToSpotTable.getId()),
				new UserId(userToSpotTable.getUserId()),
				new SpotId(userToSpotTable.getSpotId())
		);
	}
}
