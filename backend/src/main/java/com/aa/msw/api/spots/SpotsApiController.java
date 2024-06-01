package com.aa.msw.api.spots;

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
	public ResponseEntity<ApiSpotInformationList> getSpots (Boolean includeAll) {
		try {
			if(includeAll == null) {
				includeAll = false;
			}
			return ResponseEntity.ok(spotsApiService.getSpots(includeAll));
		} catch (NoDataAvailableException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
