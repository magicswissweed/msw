package com.aa.msw.source.hydrodaten.forecast;

import com.aa.msw.database.helpers.id.ForecastId;
import com.aa.msw.model.Forecast;
import com.aa.msw.source.hydrodaten.AbstractLineFetchService;
import com.aa.msw.source.hydrodaten.model.line.HydroLine;
import com.aa.msw.source.hydrodaten.model.line.HydroResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ForecastFetchService extends AbstractLineFetchService {
    ForecastFetchService() {
        super("https://www.hydrodaten.admin.ch/plots/q_forecast/", "_q_forecast_de.json");
    }

    private static OffsetDateTime extractTimestamp(HydroResponse hydroResponse) {
        String datetimeString = hydroResponse.plot().layout().annotations().stream()
                .filter((a) -> a.xref().equals("x"))
                .toList().get(0).x();

        return OffsetDateTime.parse(datetimeString);
    }

    public List<Forecast> fetchForecasts(Set<Integer> stationIds) throws URISyntaxException {
        List<Forecast> forecasts = new ArrayList<>();
        for (int stationId : stationIds) {
            try {
                forecasts.add(fetchForecast(stationId));
            } catch (IOException e) {
                // ignore: could be that this station just does not have a forecast
            }

        }
        return forecasts;
    }

    public Forecast fetchForecast(int stationId) throws IOException, URISyntaxException {
        HydroResponse hydroResponse = fetchFromHydro(stationId);

        // Hydrodaten does something very strange here. In this line, there are actually two lines.
        // The second line (25 percentile) is ordered backwards (timestamps descending)
        HydroLine twentyFiveToSeventyFivePercentile = hydroResponse.plot().data().get(2);
        ArrayList<OffsetDateTime> twenty5ToSeventy5PercentileTimestamps = twentyFiveToSeventyFivePercentile.x();
        ArrayList<Double> twenty5ToSeventy5PercentileFlows = twentyFiveToSeventyFivePercentile.y();
        HydroLine seventyFivePercentile = getFirstHalfOfHydroForecastLine(
                twenty5ToSeventy5PercentileTimestamps,
                twenty5ToSeventy5PercentileFlows,
                "seventyFivePercentile");
        HydroLine twentyFivePercentile = getFirstHalfOfHydroForecastLine(
                twenty5ToSeventy5PercentileTimestamps.reversed(),
                twenty5ToSeventy5PercentileFlows.reversed(),
                "twentyFivePercentile");

        return new Forecast(
                new ForecastId(),
                stationId,
                extractTimestamp(hydroResponse),
                mapLine(hydroResponse.plot().data().get(4)),
                mapLine(hydroResponse.plot().data().get(3)),
                mapLine(twentyFivePercentile),
                mapLine(seventyFivePercentile),
                mapLine(hydroResponse.plot().data().get(1)),
                mapLine(hydroResponse.plot().data().get(0))
        );
    }

    private HydroLine getFirstHalfOfHydroForecastLine(
            List<OffsetDateTime> twenty5ToSeventy5PercentileTimestamps,
            List<Double> twenty5ToSeventy5PercentileFlows,
            String name) {
        ArrayList<OffsetDateTime> timestamps = new ArrayList<>();
        ArrayList<Double> flows = new ArrayList<>();

        OffsetDateTime lastTimeStamp = OffsetDateTime.MIN;
        for (int index = 0; index < twenty5ToSeventy5PercentileTimestamps.size(); index++) {
            OffsetDateTime timestamp = twenty5ToSeventy5PercentileTimestamps.get(index);
            if (timestamp.isAfter(lastTimeStamp)) {
                timestamps.add(timestamp);
                flows.add(twenty5ToSeventy5PercentileFlows.get(index));
            }
        }

        return new HydroLine(timestamps, flows, name);
    }
}
