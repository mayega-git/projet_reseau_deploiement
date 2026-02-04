package com.example.user_interactive_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration // Indique à Spring que c'est une classe de configuration
@EnableWebFlux // Active la configuration Spring WebFlux
public class WebFluxConfig implements WebFluxConfigurer {

    /**
     * Configure les règles CORS pour toute l'application.
     * @param registry Le registre pour configurer les règles CORS.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        
        // Applique les règles CORS à tous les chemins ("/**")
        registry.addMapping("/**") 
                
                // Autorise toutes les origines (À adapter en production !)
                .allowedOrigins("http://localhost:3000") 
                // production, remplacez "*" par :
                // .allowedOrigins("http://localhost:3000", "https://votre-domaine.com")
                
                // autoriser les méthodes HTTP courantes
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                
                // autoriser toutes les en-têtes
                .allowedHeaders("*") 
                
                // Autorise l'envoi de cookies et d'informations d'authentification (credentials)
                // Note:  allowedOrigins("*"), ne pas utiliser allowCredentials(true).
                // Si vous voulez autoriser les credentials(cookies,jetons ...), vous devez spécifier les domaines exacts.
                .allowCredentials(true) // Mettre à true si allowedOrigins n'est pas "*"
                
                // durée de validité du pré-vol (pre-flight request)
                .maxAge(3600); // 1 heure
    }
}