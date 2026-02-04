package com.education_service.apiKeygateway.config;
/* 
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.education_service.apiKeygateway.dto.EmailDto;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@Slf4j  // ← Ajoute ça
public class NewsLetterClient {
    private final WebClient webClient;
    
    public NewsLetterClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8083").build();
        log.info("🌐 NewsLetterClient initialisé avec baseUrl: http://localhost:8083");
    }
    
    public Mono<Void> sendEmail(EmailDto request) {
        log.info("Appel WebClient vers /api/emails/send");
        log.info(" Données email: {}", request);
        
        return webClient.post()
                .uri("/api/emails/send")
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("Erreur HTTP status: {}", response.statusCode());
                    return response.bodyToMono(String.class)
                        .flatMap(body -> {
                            log.error("Body: {}", body);
                            return Mono.error(new RuntimeException("Email API failed: " + body));
                        });
                })
                .bodyToMono(Void.class)
                .doOnSuccess(v -> log.info(" WebClient: Email envoyé avec succès"))
                .doOnError(e -> log.error(" WebClient error", e));
    }
}*/
