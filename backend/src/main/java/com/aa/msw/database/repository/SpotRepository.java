package com.aa.msw.database.repository;

import com.aa.msw.database.helpers.id.Id;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.gen.jooq.enums.Spottype;
import com.aa.msw.gen.jooq.tables.SpotTable;
import com.aa.msw.gen.jooq.tables.daos.SpotTableDao;
import com.aa.msw.gen.jooq.tables.records.SpotTableRecord;
import com.aa.msw.model.Spot;
import com.aa.msw.model.SpotTypeEnum;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;


@Component
public class SpotRepository extends AbstractRepository<SpotId, Spot, SpotTableRecord, com.aa.msw.gen.jooq.tables.pojos.SpotTable, SpotTableDao>
		implements SpotDao {

	private static final SpotTable TABLE = SpotTable.SPOT_TABLE;

	public SpotRepository (final DSLContext dsl) {
		super(dsl, new SpotTableDao(dsl.configuration()), TABLE, TABLE.ID);
	}

	@Override
	protected Spot mapRecord (SpotTableRecord record) {
		return new Spot(
				new SpotId(record.getId()),
				mapDbToDomainEnum(record.getType()),
				record.getName(),
				record.getStationid(),
				record.getMinflow(),
				record.getMaxflow()
		);
	}

	@Override
	protected SpotTableRecord mapDomain (Spot spot) {
		return new SpotTableRecord(
				spot.getId().getId(),
				mapDomainToDbEnum(spot.type()),
				spot.stationId(),
				spot.name(),
				spot.minFlow(),
				spot.maxFlow()
		);
	}

	@Override
	protected Spot mapEntity (com.aa.msw.gen.jooq.tables.pojos.SpotTable spotTable) {
		return new Spot(
				new SpotId(spotTable.getId()),
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
		// TODO: check implementation
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
}
