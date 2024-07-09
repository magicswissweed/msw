package com.aa.msw.source.hydrodaten.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HydroPlot(HydroLayout layout, ArrayList<HydroLine> data) {
}
