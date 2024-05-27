package com.aa.msw.api.current;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.gen.api.ApiSample;
import com.aa.msw.model.Sample;
import com.aa.msw.source.InputDataFetcherService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;

@Service
public class CurrentSampleApiService {

	private final SampleDao sampleDao;
	private final InputDataFetcherService inputDataFetcherService;

	CurrentSampleApiService (final SampleDao sampleDao, InputDataFetcherService inputDataFetcherService) {
		this.sampleDao = sampleDao;
		this.inputDataFetcherService = inputDataFetcherService;
	}

	public ApiSample getCurrentSample (Integer stationId) throws NoDataAvailableException {
		return mapSample(sampleDao.getCurrentSample(stationId));
	}

	private static ApiSample mapSample (Sample sample) {
		return new ApiSample()
				.timestamp(sample.getTimestamp())
				.temperature(sample.getTemperature())
				.flow(sample.flow());
	}

	public void searchForNewerSample () {
		try {
			inputDataFetcherService.fetchAndWriteSamples();
		} catch (IOException | URISyntaxException e) {
			// NOP
		}

	}
}
