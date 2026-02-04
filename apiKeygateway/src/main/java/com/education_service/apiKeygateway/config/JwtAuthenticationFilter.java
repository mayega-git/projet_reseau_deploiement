package com.education_service.apiKeygateway.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements WebFilter{

    private static final List<String> SWAGGER_WHITELIST = List.of(
    "/swagger-ui",
    "/swagger-ui/",
    "/swagger-ui.html",
    "/v3/api-docs",
    "/v3/api-docs/",
    "/webjars"
    );


    private  final FilterHelper filterHelper;
    
    @Value("${spring.app.authorized-services}")
    private String authorizedServicesConfig;

    @Value("${spring.app.header-api-key}")
    private  String  hearderApiKey ;

    @Value("${spring.app.header-api-key-client}")
    private  String  hearderApiKeyClient ;

    @Value("#{'${spring.app.public-paths}'.split(',')}")
    private List<String> publicPaths;

    //a remplacer 
    //public final HeaderExtract headerExtract;

    private List<String> authorizedServices;
    
    @PostConstruct
    public void init() {
        this.authorizedServices = Arrays.asList(authorizedServicesConfig.split(","));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {


       
        
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();

            System.out.println("========== REQUEST INFO ==========");
        System.out.println("Method: " + request.getMethod());
        System.out.println("Path: " + request.getPath());
        System.out.println("Headers:");
        request.getHeaders().forEach((key, values) -> {
            System.out.println("  " + key + ": " + values);
        });
        System.out.println("=================================");

        
        
        
        //Extraction information de la requete 
        String path = request.getPath().value();

         if (isSwaggerRequest(path)) {
            return chain.filter(exchange);
        }

            // Exclure les ressources statiques
        if (path.startsWith("/css/") || path.startsWith("/js/") || path.startsWith("/images/")) {
            return chain.filter(exchange);
        }

        if (isPublicPath(path)) {
        return chain.filter(exchange); // Bypass du filtre
        }

        String method = request.getMethod().name();
        
        // Extraction du header Authorization
        String authHeader = request.getHeaders().getFirst("Authorization");
        
        // Extraction des headers pour première connexion
        String apiKey = request.getHeaders().getFirst(hearderApiKey);
        String clientIdHeader = request.getHeaders().getFirst(hearderApiKeyClient);
        
        
        // ====================================================================
        // ÉTAPE 2 : EXTRACTION DU NOM DU SERVICE DEPUIS LE PATH
        // ====================================================================
        
        String serviceName = filterHelper.extractServiceNameFromPath(path);
        
        if (serviceName == null) {
            return filterHelper.sendErrorResponse(response, 400, "BAD_REQUEST", "Invalid path format");
        }

        System.out.println("Service name: " + serviceName);
        
        // Vérification que le service est autorisé
        if (!authorizedServices.contains(serviceName)) {
            return filterHelper.sendErrorResponse(response, 404, "RESOURCE_NOT_FOUND", 
                "Service '" + serviceName + "' not found");
        }
        
        
        // ====================================================================
        // ÉTAPE 3 : TRADUCTION MÉTHODE HTTP → SCOPE
        // ====================================================================
        System.out.println("Method: " + method);
        String requiredScope = filterHelper.mapMethodToScope(method);
        
        if (requiredScope == null) {
            return filterHelper.sendErrorResponse(response, 405, "METHOD_NOT_ALLOWED", 
                "HTTP method not supported");
        }
        
        
        // ====================================================================
        // ÉTAPE 4 : DISTINCTION PREMIÈRE CONNEXION VS REQUÊTES SUIVANTES
        // ====================================================================
        
        // CAS 1 : PREMIÈRE CONNEXION (pas de token, mais API Key présente)
        System.out.println("AUTHEADER "+authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            
            if (apiKey == null || clientIdHeader == null) {
                return filterHelper.sendErrorResponse(response, 401, "UNAUTHORIZED", 
                    "Missing "+hearderApiKey+"or " + hearderApiKeyClient);
            }
            
            return filterHelper.handleFirstConnection(apiKey, clientIdHeader, response);
        }
        
        
        // CAS 2 : REQUÊTES SUIVANTES (token présent)
        String token = authHeader.substring(7); // Retirer "Bearer "
        
        return filterHelper.handleAuthenticatedRequest(token, serviceName, requiredScope, exchange, chain);
    }

    private boolean isPublicPath(String path) {
        return publicPaths.stream()
            .anyMatch(pattern -> new AntPathMatcher().match(pattern, path));
    }

    private boolean isSwaggerRequest(String path) {
            return SWAGGER_WHITELIST.stream().anyMatch(path::startsWith);
    }


    

    
}
