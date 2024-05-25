package com.aa.msw.source.existenz;

import com.aa.msw.database.exceptions.NoDataAvailableException;
import com.aa.msw.database.helpers.id.SampleId;
import com.aa.msw.database.repository.dao.SampleDao;
import com.aa.msw.model.Sample;
import com.aa.msw.source.existenz.exception.IncorrectDataReceivedException;
import com.aa.msw.source.existenz.model.ExistenzResponse;
import com.aa.msw.source.existenz.model.ExistenzSample;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduledSampleFetchService {
	private static final List<Integer> STATION_IDS = List.of(2018, 2243);
	private final String existenzUrl;

	private final SampleDao sampleDao;

	public ScheduledSampleFetchService(SampleDao sampleDao) {
		this.sampleDao = sampleDao;
		existenzUrl = getExistenzUrl();
	}

	private static String getExistenzUrl () {
		String locationsString = STATION_IDS.stream()
				.map(Object::toString)
				.collect(Collectors.joining("%2C"));
		return "https://api.existenz.ch/apiv1/hydro/latest?locations=" + locationsString + "&parameters=flow%2C%20temperature&app=MagicSwissWeed&version=0.2.0";
	}

	@Scheduled(fixedRate = 5 * 60 * 1000) // 5 minutes in milliseconds
	public void fetchDataAndPrint() throws IOException, URISyntaxException {
		List<ExistenzSample> existenzSamples = fetchData().payload();
		List<Sample> samples = new ArrayList<>();
		for(Integer stationId : STATION_IDS) {
			samples.add(extractSampleForStationId(existenzSamples, stationId));
		}

		for(Sample sample : samples) {
			persistIfNotExists(sample);
		}
	}

	private void persistIfNotExists (Sample sample) throws NoDataAvailableException {
		if (!sampleDao.getCurrentSample(sample.getStationId()).timestamp().equals(sample.getTimestamp())) {
			sampleDao.persist(sample);
		}
	}

	private static Sample extractSampleForStationId (List<ExistenzSample> samples, Integer stationId) throws IncorrectDataReceivedException {
		List<ExistenzSample> stationSamples = samples.stream()
				.filter(sample -> sample.stationId().equals(stationId.toString()))
				.toList();

		Integer flow = null;
		Double temp = null;
		OffsetDateTime timestamp = null;
		for (ExistenzSample sample : stationSamples) {
			if (sample.par().equals("flow")) {
				flow = (int) sample.value();
				timestamp = Instant.ofEpochSecond(sample.timestamp()).atOffset(ZoneOffset.of("+02:00"));
			} else if (sample.par().equals("temperature")) {
				temp = sample.value();
			}
		}

		if (flow == null || temp == null) {
			throw new IncorrectDataReceivedException("Unable to extract flow and temp for the station " + stationId);
		}

		return new Sample(
				new SampleId(),
				stationId,
				timestamp,
				temp,
				flow);
	}

	private ExistenzResponse fetchData () throws IOException, URISyntaxException {
		HttpURLConnection conn = (HttpURLConnection) new URI(existenzUrl).toURL().openConnection();
		conn.setRequestMethod("GET");
		conn.setRequestProperty("Accept", "application/json");
//		conn.setRequestProperty("Authorization", authHeaderValue);
		if (conn.getResponseCode() != 200) {
			throw new RuntimeException("Failed : HTTP Error code : "
					+ conn.getResponseCode());
		}
		InputStreamReader in = new InputStreamReader(conn.getInputStream());
		BufferedReader br = new BufferedReader(in);
		String response = br.readLine();

		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.readValue(response, new TypeReference<>() {});
	}
}
