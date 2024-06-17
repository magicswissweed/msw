package com.aa.msw.api.spots;

import com.aa.msw.api.current.SampleApiService;
import com.aa.msw.api.forecast.ForecastApiService;
import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.exceptions.NoSuchUserException;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.helpers.id.UserExtId;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.database.repository.dao.UserDao;
import com.aa.msw.gen.api.ApiForecast;
import com.aa.msw.gen.api.ApiSpotInformation;
import com.aa.msw.gen.api.ApiSpotInformationList;
import com.aa.msw.model.Spot;
import com.aa.msw.model.SpotTypeEnum;
import com.aa.msw.source.InputDataFetcherService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.aa.msw.config.SpotListConfiguration.PUBLIC_BUNGEE_SURF_SPOTS;
import static com.aa.msw.config.SpotListConfiguration.PUBLIC_RIVER_SURF_SPOTS;

@Service
public class SpotsApiService {
	private final SampleApiService sampleApiService;
	private final ForecastApiService forecastApiService;
	private final SpotDao spotDao;
	private final UserDao userDao;
	private final InputDataFetcherService inputDataFetcherService;

	public SpotsApiService (SampleApiService sampleApiService, ForecastApiService forecastApiService, SpotDao spotDao, UserDao userDao, InputDataFetcherService inputDataFetcherService) {
		this.sampleApiService = sampleApiService;
		this.forecastApiService = forecastApiService;
		this.spotDao = spotDao;
		this.userDao = userDao;
		this.inputDataFetcherService = inputDataFetcherService;
	}

	public ApiSpotInformationList getPublicSpots () throws NoDataAvailableException {
		List<ApiSpotInformation> riverSurfSpots = getApiSpotInformationList(PUBLIC_RIVER_SURF_SPOTS);
		List<ApiSpotInformation> bungeeSurfSpots = getApiSpotInformationList(PUBLIC_BUNGEE_SURF_SPOTS);

		return new ApiSpotInformationList()
				.riverSurfSpots(riverSurfSpots)
				.bungeeSurfSpots(bungeeSurfSpots);
	}

	public ApiSpotInformationList getAllSpots (UserExtId externalId) throws NoDataAvailableException, NoSuchUserException {
		Set<SpotId> privateSpotIds = userDao.getPrivateSpotIds(userDao.getUser(externalId).userId());
		Set<Spot> privateSpots = spotDao.getSpots(privateSpotIds);

		Set<Spot> allRiverSurfSpots = privateSpots.stream()
				.filter(spot -> spot.type().equals(SpotTypeEnum.RIVER_SURF))
				.collect(Collectors.toSet());
		allRiverSurfSpots.addAll(PUBLIC_RIVER_SURF_SPOTS);

		Set<Spot> allBungeeSurfSpots = privateSpots.stream()
				.filter(spot -> spot.type().equals(SpotTypeEnum.BUNGEE_SURF))
				.collect(Collectors.toSet());
		allBungeeSurfSpots.addAll(PUBLIC_BUNGEE_SURF_SPOTS);

		List<ApiSpotInformation> riverSurfSpots = getApiSpotInformationList(allRiverSurfSpots);
		List<ApiSpotInformation> bungeeSurfSpots = getApiSpotInformationList(allBungeeSurfSpots);

		return new ApiSpotInformationList()
				.riverSurfSpots(riverSurfSpots)
				.bungeeSurfSpots(bungeeSurfSpots);
	}

	private List<ApiSpotInformation> getApiSpotInformationList (Set<Spot> spots) throws NoDataAvailableException {
		List<ApiSpotInformation> spotInformationList = new ArrayList<>();
		for (Spot spot : spots) {
			ApiForecast currentForecast = null;
			try {
				currentForecast = forecastApiService.getCurrentForecast(spot.stationId());
			} catch (NoDataAvailableException e) {
				// NOP: This can happen if there is no forecast available for the station
				// (unfortunately not every station has a forecast)
			}

			spotInformationList.add(
					new ApiSpotInformation()
							.name(spot.name())
							.isPublic(spot.isPublic())
							.minFlow(spot.minFlow())
							.maxFlow(spot.maxFlow())
							.stationId(spot.stationId())
							.currentSample(sampleApiService.getCurrentSample(spot.stationId()))
							.forecast(currentForecast)
			);
		}
		return spotInformationList;
	}

	public void addPrivateSpot (Spot spot) {
		spotDao.addPrivateSpot(spot);
		inputDataFetcherService.updateStationIds();
		// fetch data for new spot, to instantly show the new spot to the user...
		inputDataFetcherService.fetchForStationId(spot.stationId());
	}
}
