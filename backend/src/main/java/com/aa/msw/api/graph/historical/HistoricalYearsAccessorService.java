package com.aa.msw.api.graph.historical;

import com.aa.msw.api.station.StationApiService;
import com.aa.msw.database.repository.dao.HistoricalYearsDataDao;
import com.aa.msw.model.HistoricalYearsData;
import com.aa.msw.model.Station;
import com.aa.msw.source.hydrodaten.historical.years.HistoricalYearsDataFetchService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
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

@Service
public class HistoricalYearsAccessorService {
    private final HistoricalYearsDataFetchService historicalYearsDataFetchService;
    private final StationApiService stationApiService;
    private final HistoricalYearsDataDao hystoricalYearsDao;

    private Map<Integer, HistoricalYearsData> historicalYearsData = new HashMap<>();

    public HistoricalYearsAccessorService(HistoricalYearsDataFetchService historicalYearsDataFetchService, StationApiService stationApiService, HistoricalYearsDataDao hystoricalYearsDao) {
        this.historicalYearsDataFetchService = historicalYearsDataFetchService;
        this.stationApiService = stationApiService;
        this.hystoricalYearsDao = hystoricalYearsDao;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public Map<Integer, HistoricalYearsData> getHistoricalYearsData() {
        if (!historicalYearsData.isEmpty()) {
            return historicalYearsData;
        }
        Set<HistoricalYearsData> historicalDataFromDb = hystoricalYearsDao.getAllHistoricalYearsData();
        if (historicalDataFromDb.isEmpty()) {
            fetchHistoricalYearsDataAndSaveToDb();
        } else {
            historicalYearsData = setToMap(historicalDataFromDb);
        }
        return historicalYearsData;
    }

    @Scheduled(cron = "0 0 0 * * *") // Runs at 00:00 every day
    @Transactional
    public void fetchHistoricalYearsDataAndSaveToDb() {
        Set<HistoricalYearsData> fetchedHistoricalYearsData = fetchHistoricalYears();
        if (!fetchedHistoricalYearsData.isEmpty()) {
            hystoricalYearsDao.deleteAll();
            persistHistoricalYearsToDb(fetchedHistoricalYearsData);
            historicalYearsData = setToMap(fetchedHistoricalYearsData);
        }
    }

    private void persistHistoricalYearsToDb(Set<HistoricalYearsData> fetchedStations) {
        for (HistoricalYearsData data : fetchedStations) {
            hystoricalYearsDao.persist(data);
        }
    }

    private Set<HistoricalYearsData> fetchHistoricalYears() {
        try {
            Set<Station> stations = stationApiService.getStations();
            Set<Integer> stationIds = stations.stream()
                    .map(Station::stationId)
                    .collect(Collectors.toSet());
            return historicalYearsDataFetchService.fetchHistoricalYearsData(stationIds);
        } catch (URISyntaxException e) {
            // nop
        }
        return Collections.emptySet();
    }

    private Map<Integer, HistoricalYearsData> setToMap(Set<HistoricalYearsData> historicalYearsSet) {
        return historicalYearsSet.stream()
                .collect(Collectors.toMap(HistoricalYearsData::stationId, h -> h));
    }
}
