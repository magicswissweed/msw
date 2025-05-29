package com.aa.msw.source.hydrodaten.forecast;

import com.aa.msw.model.Forecast;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

@Profile("test")
@Service
class ForecastFetchServiceMock implements ForecastFetchService {

    @Override
    public List<Forecast> fetchForecasts(Set<Integer> stationIds) throws URISyntaxException {
        return List.of();
    }

    @Override
    public Forecast fetchForecast(int stationId) throws IOException, URISyntaxException {
        return null;
    }
}
