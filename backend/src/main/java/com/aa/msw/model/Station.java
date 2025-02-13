package com.aa.msw.model;

public record Station(
        Integer stationId,
        String label,
        Double latitude,
        Double longitude){ }
