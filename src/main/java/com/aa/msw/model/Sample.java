package com.aa.msw.model;

import com.aa.msw.database.helpers.id.HasId;
import com.aa.msw.database.helpers.id.SampleId;
import lombok.Getter;

import java.time.OffsetDateTime;

public record Sample(
		SampleId sampleId,
		@Getter int stationId,
		@Getter OffsetDateTime timestamp,
		@Getter double temperature,
		@Getter int flow)
		implements HasId<SampleId> {
	@Override
	public SampleId getId () {
		return sampleId;
	}
}
