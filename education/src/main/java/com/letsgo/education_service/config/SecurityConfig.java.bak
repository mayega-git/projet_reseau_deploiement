package com.letsgo.education_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Activer CORS
                .csrf(csrf -> csrf.disable()) // Désactiver CSRF
                .authorizeExchange(exchanges -> exchanges
                                .pathMatchers(
                                        "/**",
                                        "/static/**",
                                         "/webjars/**",
                                         "/test",
                                        "/v3/api-docs/**",
                                        "/swagger-ui/**",
                                        "/swagger-ui.html",
                                        "/api/blogs/**",
                                        "/api/podcast/**",
                                        "/api/categories/**",
                                        "/api/tags/**",
                                        "/api/favorites/**",
                                        "/api/**",
                                        "/monitoring/keyspace"
                                ).permitAll() // Autoriser ces endpoints sans authentification
                                .pathMatchers("/actuator/health").permitAll() 
                                .anyExchange().authenticated() // Autres requêtes nécessitent une authentification
                )
                ; 

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://your-frontend-domain.com")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS","HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true); // Autoriser les informations d'identification
        configuration.setMaxAge(3600L); // Cache la configuration CORS pendant 1 heure
        
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "Cache-Control"
        ));

         configuration.setExposedHeaders(Arrays.asList(
            "Content-Type",
            "Content-Disposition",
            "Content-Length",
            "Cache-Control"
        ));
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}