package com.aa.msw.api;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings (@NonNull CorsRegistry registry) {
		addAccessControlAllowOriginHeaders(registry);
		WebMvcConfigurer.super.addCorsMappings(registry);
	}

	private static void addAccessControlAllowOriginHeaders (CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedHeaders("*")
				.allowedMethods("*")
				.allowedOrigins("*")
				.exposedHeaders("ETag");
	}
}