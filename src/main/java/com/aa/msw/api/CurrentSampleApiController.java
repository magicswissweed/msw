package com.aa.msw.api;

import com.aa.msw.api.dto.CurrentSampleApi;
import com.aa.msw.api.dto.Sample;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CurrentSampleApiController implements CurrentSampleApi {

	@Override
	public ResponseEntity<Sample> getCurrentSample (Integer stationId) {
		return ResponseEntity.ok(new Sample().temperature(10.5).flow(22));
	}
}
