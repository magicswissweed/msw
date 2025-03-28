package com.aa.msw.api.graph.historical;

import com.aa.msw.api.graph.AbstractGraphLineApiService;
import com.aa.msw.api.station.StationApiService;
import com.aa.msw.gen.api.ApiHistoricalYears;
import com.aa.msw.model.HistoricalYearsData;
import com.aa.msw.model.Station;
import com.aa.msw.source.hydrodaten.historical.years.HistoricalYearsDataFetchService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class HistoricalYearsApiService extends AbstractGraphLineApiService {

    private final HistoricalYearsDataFetchService historicalYearsDataFetchService;
    private final StationApiService stationApiService;
    private Map<Integer, HistoricalYearsData> historicalYearsData;

    public HistoricalYearsApiService(HistoricalYearsDataFetchService historicalYearsDataFetchService, StationApiService stationApiService) {
        super();
        this.historicalYearsDataFetchService = historicalYearsDataFetchService;
        this.stationApiService = stationApiService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void fetchData() {
        // fetch historical Years Data for all available stations and save In-Memory
        // TODO: in the future this could be saved to the db, as this would make the startup faster
        //  and the data only changes once per year (or maybe if theres a new station)
        try {
            if(historicalYearsData == null) {
                Set<Station> stations = stationApiService.getStations();
                List<HistoricalYearsData> historicalYearsDataList = historicalYearsDataFetchService.fetchHistoricalYearsData(
                                stations.stream().map(Station::stationId).collect(Collectors.toSet()));
                this.historicalYearsData = historicalYearsDataList.stream().collect(Collectors.toMap(HistoricalYearsData::stationId, h -> h));
            }
        } catch (URISyntaxException e) {
            // nop
        }
    }

    public ApiHistoricalYears getApiHistoricalYearsData(Integer stationId) {
        HistoricalYearsData historicData = this.historicalYearsData.get(stationId);
        ApiHistoricalYears apiHistoricalYears = new ApiHistoricalYears();
        apiHistoricalYears.setMedian(mapApiLine(historicData.getMedian()));
        apiHistoricalYears.setTwentyFivePercentile(mapApiLine(historicData.getTwentyFivePercentile()));
        apiHistoricalYears.setSeventyFivePercentile(mapApiLine(historicData.getSeventyFivePercentile()));
        apiHistoricalYears.setMin(mapApiLine(historicData.getMin()));
        apiHistoricalYears.setMax(mapApiLine(historicData.getMax()));
        apiHistoricalYears.setCurrentYear(mapApiLine(historicData.getCurrentYear()));
        return apiHistoricalYears;
    }
}
