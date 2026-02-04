package com.example.user_interactive_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class WebFluxCorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Autorise l'envoi de credentials (cookies, headers auth, etc.)
        config.addAllowedOriginPattern("*"); // Permet toutes les origines (ou remplace par "http://localhost:3000", etc.)
        config.addAllowedHeader("*"); // Autorise tous les headers
        config.addAllowedMethod("*"); // Autorise toutes les méthodes HTTP

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Applique la config à toutes les routes

        return new CorsWebFilter(source);
    }
}
