package com.aa.msw.database.repository.dao;

import com.aa.msw.database.helpers.id.HistoricalYearsDataId;
import com.aa.msw.model.HistoricalYearsData;

import java.util.Set;

public interface HistoricalYearsDataDao extends Dao<HistoricalYearsDataId, HistoricalYearsData> {
    Set<HistoricalYearsData> getAllHistoricalYearsData();

    void deleteAll();
}
