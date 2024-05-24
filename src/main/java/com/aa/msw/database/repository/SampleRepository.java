package com.aa.msw.database.repository;

import com.aa.msw.database.helpers.id.SampleId;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.gen.jooq.tables.SampleTable;
import com.aa.msw.gen.jooq.tables.daos.SampleTableDao;
import com.aa.msw.gen.jooq.tables.records.SampleTableRecord;
import com.aa.msw.model.Sample;
import org.jooq.DSLContext;
import org.springframework.stereotype.Component;

import java.text.DecimalFormat;


@Component
public class SampleRepository extends AbstractRepository<SampleId, Sample, SampleTableRecord, com.aa.msw.gen.jooq.tables.pojos.SampleTable, SampleTableDao>
		implements SampleDao {

	private static final SampleTable TABLE = SampleTable.SAMPLE_TABLE;

	public SampleRepository (final DSLContext dsl) {
		super(dsl, new SampleTableDao(dsl.configuration()), TABLE, TABLE.ID);
	}

	@Override
	protected Sample mapRecord (SampleTableRecord record) {
		DecimalFormat roundToOneDigit = new DecimalFormat("##.#");
		double roundedTemp = Double.parseDouble(roundToOneDigit.format(record.getTemperature()));

		return new Sample(
				new SampleId(record.getId()),
				record.getStationid(),
				record.getTimestamp(),
				roundedTemp,
				record.getFlow());
	}

	@Override
	protected SampleTableRecord mapDomain (Sample sample) {
		return new SampleTableRecord(
				sample.getId().getId(),
				sample.getStationId(),
				sample.getTimestamp(),
				(float) sample.getTemperature(),
				sample.getFlow());
	}

	@Override
	protected Sample mapEntity (com.aa.msw.gen.jooq.tables.pojos.SampleTable sampleTable) {
		return new Sample(
				new SampleId(sampleTable.getId()),
				sampleTable.getStationid(),
				sampleTable.getTimestamp(),
				sampleTable.getTemperature(),
				sampleTable.getFlow()
		);
	}

	@Override
	public Sample getSomeSample (int stationId) { // TODO: get latest sample from station
		return dsl.selectFrom(TABLE)
				.where(TABLE.STATIONID.eq(stationId))
				.fetch(this::mapRecord)
				.get(0);
	}
}
