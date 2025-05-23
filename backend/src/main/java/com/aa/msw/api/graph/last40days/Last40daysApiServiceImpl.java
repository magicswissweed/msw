package com.aa.msw.api.graph.last40days;

import com.aa.msw.api.station.StationApiService;
import com.aa.msw.database.repository.dao.Last40DaysDao;
import com.aa.msw.model.Last40Days;
import com.aa.msw.model.Station;
import com.aa.msw.source.hydrodaten.historical.lastfourty.Last40DaysSampleFetchService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Profile("!test")
@Service
public class Last40daysApiServiceImpl implements Last40DaysApiService {

    private final Last40DaysSampleFetchService last40DaysSampleFetchService;
    private final StationApiService stationApiService;
    private final Last40DaysDao last40DaysDao;

    // holds the last 40 days data in-memory for faster access - but also in DB for fast startup (mostly for dev purposes)
    private Map<Integer, Last40Days> last40DaysSamples = new HashMap<>();

    public Last40daysApiServiceImpl(Last40DaysSampleFetchService last40DaysSampleFetchService, StationApiService stationApiService, Last40DaysDao last40DaysDao) {
        this.last40DaysSampleFetchService = last40DaysSampleFetchService;
        this.stationApiService = stationApiService;
        this.last40DaysDao = last40DaysDao;
    }

    // Runs once at every start up
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    @Override
    public Map<Integer, Last40Days> getLast40Days() {
        // check for samples in memory
        if (!last40DaysSamples.isEmpty()) {
            return last40DaysSamples;
        }
        // if memory is empty, get samples from DB
        Set<Last40Days> last40DaysFromDb = last40DaysDao.getAllLast40Days();
        if (last40DaysFromDb.isEmpty()) {
            // if DB is empty, fetch samples from BAFU
            fetchLast40DaysAndSaveToDb();
        } else {
            last40DaysSamples = setToMap(last40DaysFromDb);
        }
        return last40DaysSamples;
    }

    private Map<Integer, Last40Days> setToMap(Set<Last40Days> last40DaysSet) {
        return last40DaysSet.stream()
                .collect(Collectors.toMap(Last40Days::stationId, h -> h));
    }

    @Override
    public Last40Days getLast40Days(Integer stationId) {
        return last40DaysSamples.get(stationId);
    }

    @Scheduled(cron = "0 0 1 * * *") // Runs at 01:00 every day
    @Transactional
    @Override
    public void fetchLast40DaysAndSaveToDb() {
        Set<Last40Days> fetchedLast40DaysSamples = fetchLast40Days();
        if (!fetchedLast40DaysSamples.isEmpty()) {
            last40DaysDao.deleteAll();
            persistLast40DaysSamplesToDb(fetchedLast40DaysSamples);
            last40DaysSamples = setToMap(fetchedLast40DaysSamples);
        }
    }

    private void persistLast40DaysSamplesToDb(Set<Last40Days> fetchedLast40DaysSamples) {
        for (Last40Days last40DaysSample : fetchedLast40DaysSamples) {
            last40DaysDao.persist(last40DaysSample);
        }
    }

    private Set<Last40Days> fetchLast40Days() {
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
