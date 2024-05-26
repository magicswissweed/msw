package com.aa.msw.source;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.model.Sample;
import com.aa.msw.source.existenz.SampleFetchService;
import com.aa.msw.source.hydrodaten.forecast.ForecastFetchService;
import com.aa.msw.source.hydrodaten.forecast.model.Forecast;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@Service
public class InputDataFetcherService {
	private static final List<Integer> STATION_IDS = List.of(2018, 2243);

	private final SampleFetchService sampleFetchService;
	private final ForecastFetchService forecastFetchService;

	private final SampleDao sampleDao;

	public InputDataFetcherService (SampleFetchService sampleFetchService, ForecastFetchService forecastFetchService, SampleDao sampleDao) {
		this.sampleFetchService = sampleFetchService;
		this.forecastFetchService = forecastFetchService;
		this.sampleDao = sampleDao;
	}

	@Scheduled(fixedRate = 5 * 60 * 1000) // 5 minutes in milliseconds
	public void fetchDataAndWriteToDb() throws IOException, URISyntaxException {
		fetchAndWriteSamples();
		fetchAndWriteForecasts();
	}

	private void fetchAndWriteSamples () throws IOException, URISyntaxException {
		List<Sample> samples = sampleFetchService.fetchSamples(STATION_IDS);
		for(Sample sample : samples) {
			persistSampleIfNotExists(sample);
		}
	}

	private void fetchAndWriteForecasts () throws IOException, URISyntaxException {
		List<Forecast> forecasts = forecastFetchService.fetchForecasts(STATION_IDS);
		for(Forecast forecast : forecasts) {
			// TODO write to database
		}
	}

	private void persistSampleIfNotExists (Sample sample) throws NoDataAvailableException {
		if (!sampleDao.getCurrentSample(sample.getStationId()).timestamp().equals(sample.getTimestamp())) {
			sampleDao.persist(sample);
		}
	}
}
