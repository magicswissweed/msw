package com.aa.msw.source.existenz.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public record ExistenzResponse(String source,
                               @JsonProperty("apiurl") String apiUrl,
                               String opendata,
                               String license,
                               ArrayList<ExistenzSample> payload) {
}