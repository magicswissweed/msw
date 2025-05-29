package com.aa.msw.source.hydrodaten.historical.years;

import com.aa.msw.model.HistoricalYearsData;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Set;

public interface HistoricalYearsDataFetchService {

    HistoricalYearsData fetchHistoricalYearsData(int stationId) throws IOException, URISyntaxException;

    Set<HistoricalYearsData> fetchHistoricalYearsData(Set<Integer> stationIds) throws URISyntaxException;
}
