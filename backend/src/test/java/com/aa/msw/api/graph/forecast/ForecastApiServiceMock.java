package com.aa.msw.api.graph.forecast;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.gen.api.ApiForecast;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Profile("test")
@Service
public class ForecastApiServiceMock implements ForecastApiService {

    @Override
    public ApiForecast getCurrentForecast(Integer stationId) throws NoDataAvailableException {
        return new ApiForecast();
    }
}
