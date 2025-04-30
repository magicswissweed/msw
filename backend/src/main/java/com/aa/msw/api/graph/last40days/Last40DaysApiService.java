package com.aa.msw.api.graph.last40days;

import com.aa.msw.model.Last40Days;

import java.util.Map;

public interface Last40DaysApiService {
    Map<Integer, Last40Days> getLast40Days();

    Last40Days getLast40Days(Integer stationId);

    void fetchLast40DaysAndSaveToDb();


}
