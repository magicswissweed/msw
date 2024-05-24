package com.aa.msw.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestApi {
	@RequestMapping(
			method = RequestMethod.GET,
			value = "/test"
	)
	public ResponseEntity<String> getTest () {
		return ResponseEntity.ok("Hello World");
	}
}
