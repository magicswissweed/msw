package com.aa.msw.database.repository;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.helpers.id.ForecastId;
import com.aa.msw.database.repository.dao.ForecastDao;
import com.aa.msw.gen.jooq.tables.ForecastTable;
import com.aa.msw.gen.jooq.tables.daos.ForecastTableDao;
import com.aa.msw.gen.jooq.tables.records.ForecastTableRecord;
import com.aa.msw.model.Forecast;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jooq.DSLContext;
import org.jooq.JSONB;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;


@Component
public class ForecastRepository extends AbstractRepository<ForecastId, Forecast, ForecastTableRecord, com.aa.msw.gen.jooq.tables.pojos.ForecastTable, ForecastTableDao>
		implements ForecastDao {

	private static final ForecastTable TABLE = ForecastTable.FORECAST_TABLE;

	public ForecastRepository (final DSLContext dsl) {
		super(dsl, new ForecastTableDao(dsl.configuration()), TABLE, TABLE.ID);
	}

	@Override
	protected Forecast mapRecord (ForecastTableRecord record) {
		return getForecast(
				record.getId(),
				record.getStationid(),
				record.getTimestamp(),
				record.getMeasureddata(),
				record.getMedian(),
				record.getTwentyfivetoseventyfivepercentile(),
				record.getMin(),
				record.getMax());
	}

	@Override
	protected ForecastTableRecord mapDomain (Forecast forecast) {
		final ForecastTableRecord record = dsl.newRecord(table);

		JSONB measuredData;
		JSONB median;
		JSONB twentyFiveToSeventyFivePercentile;
		JSONB min;
		JSONB max;
		try {
			measuredData = toJsonB(forecast.getMeasuredData());
			median = toJsonB(forecast.getMedian());
			twentyFiveToSeventyFivePercentile = toJsonB(forecast.getTwentyFiveToSeventyFivePercentile());
			min = toJsonB(forecast.getMin());
			max = toJsonB(forecast.getMax());
		} catch (JsonProcessingException e) {
			return null; // Handle somehow
		}

		record.setId(forecast.forecastId().getId());
		record.setStationid(forecast.getStationId());
		record.setTimestamp(forecast.getTimestamp());
		record.setMeasureddata(measuredData);
		record.setMedian(median);
		record.setTwentyfivetoseventyfivepercentile(twentyFiveToSeventyFivePercentile);
		record.setMin(min);
		record.setMax(max);
		return record;
	}

	private static JSONB toJsonB (Map<OffsetDateTime, Double> data) throws JsonProcessingException {
		return JSONB.valueOf(new ObjectMapper().writeValueAsString(data));
	}

	@Override
	protected Forecast mapEntity (com.aa.msw.gen.jooq.tables.pojos.ForecastTable forecastTable) {
		return getForecast(
				forecastTable.getId(),
				forecastTable.getStationid(),
				forecastTable.getTimestamp(),
				forecastTable.getMeasureddata(),
				forecastTable.getMedian(),
				forecastTable.getTwentyfivetoseventyfivepercentile(),
				forecastTable.getMin(),
				forecastTable.getMax());
	}

	private Forecast getForecast (UUID forecastId, Integer stationid, OffsetDateTime timestamp, JSONB jsonMeasured, JSONB jsonMedian, JSONB jsonPercentile, JSONB jsonMin, JSONB jsonMax) {
		Map<OffsetDateTime, Double> measuredData;
		Map<OffsetDateTime, Double> median;
		Map<OffsetDateTime, Double> twentyFiveToSeventyFivePercentile;
		Map<OffsetDateTime, Double> min;
		Map<OffsetDateTime, Double> max;
		try {
			measuredData = jsonbToMap(jsonMeasured);
			median = jsonbToMap(jsonMedian);
			twentyFiveToSeventyFivePercentile = jsonbToMap(jsonPercentile);
			min = jsonbToMap(jsonMin);
			max = jsonbToMap(jsonMax);
		} catch (JsonProcessingException e) {
			return null;
		}

		return new Forecast(
				new ForecastId(forecastId),
				stationid,
				timestamp,
				measuredData,
				median,
				twentyFiveToSeventyFivePercentile,
				min,
				max);
	}

	private static Map<OffsetDateTime, Double> jsonbToMap (JSONB data) throws JsonProcessingException {
		return new ObjectMapper().readValue(data.data(), Map.class);
	}

	@Override
	public Forecast getCurrentForecast (int stationId) throws NoDataAvailableException {
		return dsl.selectFrom(TABLE)
				.where(TABLE.STATIONID.eq(stationId))
				.orderBy(TABLE.TIMESTAMP.desc())
				.limit(1)
				.fetchOptional(this::mapRecord)
				.orElseThrow(() -> new NoDataAvailableException("No current Forecast found for station " + stationId));
	}
}
