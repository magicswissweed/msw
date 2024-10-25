package com.aa.msw.source.hydrodaten;

import com.aa.msw.source.AbstractFetchService;
import com.aa.msw.source.hydrodaten.model.line.HydroLine;
import com.aa.msw.source.hydrodaten.model.line.HydroResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

public abstract class AbstractLineFetchService extends AbstractFetchService {

    private final String fetchUrlPrefix;
    private final String fetchUrlSuffix;

    protected AbstractLineFetchService(String fetchUrlPrefix, String fetchUrlSuffix) {
        super();
        this.fetchUrlPrefix = fetchUrlPrefix;
        this.fetchUrlSuffix = fetchUrlSuffix;
    }

    protected static String fetchAsString(String url) throws IOException, URISyntaxException {
        HttpURLConnection conn = (HttpURLConnection) new URI(url).toURL().openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");
//		conn.setRequestProperty("Authorization", authHeaderValue);
        if ((conn.getResponseCode() != 200) && (conn.getResponseCode() != 404)) {
            throw new RuntimeException("Failed : HTTP Error code : "
                    + conn.getResponseCode());
        }
        InputStreamReader in = new InputStreamReader(conn.getInputStream());
        BufferedReader br = new BufferedReader(in);
        return br.readLine();
    }

    protected static Map<OffsetDateTime, Double> mapLine(HydroLine hydroLine) throws IOException {
        if (hydroLine.x().size() > hydroLine.y().size()) {
            throw new IOException("Should be the same number of dates as values.");
        }
        Map<OffsetDateTime, Double> line = new LinkedHashMap<>();
        for (int i = 0; i < hydroLine.x().size(); i++) {
            line.put(hydroLine.x().get(i), hydroLine.y().get(i));
        }
        return line;
    }

    protected HydroResponse fetchFromHydro(int stationId) throws IOException, URISyntaxException {
        String response = fetchAsString(fetchUrlPrefix + stationId + fetchUrlSuffix);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper.readValue(response, new TypeReference<>() {
        });
    }
}
