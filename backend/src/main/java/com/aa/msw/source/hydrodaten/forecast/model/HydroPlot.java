package com.aa.msw.source.hydrodaten.forecast.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HydroPlot(HydroLayout layout, ArrayList<HydroForecastLine> data) {}
