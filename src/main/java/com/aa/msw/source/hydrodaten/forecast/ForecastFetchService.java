package com.aa.msw.source.hydrodaten.forecast;

import com.aa.msw.source.AbstractFetchService;
import com.aa.msw.source.hydrodaten.forecast.model.Forecast;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;

@Service
public class ForecastFetchService extends AbstractFetchService {
	final static String FETCH_URL_PREFIX = "https://www.hydrodaten.admin.ch/plots/q_forecast/";
	final static String FETCH_URL_SUFFIX = "_q_forecast_de.json";

	public Forecast fetchForecast (int stationId) throws IOException, URISyntaxException {
		String response = fetchAsString(FETCH_URL_PREFIX + stationId + FETCH_URL_SUFFIX);
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		return objectMapper.readValue(response, new TypeReference<>() {});
	}
}
