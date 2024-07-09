package com.aa.msw.source.hydrodaten.historical.lastfourty;

import com.aa.msw.database.helpers.id.SampleId;
import com.aa.msw.model.Sample;
import com.aa.msw.source.hydrodaten.AbstractLineFetchService;
import com.aa.msw.source.hydrodaten.model.HydroResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Service
public class Last40DaysSampleFetchService extends AbstractLineFetchService {

    Last40DaysSampleFetchService() {
        super("https://www.hydrodaten.admin.ch/plots/p_q_40days/", "_p_q_40days_de.json");
    }

    public List<Sample> fetchLast40DaysSamples(int stationId) throws IOException, URISyntaxException {
        HydroResponse hydroResponse = fetchFromHydro(stationId);

        Map<OffsetDateTime, Double> line = mapLine(hydroResponse.plot().data().get(1));

        return line.entrySet().stream()
                .map(entry -> new Sample(
                        new SampleId(),
                        stationId,
                        entry.getKey(),
                        0,
                        entry.getValue().intValue()
                ))
                .toList();
    }
}
