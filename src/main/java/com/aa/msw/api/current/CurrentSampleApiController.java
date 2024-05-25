package com.aa.msw.api.current;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.gen.api.ApiSample;
import com.aa.msw.gen.api.CurrentSampleApi;
import com.aa.msw.model.Sample;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CurrentSampleApiController implements CurrentSampleApi {

	private final CurrentSampleApiService currentSampleApiService;

	public CurrentSampleApiController (final CurrentSampleApiService currentSampleApiService) {
		this.currentSampleApiService = currentSampleApiService;
	}

	@Override
	public ResponseEntity<ApiSample> getCurrentSample (Integer stationId) {
		try {
			Sample sample = currentSampleApiService.getCurrentSample(stationId);
			return ResponseEntity.ok(new ApiSample()
					.timestamp(sample.getTimestamp())
					.temperature(sample.getTemperature())
					.flow(sample.flow()));
		} catch (NoDataAvailableException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
