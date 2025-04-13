package com.aa.msw.api.current;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.gen.api.ApiSample;
import com.aa.msw.model.Sample;
import com.aa.msw.source.InputDataFetcherService;
import com.aa.msw.source.hydrodaten.historical.lastfourty.Last40DaysSampleFetchService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;

@Service
public class SampleApiService {

    private final SampleDao sampleDao;
    private final InputDataFetcherService inputDataFetcherService;
    private final Last40DaysSampleFetchService last40DaysSampleFetchService;

    SampleApiService(final SampleDao sampleDao, InputDataFetcherService inputDataFetcherService, Last40DaysSampleFetchService last40DaysSampleFetchService) {
        this.sampleDao = sampleDao;
        this.inputDataFetcherService = inputDataFetcherService;
        this.last40DaysSampleFetchService = last40DaysSampleFetchService;
    }

    private static ApiSample mapSample(Sample sample) {
        return new ApiSample()
                .timestamp(sample.getTimestamp())
                .temperature(sample.getTemperature().orElse(null))
                .flow(sample.flow());
    }

    public ApiSample getCurrentSample(Integer stationId) throws NoDataAvailableException {
        return mapSample(sampleDao.getCurrentSample(stationId));
    }

    public void searchForNewerSample() {
        try {
            inputDataFetcherService.fetchAndWriteSamples();
        } catch (IOException | URISyntaxException e) {
            // NOP
        }

    }
}
