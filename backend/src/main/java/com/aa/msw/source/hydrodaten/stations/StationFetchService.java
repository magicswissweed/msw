package com.aa.msw.source.hydrodaten.stations;


import com.aa.msw.gen.api.ApiStation;
import com.aa.msw.source.AbstractFetchService;
import com.aa.msw.source.hydrodaten.model.station.HydroStation;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class StationFetchService extends AbstractFetchService {

    public static final String STATIONS_FETCH_URL = "https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten.json";

    public List<ApiStation> fetchStations() {
        try {
            String stationsString = fetchAsString(STATIONS_FETCH_URL);
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            List<HydroStation> hydroStations = objectMapper.readValue(stationsString, new TypeReference<>() {});
            return hydroStations.stream()
                    .map(hydroStation -> {
                        ApiStation apiStation = new ApiStation();
                        apiStation.setId(Integer.parseInt(hydroStation.key()));
                        apiStation.setLabel(hydroStation.label());
                        return apiStation;
                    })
                    .toList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
