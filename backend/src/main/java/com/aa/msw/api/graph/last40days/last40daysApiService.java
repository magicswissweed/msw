package com.aa.msw.api.graph.last40days;

import com.aa.msw.api.station.StationApiService;
import com.aa.msw.database.repository.dao.Last40DaysDao;
import com.aa.msw.model.Sample;
import com.aa.msw.model.Station;
import com.aa.msw.source.hydrodaten.historical.lastfourty.Last40DaysSampleFetchService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class last40daysApiService {
    private Last40DaysSampleFetchService last40DaysSampleFetchService;
    private StationApiService stationApiService;
    private Last40DaysDao last40DaysDao;

    @Scheduled(cron = "0 0 1 * * *") // Runs at 01:00 every day
    @Transactional
    public void fetchLast40DaysAndSaveToDb() {
        Set<List<Sample>> fetchedLast40DaysSamples = fetchLast40Days();
        if (!fetchedLast40DaysSamples.isEmpty()) {
            last40DaysDao.deleteAll();
            persistStationsToDb(fetchedLast40DaysSamples);
            last40DaysSamples = fetchedLast40DaysSamples;
        }
    }

    private Set<List<Sample>> fetchLast40Days() {
        try {
            Set<Station> stations = stationApiService.getStations();
            Set<Integer> stationIds = stations.stream()
                    .map(Station::stationId)
                    .collect(Collectors.toSet());
            return last40DaysSampleFetchService.fetchLast40DaysSamples(stationIds);
        } catch (URISyntaxException e) {
            // nop
        }
        return Collections.emptySet();
    }

}
