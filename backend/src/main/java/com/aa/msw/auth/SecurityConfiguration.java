package com.aa.msw.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	@Bean
	public SecurityFilterChain filterChain (HttpSecurity http) throws Exception {
		JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
		http.oauth2ResourceServer(oAuth2ResourceServerConfigurer -> oAuth2ResourceServerConfigurer
				.jwt(withDefaults())
				.jwt(jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(converter)));
		http.authorizeHttpRequests(requests -> requests
				.requestMatchers(getMatchersForRequestsNotToBeAuthenticated()).permitAll()
				.anyRequest().authenticated()
		).httpBasic(withDefaults());
		return http.build();
	}

	RequestMatcher[] getMatchersForRequestsNotToBeAuthenticated() {
		return new AntPathRequestMatcher[]{
				new AntPathRequestMatcher("/spots/public", HttpMethod.GET.toString())
		};
	}
}
