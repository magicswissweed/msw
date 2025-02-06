package com.aa.msw.api.graph.forecast;

import com.aa.msw.gen.api.ApiForecast;
import com.aa.msw.gen.api.ForecastApi;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ForecastApiController implements ForecastApi {
    private final ForecastApiService forecastApiService;

    public ForecastApiController(ForecastApiService forecastApiService) {
        this.forecastApiService = forecastApiService;
    }

    @Override
    public ResponseEntity<ApiForecast> getForecast(Integer stationId) {
        try {
            ApiForecast forecast = forecastApiService.getCurrentForecast(stationId);
            return ResponseEntity.ok(forecast);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
