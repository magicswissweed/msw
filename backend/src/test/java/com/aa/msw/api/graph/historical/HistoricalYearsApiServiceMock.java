package com.aa.msw.api.graph.historical;

import com.aa.msw.gen.api.ApiHistoricalYears;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Profile("test")
@Service
public class HistoricalYearsApiServiceMock implements HistoricalYearsApiService {
    @Override
    public ApiHistoricalYears getApiHistoricalYearsData(Integer stationId) {
        return new ApiHistoricalYears();
    }
}
