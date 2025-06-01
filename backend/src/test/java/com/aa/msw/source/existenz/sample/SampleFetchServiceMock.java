package com.aa.msw.source.existenz.sample;

import com.aa.msw.database.helpers.id.SampleId;
import com.aa.msw.model.Sample;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Profile("test")
@Service
class SampleFetchServiceMock implements SampleFetchService {

    @Override
    public List<Sample> fetchSamples(Set<Integer> stationIds) {
        return List.of(
                sample(2018, Optional.of(15.0), 200),
                sample(2243, Optional.of(14.0), 100),
                sample(2105, Optional.empty(), 20)
        );
    }

    private Sample sample(int stationId, Optional<Double> temperature, int flow) {
        return new Sample(
                new SampleId(),
                stationId,
                OffsetDateTime.of(2025, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC),
                temperature,
                flow);
    }

}
