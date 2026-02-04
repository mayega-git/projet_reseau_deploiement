package com.forum.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
//@RequiredArgsConstructor
public class ApiKeyFilter implements WebFilter {

    @Value("${spring.forum.validation.url}") // Charge l'URL du service de validation
    private String validationURL;

    @Value("${spring.forum.security.apikey.enabled:true}") // Permet de désactiver facilement le filtre
    private boolean apiKeyEnabled;

    private static final String API_KEY_HEADER = "X-API-KEY"; // Nom de l'entête HTTP
    private final WebClient.Builder webClientBuilder;

    public ApiKeyFilter(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        if (!apiKeyEnabled) {
            return chain.filter(exchange);
        }

        String path = exchange.getRequest().getPath().value();
        if (!path.startsWith("/api/public/operation/")) {
            return chain.filter(exchange);
        }

        String apiKey = exchange.getRequest().getHeaders().getFirst(API_KEY_HEADER);
        if (apiKey == null) {
            return writeError(exchange.getResponse(), HttpStatus.UNAUTHORIZED, "Invalid or missing API Key");
        }

        String userId = exchange.getRequest().getQueryParams().getFirst("userid");
        if (userId == null || userId.isBlank()) {
            return writeError(exchange.getResponse(), HttpStatus.BAD_REQUEST, "Missing or empty id parameter");
        }

        return webClientBuilder.build().get()
                .uri(validationURL + "/" + userId + "?apiKey=" + apiKey)
                .retrieve()
                .bodyToMono(Boolean.class)
                .flatMap(isValid -> {
                    if (Boolean.FALSE.equals(isValid)) {
                        return writeError(exchange.getResponse(), HttpStatus.UNAUTHORIZED, "Invalid API Key");
                    }
                    return chain.filter(exchange);
                })
                .onErrorResume(e -> writeError(exchange.getResponse(), HttpStatus.INTERNAL_SERVER_ERROR, "Error validating API Key"));
    }

    private Mono<Void> writeError(ServerHttpResponse response, HttpStatus status, String message) {
        response.setStatusCode(status);
        byte[] bytes = message.getBytes(StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }
}
