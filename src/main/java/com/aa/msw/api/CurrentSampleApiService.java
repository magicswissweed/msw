package com.aa.msw.api;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.model.Sample;
import org.springframework.stereotype.Service;

@Service
public class CurrentSampleApiService {

	private final SampleDao sampleDao;

	CurrentSampleApiService (final SampleDao sampleDao) {
		this.sampleDao = sampleDao;
	}

	public Sample getCurrentSample (Integer stationId) throws NoDataAvailableException {
		return sampleDao.getCurrentSample(stationId);
	}
}
