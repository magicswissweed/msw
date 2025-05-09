package com.aa.msw.integrationtest;

import com.aa.msw.helper.PublicSpotListConfiguration;
import io.restassured.RestAssured;
import io.restassured.specification.RequestSpecification;
import org.flywaydb.core.Flyway;
import org.junit.Before;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.given;

/**
 * This class serves as a base class for other test classes.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class IntegrationTest {

    @LocalServerPort
    public int port;

    @Autowired
    public PublicSpotListConfiguration publicSpotListConfiguration;

    @Before
    public void readPort() {
        RestAssured.port = port;
    }

    @BeforeAll
    public void initializePublicSpots(@Autowired Flyway flyway) {
        flyway.clean();
        flyway.migrate();
        publicSpotListConfiguration.persistPublicSpots();
    }

    protected RequestSpecification getTemplateRequest(TestUser user) {
        return given()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + user.token())
                .port(port);
    }
}

