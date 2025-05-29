package com.aa.msw.source.hydrodaten.forecast;

import com.aa.msw.model.Forecast;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

public interface ForecastFetchService {
    List<Forecast> fetchForecasts(Set<Integer> stationIds) throws URISyntaxException;

    Forecast fetchForecast(int stationId) throws IOException, URISyntaxException;
}
