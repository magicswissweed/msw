package com.aa.msw.api.station;

import com.aa.msw.gen.api.ApiStation;
import com.aa.msw.source.hydrodaten.stations.StationFetchService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StationApiService {

    private final StationFetchService stationFetchService;
    private List<ApiStation> stations = new ArrayList<>();

    public StationApiService(StationFetchService stationFetchService) {
        this.stationFetchService = stationFetchService;
    }

    public List<ApiStation> getStations() {
        if(stations.size() == 0) {
            stations = stationFetchService.fetchStations();
        }
        return stations;
    }
}
