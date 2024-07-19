package com.aa.msw.api;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final HandlerInterceptor requestUserInterceptor;

    public WebConfig(HandlerInterceptor requestUserInterceptor) {
        this.requestUserInterceptor = requestUserInterceptor;
    }

    private static void addAccessControlAllowOriginHeaders(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders("*")
                .allowedMethods("*")
                .allowedOrigins("*")
                .exposedHeaders("ETag");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requestUserInterceptor);
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        addAccessControlAllowOriginHeaders(registry);
        WebMvcConfigurer.super.addCorsMappings(registry);
    }
}