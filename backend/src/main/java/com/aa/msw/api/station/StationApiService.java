package com.aa.msw.api.station;

import com.aa.msw.database.exceptions.NoSampleAvailableException;
import com.aa.msw.gen.api.ApiStation;
import com.aa.msw.source.InputDataFetcherService;
import com.aa.msw.source.hydrodaten.stations.StationFetchService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StationApiService {

    private final StationFetchService stationFetchService;
    private final InputDataFetcherService inputDataFetcherService;
    private List<ApiStation> stations = new ArrayList<>();

    public StationApiService(StationFetchService stationFetchService, InputDataFetcherService inputDataFetcherService) {
        this.stationFetchService = stationFetchService;
        this.inputDataFetcherService = inputDataFetcherService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void fetchData() {
        this.getStations();
    }

    public List<ApiStation> getStations() {
        if(stations.isEmpty()) {
            stations = stationFetchService
                    .fetchStations()
                    .stream()
                    .filter(this::isValidStation)
                    .toList();
        }
        return stations;
    }

    private boolean isValidStation(ApiStation apiStation) {
        try {
            inputDataFetcherService.fetchForStationId(apiStation.getId());
        } catch (NoSampleAvailableException e) {
            return false;
        }
        return true;
    }
}
