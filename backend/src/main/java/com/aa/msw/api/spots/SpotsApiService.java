package com.aa.msw.api.spots;

import com.aa.msw.api.current.SampleApiService;
import com.aa.msw.api.forecast.ForecastApiService;
import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.exceptions.NoSampleAvailableException;
import com.aa.msw.database.exceptions.NoSuchUserException;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.database.repository.dao.UserToSpotDao;
import com.aa.msw.gen.api.ApiForecast;
import com.aa.msw.gen.api.ApiSpotInformation;
import com.aa.msw.gen.api.ApiSpotInformationList;
import com.aa.msw.model.Sample;
import com.aa.msw.model.Spot;
import com.aa.msw.model.SpotTypeEnum;
import com.aa.msw.model.UserSpot;
import com.aa.msw.source.InputDataFetcherService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpotsApiService {
	private final SampleApiService sampleApiService;
	private final ForecastApiService forecastApiService;
	private final SampleDao sampleDao;
	private final SpotDao spotDao;
	private final UserToSpotDao userToSpotDao;
	private final InputDataFetcherService inputDataFetcherService;

	public SpotsApiService (SampleApiService sampleApiService, ForecastApiService forecastApiService, SampleDao sampleDao, SpotDao spotDao, UserToSpotDao userToSpotDao, InputDataFetcherService inputDataFetcherService) {
		this.sampleApiService = sampleApiService;
		this.forecastApiService = forecastApiService;
		this.sampleDao = sampleDao;
		this.spotDao = spotDao;
		this.userToSpotDao = userToSpotDao;
		this.inputDataFetcherService = inputDataFetcherService;
	}

	public ApiSpotInformationList getPublicSpots () throws NoDataAvailableException {
		List<ApiSpotInformation> riverSurfSpots = getApiSpotInformationList(spotDao.getPublicRiverSurfSpots());
		List<ApiSpotInformation> bungeeSurfSpots = getApiSpotInformationList(spotDao.getPublicBungeeSurfSpots());

		return new ApiSpotInformationList()
				.riverSurfSpots(riverSurfSpots)
				.bungeeSurfSpots(bungeeSurfSpots);
	}

	public ApiSpotInformationList getAllSpots () throws NoDataAvailableException, NoSuchUserException {
		List<UserSpot> userSpots = userToSpotDao.getUserSpotsOrdered(UserContext.getCurrentUser().userId());

		List<ApiSpotInformation> apiRiverSurfSpots = getApiSpotInformationList(
				userSpots.stream()
						.map(UserSpot::spot)
						.filter(spot -> spot.type().equals(SpotTypeEnum.RIVER_SURF))
						.toList());
		List<ApiSpotInformation> apiBungeeSurfSpots = getApiSpotInformationList(
				userSpots.stream()
						.map(UserSpot::spot)
						.filter(spot -> spot.type().equals(SpotTypeEnum.BUNGEE_SURF))
						.toList());

		return new ApiSpotInformationList()
				.riverSurfSpots(apiRiverSurfSpots)
				.bungeeSurfSpots(apiBungeeSurfSpots);
	}

	private List<ApiSpotInformation> getApiSpotInformationList (List<Spot> spots) throws NoDataAvailableException {
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
							.id(spot.spotId().getId())
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

	public void addPrivateSpot (Spot spot, int position) throws NoSampleAvailableException {
		List<Sample> samples = inputDataFetcherService.fetchForStationId(spot.stationId());
		sampleDao.persistSamplesIfNotExist(samples);

		userToSpotDao.addPrivateSpot(spot, position);
		inputDataFetcherService.updateStationIds();
	}

	public void deletePrivateSpot (SpotId spotId) {
		userToSpotDao.deletePrivateSpot(spotId);
	}

	public void orderSpots (List<SpotId> orderedSpotIds) {
		int position = 0;
		for (SpotId spotId : orderedSpotIds) {
			userToSpotDao.setPosition(spotId, position);
			position++;
		}
	}
}
