package com.aa.msw.source.existenz.station.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;

public record ExistenzResponseStation(String source,
                                      @JsonProperty("apiurl") String apiUrl,
                                      String opendata,
                                      String license,
                                      HashMap<String, ExistenzStation> payload) {
}