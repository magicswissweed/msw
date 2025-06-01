package com.aa.msw.source.existenz.sample;

import com.aa.msw.model.Sample;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

public interface SampleFetchService {
    List<Sample> fetchSamples(Set<Integer> stationIds) throws IOException, URISyntaxException;
}
