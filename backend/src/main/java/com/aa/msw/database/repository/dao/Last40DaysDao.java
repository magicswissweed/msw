package com.aa.msw.database.repository.dao;

import com.aa.msw.database.helpers.id.Last40DaysId;
import com.aa.msw.model.HistoricalYearsData;
import com.aa.msw.model.Last40Days;

import java.util.Set;

public interface Last40DaysDao extends Dao<Last40DaysId, Last40Days> {
    Set<HistoricalYearsData> getAllHistoricalYearsData();

    void deleteAll();
}
