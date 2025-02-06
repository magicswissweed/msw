package com.aa.msw.model;

import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.Map;

public record HistoricalYearsData(
        @Getter int stationId,
        @Getter Map<OffsetDateTime, Double> median,
        @Getter Map<OffsetDateTime, Double> twentyFivePercentile,
        @Getter Map<OffsetDateTime, Double> seventyFivePercentile,
        @Getter Map<OffsetDateTime, Double> max,
        @Getter Map<OffsetDateTime, Double> min,
        @Getter Map<OffsetDateTime, Double> currentYear) { }
