package com.aa.msw.source.hydrodaten.forecast;

import com.aa.msw.database.helpers.id.ForecastId;
import com.aa.msw.model.Forecast;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Profile("test")
@Service
class ForecastFetchServiceMock implements ForecastFetchService {

    private final List<Forecast> forecasts = List.of(
            forecast(2018),
            forecast(2243),
            forecast(2174)
    );

    @Override
    public List<Forecast> fetchForecasts(Set<Integer> stationIds) {
        return forecasts;
    }

    private OffsetDateTime offsetDateTime(int year, int month, int dayOfMonth) {
        return OffsetDateTime.of(year, month, dayOfMonth, 0, 0, 0, 0, ZoneOffset.UTC);
    }

    @Override
    public Forecast fetchForecast(int stationId) {
        for (Forecast forecast : forecasts) {
            if (forecast.stationId() == stationId) {
                return forecast;
            }
        }
        throw new NotImplementedException("Add the forecast with this stationId to the ForecastFetchServiceMock");
    }

    private Forecast forecast(int stationId) {
        return new Forecast(
                new ForecastId(),
                stationId,
                offsetDateTime(2025, 1, 1),
                Map.of(
                        offsetDateTime(2024, 12, 31), 200.0,
                        offsetDateTime(2025, 1, 1), 180.0
                ),
                Map.of(offsetDateTime(2025, 1, 2), 250.0),
                Map.of(offsetDateTime(2025, 1, 3), 240.0),
                Map.of(offsetDateTime(2025, 1, 2), 260.0),
                Map.of(offsetDateTime(2025, 1, 2), 200.0),
                Map.of(offsetDateTime(2025, 1, 2), 300.0)
        );
    }
}
