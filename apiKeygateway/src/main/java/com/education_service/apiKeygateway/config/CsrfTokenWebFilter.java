package com.education_service.apiKeygateway.config;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.csrf.CsrfToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class CsrfTokenWebFilter implements WebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // ✅ Le token CSRF est un Mono, pas une valeur directe
        Mono<CsrfToken> csrfTokenMono = exchange.getAttribute(CsrfToken.class.getName());
        
        if (csrfTokenMono == null) {
            System.out.println("⚠️ Pas de CSRF token dans les attributs");
            return chain.filter(exchange);
        }
        
        // ✅ IMPORTANT : Souscrire au Mono pour charger le token
        return csrfTokenMono
            .doOnSuccess(token -> {
                if (token != null) {
                    System.out.println("✅ CSRF Token chargé: " + token.getToken());
                    // Exposer le token résolu (pas le Mono) à Thymeleaf
                    exchange.getAttributes().put("_csrf", token);
                } else {
                    System.out.println("❌ CSRF Token est NULL");
                }
            })
            .then(chain.filter(exchange));
    }

    

}