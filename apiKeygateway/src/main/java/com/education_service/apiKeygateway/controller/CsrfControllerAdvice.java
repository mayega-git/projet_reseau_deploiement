package com.education_service.apiKeygateway.controller;

import org.springframework.security.web.server.csrf.CsrfToken;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@ControllerAdvice
public class CsrfControllerAdvice {
    
    @ModelAttribute("_csrf")
    public Mono<CsrfToken> csrfToken(ServerWebExchange exchange) {
        // ✅ Retourner le Mono directement
        Mono<CsrfToken> csrfToken = exchange.getAttribute(CsrfToken.class.getName());
        
        if (csrfToken != null) {
            return csrfToken.doOnNext(token -> 
                System.out.println("✅ CSRF exposé au modèle: " + token.getToken())
            );
        }
        
        System.out.println("⚠️ Pas de CSRF token dans ControllerAdvice");
        return Mono.empty();
    }
} 