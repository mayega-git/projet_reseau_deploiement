package com.example.user_interactive_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


// @Configuration  // Désactivé pour éviter conflit avec le monolithe
public class RatingSwaggerConfig {
    // @Bean  // Bean désactivé - utiliser la config du monolithe
    public OpenAPI ratingsOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Review microservice API")
                        .version("1.0")
                        .description("API for managing users and followers"));
    }
}

