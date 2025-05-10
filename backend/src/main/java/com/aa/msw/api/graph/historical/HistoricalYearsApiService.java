package com.aa.msw.api.graph.historical;

import com.aa.msw.gen.api.StationToApiHistoricalYears;

import java.util.List;

public interface HistoricalYearsApiService {
    List<StationToApiHistoricalYears> getAllApiHistoricalYearsData();
}
