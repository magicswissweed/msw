package com.aa.msw.api.forecast;

import com.aa.msw.gen.api.ApiForecast;
import com.aa.msw.gen.api.ApiForecastLineEntry;
import com.aa.msw.gen.api.ForecastApi;
import com.aa.msw.model.Forecast;
import com.aa.msw.source.hydrodaten.forecast.ForecastFetchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class ForecastApiController implements ForecastApi {
	private final ForecastFetchService forecastFetchService;

	public ForecastApiController (ForecastFetchService forecastFetchService) {
		this.forecastFetchService = forecastFetchService;
	}

	@Override
	public ResponseEntity<ApiForecast> getForecast (Integer stationId) {
		try {
			Forecast forecast = forecastFetchService.fetchForecast(stationId);
			return ResponseEntity.ok(mapForecast(forecast));
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private static ApiForecast mapForecast (Forecast forecast) {
		ApiForecast apiForecast = new ApiForecast();
		apiForecast.setTimestamp(forecast.getTimestamp());
		apiForecast.setMeasuredData(mapApiForecastLine(forecast.getMeasuredData()));
		apiForecast.setMedian(mapApiForecastLine(forecast.getMedian()));
		apiForecast.setTwentyFiveToSeventyFivePercentile(mapApiForecastLine(forecast.getTwentyFiveToSeventyFivePercentile()));
		apiForecast.setMin(mapApiForecastLine(forecast.getMin()));
		apiForecast.setMax(mapApiForecastLine(forecast.getMax()));
		return apiForecast;
	}

	private static List<ApiForecastLineEntry> mapApiForecastLine (Map<OffsetDateTime, Double> input) {
		return input.entrySet().stream()
				.map(entry -> {
					ApiForecastLineEntry output = new ApiForecastLineEntry();
					output.setTimestamp(entry.getKey());
					output.setFlow(entry.getValue());
					return output;
				})
				.collect(Collectors.toList());
	}
}
