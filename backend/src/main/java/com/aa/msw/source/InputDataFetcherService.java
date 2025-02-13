package com.aa.msw.source;

import com.aa.msw.database.exceptions.NoSampleAvailableException;
import com.aa.msw.database.repository.dao.ForecastDao;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.model.Forecast;
import com.aa.msw.model.Sample;
import com.aa.msw.source.existenz.sample.SampleFetchService;
import com.aa.msw.source.hydrodaten.forecast.ForecastFetchService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

@Service
public class InputDataFetcherService {
    private final SampleFetchService sampleFetchService;
    private final ForecastFetchService forecastFetchService;
    private final SpotDao spotDao;
    private final SampleDao sampleDao;
    private final ForecastDao forecastDao;
    private Set<Integer> stationIds;

    public InputDataFetcherService(SampleFetchService sampleFetchService, ForecastFetchService forecastFetchService, SpotDao spotDao, SampleDao sampleDao, ForecastDao forecastDao) {
        this.sampleFetchService = sampleFetchService;
        this.forecastFetchService = forecastFetchService;
        this.spotDao = spotDao;
        this.sampleDao = sampleDao;
        this.forecastDao = forecastDao;
        stationIds = getAllStationIds();
    }

    public void updateStationIds() {
        this.stationIds = getAllStationIds();
    }

    public List<Sample> fetchForStationId(Integer stationId) throws NoSampleAvailableException {
        List<Sample> samples;
        try {
            samples = sampleFetchService.fetchSamples(Set.of(stationId));
        } catch (IOException | URISyntaxException e) {
            throw new NoSampleAvailableException(e.getMessage());
        }
        try {
            forecastFetchService.fetchForecasts(Set.of(stationId));
        } catch (URISyntaxException e) {
            // NOP: This can happen, if no forecast is available for the spot...
        }

        return samples;
    }

    private Set<Integer> getAllStationIds() {
        return spotDao.getAllStationIds();
    }

    @Scheduled(fixedRate = 5 * 60 * 1000) // 5 minutes in milliseconds
    public void fetchDataAndWriteToDb() throws IOException, URISyntaxException {
        fetchAndWriteSamples();
        fetchAndWriteForecasts();
    }

    public void fetchAndWriteSamples() throws IOException, URISyntaxException {
        List<Sample> samples = sampleFetchService.fetchSamples(stationIds);
        sampleDao.persistSamplesIfNotExist(samples);
    }

    public void fetchAndWriteForecasts() throws URISyntaxException {
        List<Forecast> forecasts = forecastFetchService.fetchForecasts(stationIds);
        forecastDao.persistForecastsIfNotExist(forecasts);
    }
}
