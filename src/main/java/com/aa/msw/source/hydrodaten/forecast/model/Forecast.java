package com.aa.msw.source.hydrodaten.forecast.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Forecast(Plot plot) { }
