package com.aa.msw.integrationtest.spots;

import com.aa.msw.integrationtest.IntegrationTest;
import com.aa.msw.integrationtest.TestUser;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.hamcrest.Matchers.hasSize;

public class SpotsTest extends IntegrationTest {
    public static final String ALL_SPOTS_URL = "/spots/all";

    @Test
    public void shouldBeAbleToFetchAllSpots() {
        getTemplateRequest(TestUser.THE_ONE)
                .get(ALL_SPOTS_URL)
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("riverSurfSpots", hasSize(2))
                .body("bungeeSurfSpots", hasSize(5));
    }
}
