package com.aa.msw.api.spots;

import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.exceptions.NoSuchUserException;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.gen.api.ApiSpot;
import com.aa.msw.gen.api.ApiSpotInformationList;
import com.aa.msw.gen.api.SpotsApi;
import com.aa.msw.model.Spot;
import com.aa.msw.model.SpotTypeEnum;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class SpotsApiController implements SpotsApi {
	private final SpotsApiService spotsApiService;

	public SpotsApiController (SpotsApiService spotsApiService) {
		this.spotsApiService = spotsApiService;
	}

	@Override
	public ResponseEntity<ApiSpotInformationList> getAllSpots () {
		try {
			return ResponseEntity.ok(spotsApiService.getAllSpots(UserContext.getCurrentUser().externalId()));
		} catch (NoDataAvailableException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (NoSuchUserException e) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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

	@Override
	public ResponseEntity<Void> addPrivateSpot (ApiSpot apiSpot) {
		Spot spot = new Spot(
				new SpotId(),
				false,
				getSpotTypeEnum(apiSpot.getSpotType()),
				apiSpot.getName(),
				apiSpot.getStationId(),
				apiSpot.getMinFlow(),
				apiSpot.getMaxFlow()
		);
		spotsApiService.addPrivateSpot(spot);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Void> deletePrivateSpot (UUID spotId) {
		spotsApiService.deletePrivateSpot(new SpotId(spotId));
		return new ResponseEntity<>(HttpStatus.OK);
	}

	private static SpotTypeEnum getSpotTypeEnum (ApiSpot.SpotTypeEnum spotType) {
		return switch (spotType) {
			case RIVER_SURF -> SpotTypeEnum.RIVER_SURF;
			case BUNGEE_SURF -> SpotTypeEnum.BUNGEE_SURF;
		};
	}
}
