package com.aa.msw.api.current;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.gen.api.ApiSample;
import com.aa.msw.gen.api.SampleApi;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@RestController
public class SampleApiController implements SampleApi {

	private final SampleApiService sampleApiService;

	public SampleApiController (final SampleApiService sampleApiService) {
		this.sampleApiService = sampleApiService;
	}

	@Override
	public ResponseEntity<ApiSample> getCurrentSample (Integer stationId) {
		try {
			ApiSample sample = sampleApiService.getCurrentSample(stationId);
			sampleApiService.searchForNewerSample();
			return ResponseEntity.ok(sample);
		} catch (NoDataAvailableException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@Override
	public ResponseEntity<List<ApiSample>> getLast40DaysSamples (Integer stationId) {
		try {
			return ResponseEntity.ok(sampleApiService.getHistoricalSamples(stationId));
		} catch (IOException | URISyntaxException e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
