package com.education_service.apiKeygateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

                return http
                                .csrf(csrf -> csrf.disable())
                               
                                .authorizeExchange(exchanges -> exchanges

                                                .pathMatchers(
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/v3/api-docs/**",
                                                                "/webjars/**",
                                                                "/css/**", "/js/**", "/images/**",
                                                                "/**", "/admin/**",
                                                                "/apikeygateway/**")
                                                .permitAll()
                                                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .anyExchange().authenticated())

                                .build();
        }

}
