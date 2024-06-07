package com.aa.msw.source.hydrodaten.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.OffsetDateTime;
import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HydroLine(ArrayList<OffsetDateTime> x, ArrayList<Double> y, String name) {}
