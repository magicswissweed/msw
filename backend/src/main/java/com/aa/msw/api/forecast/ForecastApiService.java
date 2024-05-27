package com.aa.msw.api.forecast;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.repository.dao.ForecastDao;
import com.aa.msw.gen.api.ApiForecast;
import com.aa.msw.gen.api.ApiForecastLineEntry;
import com.aa.msw.model.Forecast;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ForecastApiService {

	private final ForecastDao forecastDao;

	public ForecastApiService (ForecastDao forecastDao) {
		this.forecastDao = forecastDao;
	}


	public ApiForecast getCurrentForecast (Integer stationId) throws NoDataAvailableException {
		return mapForecast(forecastDao.getCurrentForecast(stationId));
	}

	private static ApiForecast mapForecast (Forecast forecast) {
		ApiForecast apiForecast = new ApiForecast();
		apiForecast.setTimestamp(forecast.getTimestamp());
		apiForecast.setMeasuredData(mapApiForecastLine(forecast.getMeasuredData()));
		apiForecast.setMedian(mapApiForecastLine(forecast.getMedian()));
		apiForecast.setTwentyFiveToSeventyFivePercentile(mapApiForecastLine(forecast.getTwentyFiveToSeventyFivePercentile()));
		apiForecast.setMin(mapApiForecastLine(forecast.getMin()));
		apiForecast.setMax(mapApiForecastLine(forecast.getMax()));
		return apiForecast;
	}

	private static List<ApiForecastLineEntry> mapApiForecastLine (Map<OffsetDateTime, Double> input) {
		return input.entrySet().stream()
				.map(entry -> {
					ApiForecastLineEntry output = new ApiForecastLineEntry();
					output.setTimestamp(entry.getKey());
					output.setFlow(entry.getValue());
					return output;
				})
				.collect(Collectors.toList());
	}
}
