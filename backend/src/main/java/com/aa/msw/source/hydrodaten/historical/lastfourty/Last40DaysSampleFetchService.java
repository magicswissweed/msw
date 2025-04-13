package com.aa.msw.source.hydrodaten.historical.lastfourty;

import com.aa.msw.database.helpers.id.SampleId;
import com.aa.msw.model.Sample;
import com.aa.msw.source.hydrodaten.AbstractLineFetchService;
import com.aa.msw.source.hydrodaten.model.line.HydroResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class Last40DaysSampleFetchService extends AbstractLineFetchService {

    Last40DaysSampleFetchService() {
        super("https://www.hydrodaten.admin.ch/plots/p_q_40days/", "_p_q_40days_de.json");
    }

    private List<Sample> fetchLast40DaysSamples(int stationId) throws IOException, URISyntaxException {
        HydroResponse hydroResponse = fetchFromHydro(stationId);

        Map<OffsetDateTime, Double> line = mapLine(hydroResponse.plot().data().get(1));

        return line.entrySet().stream()
                .filter(entry -> entry.getValue() != null)
                .map(entry -> new Sample(
                        new SampleId(),
                        stationId,
                        entry.getKey(),
                        Optional.empty(),
                        entry.getValue().intValue()
                ))
                .toList();
    }

    public Set<List<Sample>> fetchLast40DaysSamples(Set<Integer> stationIds) throws URISyntaxException {
        Set<List<Sample>> result = new HashSet<>();
        for (Integer stationId : stationIds) {
            try {
                result.add(fetchLast40DaysSamples(stationId));
            } catch (IOException e) {
                // ignore, there might not be last 40 days data
            }
        }
        return result;
    }
}
