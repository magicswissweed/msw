package com.aa.msw.auth;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class FirebaseInitialize {

	@Value("${spring.datasource.url}")
	String databaseUrl;

	@Value("${firebase.service-account.path}")
	String serviceAccountDir;

	@PostConstruct
	public void initialize() {
		try {
			ClassPathResource serviceAccount = new ClassPathResource(serviceAccountDir);

			FirebaseOptions options = FirebaseOptions.builder()
					.setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
					.build();

			FirebaseApp.initializeApp(options);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
