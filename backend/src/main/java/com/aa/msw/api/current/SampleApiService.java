package com.aa.msw.api.current;

import com.aa.msw.api.graph.last40days.Last40daysApiService;
import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.gen.api.ApiSample;
import com.aa.msw.model.Sample;
import com.aa.msw.source.InputDataFetcherService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@Service
public class SampleApiService {

    private final SampleDao sampleDao;
    private final InputDataFetcherService inputDataFetcherService;
    private final Last40daysApiService last40daysApiService;

    SampleApiService(final SampleDao sampleDao, InputDataFetcherService inputDataFetcherService, Last40daysApiService last40daysApiService) {
        this.sampleDao = sampleDao;
        this.inputDataFetcherService = inputDataFetcherService;
        this.last40daysApiService = last40daysApiService;
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

    public List<ApiSample> getLast40DaysSamples(Integer stationId) throws IOException, URISyntaxException {
        return last40daysApiService.getLast40Days(stationId).last40DaysSamples()
                .entrySet()
                .stream()
                .map(sample -> new ApiSample()
                        .timestamp(sample.getKey())
                        // TODO: use double for flow?
                        .flow(sample.getValue().intValue()))
                .toList();
    }
}
