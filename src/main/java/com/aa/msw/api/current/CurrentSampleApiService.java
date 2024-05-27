package com.aa.msw.api.current;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.gen.api.ApiSample;
import com.aa.msw.model.Sample;
import org.springframework.stereotype.Service;

@Service
public class CurrentSampleApiService {

	private final SampleDao sampleDao;

	CurrentSampleApiService (final SampleDao sampleDao) {
		this.sampleDao = sampleDao;
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
}
