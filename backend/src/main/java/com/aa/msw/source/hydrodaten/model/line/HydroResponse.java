package com.aa.msw.source.hydrodaten.model.line;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HydroResponse(HydroPlot plot) {
}
