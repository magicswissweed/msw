package com.aa.msw.api.graph.historical;

import com.aa.msw.api.graph.AbstractGraphLineApiService;
import com.aa.msw.gen.api.ApiHistoricalYears;
import com.aa.msw.model.HistoricalYearsData;
import org.springframework.stereotype.Service;

@Service
public class HistoricalYearsApiService extends AbstractGraphLineApiService {
    private final HistoricalYearsAccessorService historicalYearsAccessorService;

    public HistoricalYearsApiService(HistoricalYearsAccessorService historicalYearsAccessorService) {
        super();
        this.historicalYearsAccessorService = historicalYearsAccessorService;
    }

    public ApiHistoricalYears getApiHistoricalYearsData(Integer stationId) {
        HistoricalYearsData historicData = historicalYearsAccessorService.getHistoricalYearsData().get(stationId);
        if(historicData == null) {
            return null;
        }
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
