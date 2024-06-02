package com.aa.msw.api.spots;

import com.aa.msw.api.current.CurrentSampleApiService;
import com.aa.msw.api.forecast.ForecastApiService;
import com.aa.msw.config.Spot;
import com.aa.msw.config.SpotList;
import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.gen.api.ApiSpotInformation;
import com.aa.msw.gen.api.ApiSpotInformationList;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.aa.msw.config.SpotListConfiguration.ALL_SPOTS;
import static com.aa.msw.config.SpotListConfiguration.PUBLIC_SPOTS;

@Service
public class SpotsApiService {
	private final CurrentSampleApiService currentSampleApiService;
	private final ForecastApiService forecastApiService;

	public SpotsApiService (CurrentSampleApiService currentSampleApiService, ForecastApiService forecastApiService) {
		this.currentSampleApiService = currentSampleApiService;
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
			spotInformationList.add(new ApiSpotInformation()
							.name(spot.name())
							.minFlow(spot.minFlow())
							.maxFlow(spot.maxFlow())
							.stationId(spot.stationId())
							.currentSample(currentSampleApiService.getCurrentSample(spot.stationId()))
							.forecast(forecastApiService.getCurrentForecast(spot.stationId()))
			);
		}
		return spotInformationList;
	}
}
