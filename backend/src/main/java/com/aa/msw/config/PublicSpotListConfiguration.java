package com.aa.msw.config;

import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.repository.dao.SpotDao;
import com.aa.msw.model.Spot;
import com.aa.msw.model.SpotTypeEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.stereotype.Component;

import java.util.Set;

// TODO: user_to_spot_table
//  -> on signup: new entry for each of these public spots
//  -> or even better on every call GET spots - because this way we could always add new public spots

@Component
public class PublicSpotListConfiguration {
	private static final Logger LOG = LoggerFactory.getLogger(PublicSpotListConfiguration.class);

	public static final Set<Spot> PUBLIC_RIVER_SURF_SPOTS = Set.of(
			new Spot(new SpotId(), true, SpotTypeEnum.RIVER_SURF, "Bremgarten", 2018, 180, 390),
			new Spot(new SpotId(), true, SpotTypeEnum.RIVER_SURF, "Thun", 2030, 90, 210)
	);

	public static final Set<Spot> PUBLIC_BUNGEE_SURF_SPOTS = Set.of(
			new Spot(new SpotId(), true, SpotTypeEnum.BUNGEE_SURF, "Zürich", 2243, 75, 350),
			new Spot(new SpotId(), true, SpotTypeEnum.BUNGEE_SURF, "Bern", 2135, 80, 360),
			new Spot(new SpotId(), true, SpotTypeEnum.BUNGEE_SURF, "Luzern", 2152, 80, 350),
			new Spot(new SpotId(), true, SpotTypeEnum.BUNGEE_SURF, "Basel", 2091, 850, 2500),
			new Spot(new SpotId(), true, SpotTypeEnum.BUNGEE_SURF, "St. Gallen", 2473, 130, 1300)
	);

	public final SpotDao spotDao;

	public PublicSpotListConfiguration (SpotDao spotDao) {
		this.spotDao = spotDao;
	}

	@ManagedOperation
//	@Scheduled(fixedDelay = 60_000)
	void persistPublicSpots () {
		LOG.info("PERSISTING PUBLIC SPOTS");
		persistSpots(PUBLIC_RIVER_SURF_SPOTS);
		persistSpots(PUBLIC_BUNGEE_SURF_SPOTS);
	}

	private void persistSpots (Set<Spot> spots) {
		spots.forEach(spotDao::persist);
	}
}
