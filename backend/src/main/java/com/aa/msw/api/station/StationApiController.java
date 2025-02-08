package com.aa.msw.api.station;

import com.aa.msw.gen.api.ApiStation;
import com.aa.msw.gen.api.StationApi;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StationApiController implements StationApi {

    private final StationApiService stationApiService;

    public StationApiController(final StationApiService stationApiService) {
        this.stationApiService = stationApiService;
    }

    @Override
    public ResponseEntity<List<ApiStation>> getStations() {
        return ResponseEntity.ok(
                stationApiService.getStations().stream()
                        .map(s -> new ApiStation(s.stationId(), s.label()))
                        .toList()
        );
    }
}
