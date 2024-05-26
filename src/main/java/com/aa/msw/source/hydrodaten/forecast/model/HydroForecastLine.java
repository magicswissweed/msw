package com.aa.msw.source.hydrodaten.forecast.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.OffsetDateTime;
import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HydroForecastLine(ArrayList<OffsetDateTime> x, ArrayList<Double> y, String name) {}
