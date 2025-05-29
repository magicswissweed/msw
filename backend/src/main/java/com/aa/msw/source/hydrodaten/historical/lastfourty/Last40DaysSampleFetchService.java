package com.aa.msw.source.hydrodaten.historical.lastfourty;

import com.aa.msw.model.Last40Days;

import java.net.URISyntaxException;
import java.util.Set;

public interface Last40DaysSampleFetchService {
    Set<Last40Days> fetchLast40DaysSamples(Set<Integer> stationIds) throws URISyntaxException;
}
