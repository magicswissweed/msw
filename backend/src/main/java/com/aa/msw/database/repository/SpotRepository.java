package com.aa.msw.database.repository;

import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.gen.jooq.tables.SpotTable;
import com.aa.msw.gen.jooq.tables.daos.SpotTableDao;
import com.aa.msw.gen.jooq.tables.records.SpotTableRecord;
import com.aa.msw.model.Spot;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;


@Component
public class SpotRepository extends AbstractRepository<SpotId, Spot, SpotTableRecord, com.aa.msw.gen.jooq.tables.pojos.SpotTable, SpotTableDao>
		implements SpotDao {

	private static final SpotTable TABLE = SpotTable.SPOT_TABLE;

	public SpotRepository (final DSLContext dsl) {
		super(dsl, new SpotTableDao(dsl.configuration()), TABLE, TABLE.ID);
	}

	@Override
	protected Spot mapRecord (SpotTableRecord record) {
		// TODO
		return null;
	}

	@Override
	protected SpotTableRecord mapDomain (Spot spot) {
		// TODO
		return null;
	}

	@Override
	protected Spot mapEntity (com.aa.msw.gen.jooq.tables.pojos.SpotTable spotTable) {
		// TODO
		return null;
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
						.where(TABLE.ID.in(spotIds))
						.fetch(this::mapRecord)
		);
	}
}
