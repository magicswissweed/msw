package com.aa.msw.api.graph.historical;

import com.aa.msw.gen.api.ApiHistoricalYears;

public interface HistoricalYearsApiService {
    ApiHistoricalYears getApiHistoricalYearsData(Integer stationId);
}
