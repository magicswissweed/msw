package com.aa.msw.api.spots;

import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.gen.api.ApiSpotInformationList;
import com.aa.msw.gen.api.SpotsApi;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpotsApiController implements SpotsApi {
	private final SpotsApiService spotsApiService;

	public SpotsApiController (SpotsApiService spotsApiService) {
		this.spotsApiService = spotsApiService;
	}

	@Override
	public ResponseEntity<ApiSpotInformationList> getAllSpots () {
		try {
			return ResponseEntity.ok(spotsApiService.getAllSpots(UserContext.getCurrentEmail()));
		} catch (NoDataAvailableException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@Override
	public ResponseEntity<ApiSpotInformationList> getPublicSpots () {
		try {
			return ResponseEntity.ok(spotsApiService.getPublicSpots());
		} catch (NoDataAvailableException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
