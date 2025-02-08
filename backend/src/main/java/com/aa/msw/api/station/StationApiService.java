package com.aa.msw.api.station;

import com.aa.msw.database.exceptions.NoSampleAvailableException;
import com.aa.msw.model.Station;
import com.aa.msw.source.InputDataFetcherService;
import com.aa.msw.source.hydrodaten.stations.StationFetchService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StationApiService {

    private final StationFetchService stationFetchService;
    private final InputDataFetcherService inputDataFetcherService;
    private List<Station> stations = new ArrayList<>();

    public StationApiService(StationFetchService stationFetchService, InputDataFetcherService inputDataFetcherService) {
        this.stationFetchService = stationFetchService;
        this.inputDataFetcherService = inputDataFetcherService;
    }

    public List<Station> getStations() {
        if(stations.isEmpty()) {
            stations = stationFetchService
                    .fetchStations()
                    .stream()
                    .filter(this::isValidStation)
                    .toList();
        }
        return stations;
    }

    private boolean isValidStation(Station station) {
        try {
            inputDataFetcherService.fetchForStationId(station.stationId());
        } catch (NoSampleAvailableException e) {
            return false;
        }
        return true;
    }
}
