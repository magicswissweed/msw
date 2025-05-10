package com.aa.msw.api.graph.historical;

import com.aa.msw.gen.api.StationToApiHistoricalYears;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;

@Profile("test")
@Service
public class HistoricalYearsApiServiceMock implements HistoricalYearsApiService {
    @Override
    public List<StationToApiHistoricalYears> getAllApiHistoricalYearsData() {
        return List.of();
    }
}
