package com.aa.msw.source;

import com.aa.msw.config.Spot;
import com.aa.msw.database.repository.dao.ForecastDao;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.model.Forecast;
import com.aa.msw.model.Sample;
import com.aa.msw.source.existenz.SampleFetchService;
import com.aa.msw.source.hydrodaten.forecast.ForecastFetchService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.aa.msw.config.SpotListConfiguration.ALL_SPOTS;

@Service
public class InputDataFetcherService {
	private final Set<Integer> stationIds;

	private final SampleFetchService sampleFetchService;
	private final ForecastFetchService forecastFetchService;

	private final SampleDao sampleDao;
	private final ForecastDao forecastDao;

	public InputDataFetcherService (SampleFetchService sampleFetchService, ForecastFetchService forecastFetchService, SampleDao sampleDao, ForecastDao forecastDao) {
		final Set<Spot> spots = new HashSet<>();
		spots.addAll(ALL_SPOTS.riverSurfSpots());
		spots.addAll(ALL_SPOTS.bungeeSurfSpots());
		stationIds = spots.stream().map(Spot::stationId).collect(Collectors.toSet());

		this.sampleFetchService = sampleFetchService;
		this.forecastFetchService = forecastFetchService;
		this.sampleDao = sampleDao;
		this.forecastDao = forecastDao;
	}

	@Scheduled(fixedRate = 5 * 60 * 1000) // 5 minutes in milliseconds
	public void fetchDataAndWriteToDb() throws IOException, URISyntaxException {
		fetchAndWriteSamples();
		fetchAndWriteForecasts();
	}

	public void fetchAndWriteSamples () throws IOException, URISyntaxException {
		List<Sample> samples = sampleFetchService.fetchSamples(stationIds);
		sampleDao.persistSamplesIfNotExist(samples);
	}

	public void fetchAndWriteForecasts () throws URISyntaxException {
		List<Forecast> forecasts = forecastFetchService.fetchForecasts(stationIds);
		forecastDao.persistForecastsIfNotExist(forecasts);
	}
}
