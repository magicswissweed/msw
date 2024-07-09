package com.aa.msw.source.existenz.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ExistenzSample(int timestamp,
                             @JsonProperty("loc") String stationId,
                             String par,
                             @JsonProperty("val") double value) {
}
