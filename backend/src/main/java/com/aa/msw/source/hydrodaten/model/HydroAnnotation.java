package com.aa.msw.source.hydrodaten.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HydroAnnotation(String xref, String x) {
}
