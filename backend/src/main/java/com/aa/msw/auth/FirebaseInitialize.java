package com.aa.msw.auth;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.gson.Gson;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@Profile("!test")
@Service
public class FirebaseInitialize {

    private final FirebaseConfigProperties firebaseConfigProperties;
    @Value("${spring.datasource.url}")
    String databaseUrl;

    public FirebaseInitialize(FirebaseConfigProperties firebaseConfigProperties) {
        this.firebaseConfigProperties = firebaseConfigProperties;
    }

    @PostConstruct
    public void initialize() {
        try {
            setPrivateKeyDependingOnLocalOderDockerImage();

            String serviceAccountJson = new Gson().toJson(firebaseConfigProperties);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(new ByteArrayInputStream(serviceAccountJson.getBytes(StandardCharsets.UTF_8))))
                    .build();

            FirebaseApp.initializeApp(options);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void setPrivateKeyDependingOnLocalOderDockerImage() {
        String privateKey = firebaseConfigProperties.getPrivate_key();
        String firebasePrivateKeyFromEnv = System.getenv("FIREBASE_PRIVATE_KEY");
        if (firebasePrivateKeyFromEnv != null) {
            privateKey = firebasePrivateKeyFromEnv;
        }
        firebaseConfigProperties.setPrivate_key(privateKey.replace("\\n", "\n"));
    }

    @Component
    @ConfigurationProperties(prefix = "firebase")
    @Data
    public static class FirebaseConfigProperties {
        private String type;
        private String project_id;
        private String private_key;
        private String private_key_id;
        private String client_email;
        private String client_id;
        private String token_uri;
    }
}
