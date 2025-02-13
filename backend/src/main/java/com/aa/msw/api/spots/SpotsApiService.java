package com.aa.msw.api.spots;

import com.aa.msw.api.current.SampleApiService;
import com.aa.msw.api.graph.forecast.ForecastApiService;
import com.aa.msw.api.graph.historical.HistoricalYearsApiService;
import com.aa.msw.api.station.StationApiService;
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
import com.aa.msw.gen.api.ApiStation;
import com.aa.msw.model.*;
import com.aa.msw.source.InputDataFetcherService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SpotsApiService {
    private final SampleApiService sampleApiService;
    private final ForecastApiService forecastApiService;
    private final SampleDao sampleDao;
    private final SpotDao spotDao;
    private final UserToSpotDao userToSpotDao;
    private final InputDataFetcherService inputDataFetcherService;
    private final HistoricalYearsApiService historicalYearsApiService;
    private final StationApiService stationApiService;

    public SpotsApiService(SampleApiService sampleApiService, ForecastApiService forecastApiService, SampleDao sampleDao, SpotDao spotDao, UserToSpotDao userToSpotDao, InputDataFetcherService inputDataFetcherService, HistoricalYearsApiService historicalYearsApiService, StationApiService stationApiService) {
        this.sampleApiService = sampleApiService;
        this.forecastApiService = forecastApiService;
        this.sampleDao = sampleDao;
        this.spotDao = spotDao;
        this.userToSpotDao = userToSpotDao;
        this.inputDataFetcherService = inputDataFetcherService;
        this.historicalYearsApiService = historicalYearsApiService;
        this.stationApiService = stationApiService;
    }

    public ApiSpotInformationList getPublicSpots() throws NoDataAvailableException {
        List<ApiSpotInformation> riverSurfSpots = getApiSpotInformationList(spotDao.getPublicRiverSurfSpots());
        List<ApiSpotInformation> bungeeSurfSpots = getApiSpotInformationList(spotDao.getPublicBungeeSurfSpots());

        return new ApiSpotInformationList()
                .riverSurfSpots(riverSurfSpots)
                .bungeeSurfSpots(bungeeSurfSpots);
    }

    public ApiSpotInformationList getAllSpots() throws NoDataAvailableException, NoSuchUserException {
        List<UserSpot> userSpots = userToSpotDao.getUserSpotsOrdered();

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

    private List<ApiSpotInformation> getApiSpotInformationList(List<Spot> spots) throws NoDataAvailableException {
        List<ApiSpotInformation> spotInformationList = new ArrayList<>();
        for (Spot spot : spots) {
            ApiForecast currentForecast = null;
            try {
                currentForecast = forecastApiService.getCurrentForecast(spot.stationId());
            } catch (NoDataAvailableException e) {
                // NOP: This can happen if there is no forecast available for the station
                // (unfortunately not every station has a forecast)
            }

            try {
                Station station = stationApiService.getStation(spot.stationId());
                ApiStation apiStation = new ApiStation(station.stationId(), station.label(), station.latitude(), station.longitude());

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
                                .historical(historicalYearsApiService.getApiHistoricalYearsData(spot.stationId()))
                                .station(apiStation)
                );
            } catch (NoSuchElementException e) {
                // ignore for the moment and do not add this ApiSpotInformation to the list
                break;
            }
        }
        return spotInformationList;
    }

    public void addPrivateSpot(Spot spot, int position) throws NoSampleAvailableException {
        fetchSamplesAndPersistIfExists(spot.stationId());
        userToSpotDao.addPrivateSpot(spot, position);
        fetchDataForAllStations();
    }

    public void editPrivateSpot(Spot updatedSpot) throws NoSampleAvailableException {
        fetchSamplesAndPersistIfExists(updatedSpot.stationId());
        userToSpotDao.updatePrivateSpot(updatedSpot);
        fetchDataForAllStations();
    }

    private void fetchSamplesAndPersistIfExists(Integer stationId) throws NoSampleAvailableException {
        List<Sample> samples = inputDataFetcherService.fetchForStationId(stationId);
        sampleDao.persistSamplesIfNotExist(samples);
    }

    private void fetchDataForAllStations() {
        inputDataFetcherService.updateStationIds();
        try {
            inputDataFetcherService.fetchDataAndWriteToDb();
        } catch (IOException | URISyntaxException e) {
            // NOP. Should never happen.
            // If something went wrong, the data will get fetched again in a few minutes and the problem fixes itself.
        }
    }

    public void deletePrivateSpot(SpotId spotId) {
        userToSpotDao.deletePrivateSpot(spotId);
    }

    public void orderSpots(List<SpotId> orderedSpotIds) {
        int position = 0;
        for (SpotId spotId : orderedSpotIds) {
            userToSpotDao.setPosition(spotId, position);
            position++;
        }
    }
}
