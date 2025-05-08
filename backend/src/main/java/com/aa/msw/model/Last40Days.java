package com.aa.msw.model;

import com.aa.msw.database.helpers.id.HasId;
import com.aa.msw.database.helpers.id.Last40DaysId;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.Map;

public record Last40Days(
        @Getter Last40DaysId databaseId,
        @Getter int stationId,
        @Getter Map<OffsetDateTime, Double> last40DaysSamples) implements HasId<Last40DaysId> {
    @Override
    public Last40DaysId getId() {
        return databaseId;
    }
}
