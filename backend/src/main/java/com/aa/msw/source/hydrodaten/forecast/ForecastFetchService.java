package com.aa.msw.source.hydrodaten.forecast;

import com.aa.msw.database.helpers.id.ForecastId;
import com.aa.msw.model.Forecast;
import com.aa.msw.source.AbstractFetchService;
import com.aa.msw.source.hydrodaten.forecast.model.HydroForecast;
import com.aa.msw.source.hydrodaten.forecast.model.HydroForecastLine;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ForecastFetchService extends AbstractFetchService {
	final static String FETCH_URL_PREFIX = "https://www.hydrodaten.admin.ch/plots/q_forecast/";
	final static String FETCH_URL_SUFFIX = "_q_forecast_de.json";

	public List<Forecast> fetchForecasts (Set<Integer> stationIds) throws URISyntaxException {
		List<Forecast> forecasts = new ArrayList<>();
		for (int stationId : stationIds) {
			try {
				forecasts.add(fetchForecast(stationId));
			} catch (IOException e) {
				// ignore: could be that this station just does not have a forecast
			}

		}
		return forecasts;
	}

	public Forecast fetchForecast (int stationId) throws IOException, URISyntaxException {
		String response = fetchAsString(FETCH_URL_PREFIX + stationId + FETCH_URL_SUFFIX);
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		HydroForecast hydroForecast = objectMapper.readValue(response, new TypeReference<>() {});

		// Hydrodaten does something very strange here. In this line, there are actually two lines.
		// The second line (25 percentile) is ordered backwards (timestamps descending)
		HydroForecastLine twentyFiveToSeventyFivePercentile = hydroForecast.plot().data().get(2);
		ArrayList<OffsetDateTime> twenty5ToSeventy5PercentileTimestamps = twentyFiveToSeventyFivePercentile.x();
		ArrayList<Double> twenty5ToSeventy5PercentileFlows = twentyFiveToSeventyFivePercentile.y();
		HydroForecastLine seventyFivePercentile = getFirstHalfOfHydroForecastLine(
				twenty5ToSeventy5PercentileTimestamps,
				twenty5ToSeventy5PercentileFlows,
				"seventyFivePercentile");
		HydroForecastLine twentyFivePercentile = getFirstHalfOfHydroForecastLine(
				twenty5ToSeventy5PercentileTimestamps.reversed(),
				twenty5ToSeventy5PercentileFlows.reversed(),
				"twentyFivePercentile");

		return new Forecast(
				new ForecastId(),
				stationId,
				extractTimestamp(hydroForecast),
				mapForecastLine(hydroForecast.plot().data().get(4)),
				mapForecastLine(hydroForecast.plot().data().get(3)),
				mapForecastLine(twentyFivePercentile),
				mapForecastLine(seventyFivePercentile),
				mapForecastLine(hydroForecast.plot().data().get(1)),
				mapForecastLine(hydroForecast.plot().data().get(0))
		);
	}

	private HydroForecastLine getFirstHalfOfHydroForecastLine (
			List<OffsetDateTime> twenty5ToSeventy5PercentileTimestamps,
			List<Double> twenty5ToSeventy5PercentileFlows,
			String name) {
		ArrayList<OffsetDateTime> timestamps = new ArrayList<>();
		ArrayList<Double> flows = new ArrayList<>();

		OffsetDateTime lastTimeStamp = OffsetDateTime.MIN;
		for (int index = 0; index < twenty5ToSeventy5PercentileTimestamps.size(); index++) {
			OffsetDateTime timestamp = twenty5ToSeventy5PercentileTimestamps.get(index);
			if (timestamp.isAfter(lastTimeStamp)) {
				timestamps.add(timestamp);
				flows.add(twenty5ToSeventy5PercentileFlows.get(index));
			}
		}

		return new HydroForecastLine(timestamps, flows, name);
	}

	private static Map<OffsetDateTime, Double> mapForecastLine (HydroForecastLine hydroForecastLine) throws IOException {
		if (hydroForecastLine.x().size() > hydroForecastLine.y().size()) {
			throw new IOException("Should be the same number of dates as values.");
		}
		Map<OffsetDateTime, Double> forecastLine = new LinkedHashMap<>();
		for (int i = 0; i <hydroForecastLine.x().size(); i++) {
			forecastLine.put(hydroForecastLine.x().get(i), hydroForecastLine.y().get(i));
		}
		return forecastLine;
	}

	private static OffsetDateTime extractTimestamp (HydroForecast hydroForecast) {
		String datetimeString = hydroForecast.plot().layout().annotations().stream()
				.filter((a) -> a.xref().equals("x"))
				.toList().get(0).x();

		return OffsetDateTime.parse(datetimeString);
	}
}
