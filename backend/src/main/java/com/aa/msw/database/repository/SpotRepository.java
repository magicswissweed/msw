package com.aa.msw.database.repository;

import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.database.helpers.UserToSpot;
import com.aa.msw.database.helpers.id.Id;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.helpers.id.UserToSpotId;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.database.repository.dao.UserToSpotDao;
import com.aa.msw.gen.jooq.enums.Spottype;
import com.aa.msw.gen.jooq.tables.SpotTable;
import com.aa.msw.gen.jooq.tables.daos.SpotTableDao;
import com.aa.msw.gen.jooq.tables.records.SpotTableRecord;
import com.aa.msw.model.Spot;
import com.aa.msw.model.SpotTypeEnum;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;


@Component
public class SpotRepository extends AbstractRepository<SpotId, Spot, SpotTableRecord, com.aa.msw.gen.jooq.tables.pojos.SpotTable, SpotTableDao>
		implements SpotDao {

	private static final SpotTable TABLE = SpotTable.SPOT_TABLE;

	private final UserToSpotDao userToSpotDao;

	public SpotRepository (final DSLContext dsl, UserToSpotDao userToSpotDao) {
		super(dsl, new SpotTableDao(dsl.configuration()), TABLE, TABLE.ID);
		this.userToSpotDao = userToSpotDao;
	}

	@Override
	protected Spot mapRecord (SpotTableRecord record) {
		return new Spot(
				new SpotId(record.getId()),
				false,
				mapDbToDomainEnum(record.getType()),
				record.getName(),
				record.getStationid(),
				record.getMinflow(),
				record.getMaxflow()
		);
	}

	@Override
	protected SpotTableRecord mapDomain (Spot spot) {
		SpotTableRecord record = dsl.newRecord(TABLE);
		record.setId(spot.getId().getId());
		record.setType(mapDomainToDbEnum(spot.type()));
		record.setStationid(spot.stationId());
		record.setName(spot.name());
		record.setMinflow(spot.minFlow());
		record.setMaxflow(spot.maxFlow());
		return record;
	}

	@Override
	protected Spot mapEntity (com.aa.msw.gen.jooq.tables.pojos.SpotTable spotTable) {
		return new Spot(
				new SpotId(spotTable.getId()),
				false,
				mapDbToDomainEnum(spotTable.getType()),
				spotTable.getName(),
				spotTable.getStationid(),
				spotTable.getMinflow(),
				spotTable.getMaxflow()
		);
	}

	private Spottype mapDomainToDbEnum (SpotTypeEnum type) {
		return switch (type) {
			case RIVER_SURF -> Spottype.RIVER_SURF;
			case BUNGEE_SURF -> Spottype.BUNGEE_SURF;
		};
	}

	private SpotTypeEnum mapDbToDomainEnum (Spottype type) {
		return switch (type) {
			case RIVER_SURF -> SpotTypeEnum.RIVER_SURF;
			case BUNGEE_SURF -> SpotTypeEnum.BUNGEE_SURF;
		};
	}

	@Override
	public Set<Integer> getAllStationIds () {
		return new HashSet<>(
				dsl.selectDistinct(TABLE.STATIONID).from(TABLE)
						.fetch(Record1::value1)
		);
	}

	@Override
	public Set<Spot> getSpots (Set<SpotId> spotIds) {
		return new HashSet<>(
				dsl.selectFrom(TABLE)
						.where(TABLE.ID.in(spotIds.stream().map(Id::getId).collect(Collectors.toSet())))
						.fetch(this::mapRecord)
		);
	}

	@Override
	@Transactional
	public void addPrivateSpot (Spot spot) {
		persist(spot);
		userToSpotDao.persist(new UserToSpot(
				new UserToSpotId(),
				UserContext.getCurrentUser().userId(),
				spot.spotId()
		));
	}

	@Override
	@Transactional
	public void deletePrivateSpot (SpotId spotId) {
		// Check if spot belongs to user
		Set<SpotId> spots = userToSpotDao.getSpotIdsForUser(UserContext.getCurrentUser().userId());
		spots.stream()
				.filter(id -> id.equals(spotId))
				.forEach(this::delete);
	}
}
