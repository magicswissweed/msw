package com.aa.msw.api.forecast;

import com.aa.msw.gen.api.ForecastApi;
import com.aa.msw.source.hydrodaten.forecast.ForecastFetchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ForecastApiController implements ForecastApi {
	private final ForecastFetchService forecastFetchService;

	public ForecastApiController (ForecastFetchService forecastFetchService) {
		this.forecastFetchService = forecastFetchService;
	}

	@Override
	public ResponseEntity<String> getForecast (Integer stationId) {
		try {
			return ResponseEntity.ok(forecastFetchService.fetchForecast(stationId).toString());
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
