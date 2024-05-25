package com.aa.msw.source;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;

public class AbstractFetchService {

	protected static String fetchAsString (String url) throws IOException, URISyntaxException {
		HttpURLConnection conn = (HttpURLConnection) new URI(url).toURL().openConnection();
		conn.setRequestMethod("GET");
		conn.setRequestProperty("Accept", "application/json");
//		conn.setRequestProperty("Authorization", authHeaderValue);
		if (conn.getResponseCode() != 200) {
			throw new RuntimeException("Failed : HTTP Error code : "
					+ conn.getResponseCode());
		}
		InputStreamReader in = new InputStreamReader(conn.getInputStream());
		BufferedReader br = new BufferedReader(in);
		return br.readLine();
	}
}
