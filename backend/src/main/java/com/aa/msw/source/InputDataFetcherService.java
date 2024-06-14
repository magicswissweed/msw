package com.aa.msw.source;

import com.aa.msw.database.repository.dao.ForecastDao;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.model.Forecast;
import com.aa.msw.model.Sample;
import com.aa.msw.model.Spot;
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

import static com.aa.msw.config.SpotListConfiguration.PUBLIC_BUNGEE_SURF_SPOTS;
import static com.aa.msw.config.SpotListConfiguration.PUBLIC_RIVER_SURF_SPOTS;

@Service
public class InputDataFetcherService {
	private Set<Integer> stationIds;

	private final SampleFetchService sampleFetchService;
	private final ForecastFetchService forecastFetchService;

	private final SpotDao spotDao;
	private final SampleDao sampleDao;
	private final ForecastDao forecastDao;

	public InputDataFetcherService (SampleFetchService sampleFetchService, ForecastFetchService forecastFetchService, SpotDao spotDao, SampleDao sampleDao, ForecastDao forecastDao) {
		this.sampleFetchService = sampleFetchService;
		this.forecastFetchService = forecastFetchService;
		this.spotDao = spotDao;
		this.sampleDao = sampleDao;
		this.forecastDao = forecastDao;
		stationIds = getAllStationIds();
	}

	public void updateStationIds () {
		this.stationIds = getAllStationIds();
	}

	private Set<Integer> getAllStationIds () {
		final Set<Integer> stationIds;
		final Set<Spot> publicSpots = new HashSet<>();
		publicSpots.addAll(PUBLIC_RIVER_SURF_SPOTS);
		publicSpots.addAll(PUBLIC_BUNGEE_SURF_SPOTS);
		Set<Integer> publicStationIds = publicSpots.stream().map(Spot::stationId).collect(Collectors.toSet());
		Set<Integer> privateStationIds = spotDao.getAllStationIds();

		Set<Integer> allStationIds = new HashSet<>();
		allStationIds.addAll(publicStationIds);
		allStationIds.addAll(privateStationIds);
		stationIds = allStationIds;
		return stationIds;
	}

	@Scheduled(fixedRate = 5 * 60 * 1000) // 5 minutes in milliseconds
	public void fetchDataAndWriteToDb () throws IOException, URISyntaxException {
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
