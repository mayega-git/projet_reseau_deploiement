package com.example.newsletter_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NewsletterSwaggerConfig {
    @Bean
    public OpenAPI newsletterOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Newsletter Microservice API")
                        .version("1.0")
                        .description("API for managing newsletters"));
    }
}
