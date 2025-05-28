package com.aa.msw.api.spots;

import com.aa.msw.api.current.SampleApiService;
import com.aa.msw.api.station.StationApiService;
import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.exceptions.NoSampleAvailableException;
import com.aa.msw.database.exceptions.NoSuchUserException;
import com.aa.msw.database.helpers.UserToSpot;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.database.repository.dao.UserToSpotDao;
import com.aa.msw.gen.api.ApiSpotInformation;
import com.aa.msw.gen.api.ApiStation;
import com.aa.msw.model.Sample;
import com.aa.msw.model.Spot;
import com.aa.msw.model.Station;
import com.aa.msw.model.UserSpot;
import com.aa.msw.source.InputDataFetcherService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SpotsApiService {
    private final SampleApiService sampleApiService;
    private final SampleDao sampleDao;
    private final SpotDao spotDao;
    private final UserToSpotDao userToSpotDao;
    private final InputDataFetcherService inputDataFetcherService;
    private final StationApiService stationApiService;

    public SpotsApiService(SampleApiService sampleApiService, SampleDao sampleDao, SpotDao spotDao, UserToSpotDao userToSpotDao, InputDataFetcherService inputDataFetcherService, StationApiService stationApiService) {
        this.sampleApiService = sampleApiService;
        this.sampleDao = sampleDao;
        this.spotDao = spotDao;
        this.userToSpotDao = userToSpotDao;
        this.inputDataFetcherService = inputDataFetcherService;
        this.stationApiService = stationApiService;
    }

    // TODO: make private and use getSpots()
    public List<ApiSpotInformation> getPublicSpots() throws NoDataAvailableException {
        return getApiSpotInformationList(spotDao.getPublicSpots());
    }

    // TODO: make private and use getSpots()
    public List<ApiSpotInformation> getAllSpots() throws NoDataAvailableException, NoSuchUserException {
        List<Spot> userSpots = userToSpotDao.getUserSpotsOrdered().stream()
                .map(UserSpot::spot)
                .collect(Collectors.toList());
        return getApiSpotInformationList(userSpots);
    }

    public Set<Integer> getStationsForUser() {
        return getSpots()
                .stream()
                .map(i -> i.getStation().getId())
                .collect(Collectors.toSet());
    }

    private List<ApiSpotInformation> getSpots() {
        try {
            if (UserContext.getCurrentUser() == null) {
                return getPublicSpots();
            } else {
                return getAllSpots();
            }
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<ApiSpotInformation> getApiSpotInformationList(List<Spot> spots) throws NoDataAvailableException {
        List<ApiSpotInformation> spotInformationList = new ArrayList<>();
        for (Spot spot : spots) {
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
                                .spotType(com.aa.msw.gen.api.ApiSpotInformation.SpotTypeEnum.valueOf(spot.type().name()))
                                .currentSample(sampleApiService.getCurrentSample(spot.stationId()))
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

    public void editSpot(Spot updatedSpot) throws NoSampleAvailableException {
        if (spotDao.isPublicSpot(updatedSpot.spotId())) {
            Spot newPrivateSpot = new Spot(
                    new SpotId(), // needs new ID - not the same as the old spot
                    updatedSpot.isPublic(),
                    updatedSpot.type(),
                    updatedSpot.name(),
                    updatedSpot.stationId(),
                    updatedSpot.minFlow(),
                    updatedSpot.maxFlow()
            );
            UserToSpot oldUserToPublicSpotMapping = userToSpotDao.get(UserContext.getCurrentUser().userId(), updatedSpot.spotId());
            deleteMapping(oldUserToPublicSpotMapping);
            addPrivateSpot(newPrivateSpot, oldUserToPublicSpotMapping.position());
        } else {
            editPrivateSpot(updatedSpot);
        }
    }

    private void deleteMapping(UserToSpot oldUserToPublicSpotMapping) {
        userToSpotDao.delete(oldUserToPublicSpotMapping);
    }

    private void editPrivateSpot(Spot updatedSpot) throws NoSampleAvailableException {
        fetchSamplesAndPersistIfExists(updatedSpot.stationId());
        userToSpotDao.updatePrivateSpot(updatedSpot);
        fetchDataForAllStations();
    }

    private void fetchSamplesAndPersistIfExists(Integer stationId) throws NoSampleAvailableException {
        List<Sample> samples = inputDataFetcherService.fetchForStationId(stationId);
        sampleDao.persistSamplesIfNotExist(samples);
    }

    private void fetchDataForAllStations() {
        // TODO: refactor: only fetch new data if necessary (if the station is new and there is no data for it)
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
