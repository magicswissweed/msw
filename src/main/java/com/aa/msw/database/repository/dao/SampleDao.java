package com.aa.msw.database.repository.dao;

import com.aa.msw.database.helpers.id.SampleId;
import com.aa.msw.model.Sample;

public interface SampleDao extends Dao<SampleId, Sample> {
	Sample getSomeSample(int stationId);
}
