package com.aa.msw.integrationtest;

import com.google.gson.Gson;
import io.restassured.RestAssured;
import io.restassured.specification.RequestSpecification;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;

/**
 * This class serves as a base class for other test classes.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@RunWith(SpringRunner.class)
public abstract class IntegrationTest {

	@Value("${msw.firebase.api_key}")
	private String firebaseApiKey;

	@LocalServerPort
	public int port;

	@Before
	public void readPort () {
		RestAssured.port = port;
	}

	protected RequestSpecification getTemplateRequest (TestUser user) {


		return given()
				.header(HttpHeaders.AUTHORIZATION, "Bearer " + getToken(user))
				.port(port);
	}

	private String getToken (TestUser user) {
		String url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + firebaseApiKey;
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("email", user.email());
		requestBody.put("password", user.password());
		requestBody.put("returnSecureToken", true);
		HttpEntity<?> httpEntity = new HttpEntity<>(requestBody, new HttpHeaders());
		ResponseEntity<String> response = new RestTemplate().exchange(url, HttpMethod.POST, httpEntity, String.class);
		String responseString = response.getBody();
		return new Gson()
				.fromJson(responseString, LoginOutputFromFirebase.class)
				.idToken;
	}

	public record LoginOutputFromFirebase(String idToken,
										  String email,
										  String refreshToken,
										  String expiresIn,
										  String localId) {
	}
}

