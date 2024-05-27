package com.aa.msw.source.hydrodaten.forecast.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HydroForecast(HydroPlot plot) { }
