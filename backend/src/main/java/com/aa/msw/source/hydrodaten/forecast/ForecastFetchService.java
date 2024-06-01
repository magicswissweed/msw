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

	public List<Forecast> fetchForecasts (Set<Integer> stationIds) throws IOException, URISyntaxException {
		List<Forecast> forecasts = new ArrayList<>();
		for (int stationId : stationIds) {
			forecasts.add(fetchForecast(stationId));
		}
		return forecasts;
	}

	public Forecast fetchForecast (int stationId) throws IOException, URISyntaxException {
		String response = fetchAsString(FETCH_URL_PREFIX + stationId + FETCH_URL_SUFFIX);
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		HydroForecast hydroForecast = objectMapper.readValue(response, new TypeReference<>() {});
		return new Forecast(
				new ForecastId(),
				stationId,
				extractTimestamp(hydroForecast),
				mapForecastLine(hydroForecast, 4),
				mapForecastLine(hydroForecast, 3),
				mapForecastLine(hydroForecast, 2),
				mapForecastLine(hydroForecast, 1),
				mapForecastLine(hydroForecast, 0)
		);
	}

	private static Map<OffsetDateTime, Double> mapForecastLine (HydroForecast hydroForecast, int index) throws IOException {
		HydroForecastLine hydroForecastLine = hydroForecast.plot().data().get(index);
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
