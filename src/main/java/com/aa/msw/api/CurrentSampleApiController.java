package com.aa.msw.api;

import com.aa.msw.gen.api.CurrentSampleApi;
import com.aa.msw.model.Sample;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CurrentSampleApiController implements CurrentSampleApi {

	private final CurrentSampleApiService currentSampleApiService;

	public CurrentSampleApiController (final CurrentSampleApiService currentSampleApiService) {
		this.currentSampleApiService = currentSampleApiService;
	}

	@Override
	public ResponseEntity<com.aa.msw.gen.api.Sample> getCurrentSample (Integer stationId) {
		Sample sample = currentSampleApiService.getCurrentSample(stationId);

		return ResponseEntity.ok(new com.aa.msw.gen.api.Sample()
				.temperature(sample.getTemperature())
				.flow(sample.flow()));
	}
}
