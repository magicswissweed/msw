package com.aa.msw.api.spots;

import com.aa.msw.api.current.SampleApiService;
import com.aa.msw.api.forecast.ForecastApiService;
import com.aa.msw.config.Spot;
import com.aa.msw.config.SpotList;
import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.gen.api.ApiForecast;
import com.aa.msw.gen.api.ApiSpotInformation;
import com.aa.msw.gen.api.ApiSpotInformationList;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.aa.msw.config.SpotListConfiguration.ALL_SPOTS;
import static com.aa.msw.config.SpotListConfiguration.PUBLIC_SPOTS;

@Service
public class SpotsApiService {
	private final SampleApiService sampleApiService;
	private final ForecastApiService forecastApiService;

	public SpotsApiService (SampleApiService sampleApiService, ForecastApiService forecastApiService) {
		this.sampleApiService = sampleApiService;
		this.forecastApiService = forecastApiService;
	}

	public ApiSpotInformationList getSpots (Boolean includeAll) throws NoDataAvailableException {
		SpotList spotList = includeAll ? ALL_SPOTS : PUBLIC_SPOTS;

		List<ApiSpotInformation> riverSurfSpots = getApiSpotInformationList(spotList.riverSurfSpots());
		List<ApiSpotInformation> bungeeSurfSpots = getApiSpotInformationList(spotList.bungeeSurfSpots());

		return new ApiSpotInformationList()
				.riverSurfSpots(riverSurfSpots)
				.bungeeSurfSpots(bungeeSurfSpots);
	}

	private List<ApiSpotInformation> getApiSpotInformationList (List<Spot> spots) throws NoDataAvailableException {
		List<ApiSpotInformation> spotInformationList = new ArrayList<>();
		for (Spot spot : spots) {
			ApiForecast currentForecast = null;
			try {
				currentForecast = forecastApiService.getCurrentForecast(spot.stationId());
			} catch(NoDataAvailableException e) {
				// NOP: This can happen if there is no forecast available for the station
				// (unfortunately not every station has a forecast)
			}

			spotInformationList.add(
					new ApiSpotInformation()
							.name(spot.name())
							.minFlow(spot.minFlow())
							.maxFlow(spot.maxFlow())
							.stationId(spot.stationId())
							.currentSample(sampleApiService.getCurrentSample(spot.stationId()))
							.forecast(currentForecast)
			);
		}
		return spotInformationList;
	}
}
