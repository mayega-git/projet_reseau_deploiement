package com.letsgo.education_service.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EducationSwaggerConfig {
    @Bean
    @org.springframework.context.annotation.Primary
    public OpenAPI educationOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Education Service")
                        .version("3.0")
                        .description("API pour gérer les podcasts et les blogs"));
    }
}
