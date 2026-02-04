package com.education_service.apiKeygateway.config;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class FilterHelper {

    private final JwtUtils jwtUtils;

    public FilterHelper(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    // gestion de la premiere connexion

    public Mono<Void> handleFirstConnection(String apiKey, String clientIdHeader,
            ServerHttpResponse response) {

        UUID clientId;
        try {
            clientId = UUID.fromString(clientIdHeader);
        } catch (IllegalArgumentException e) {
            return sendErrorResponse(response, 400, "BAD_REQUEST", "Invalid client ID format");
        }

        return jwtUtils.generateTokensFirstConnection(apiKey, clientId)
                .flatMap(tokenResponse -> {

                    // Construction de la réponse JSON
                    String jsonResponse = String.format(
                            "{\"access_token\":\"%s\",\"refresh_token\":\"%s\"}",
                            tokenResponse.getAccessToken(),
                            tokenResponse.getRefreshToken());

                    // Configuration de la réponse
                    response.setStatusCode(HttpStatus.OK);
                    response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

                    DataBuffer buffer = response.bufferFactory()
                            .wrap(jsonResponse.getBytes(StandardCharsets.UTF_8));

                    return response.writeWith(Mono.just(buffer));
                })
                .onErrorResume(e -> {
                    return sendErrorResponse(response, 401, "UNAUTHORIZED", e.getMessage());
                });
    }

    // gestion des erreurs
    public Mono<Void> sendErrorResponse(ServerHttpResponse response, int statusCode,
            String error, String message) {

        response.setStatusCode(HttpStatus.valueOf(statusCode));
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String jsonError = String.format(
                "{\"status\":%d,\"error\":\"%s\",\"message\":\"%s\"}",
                statusCode, error, message);

        DataBuffer buffer = response.bufferFactory()
                .wrap(jsonError.getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }

    // transformer la methode en scope

    public String mapMethodToScope(String method) {

        switch (method) {
            case "GET":
                return "READ";
            case "POST":
            case "PUT":
            case "OPTIONS":
            case "PATCH":
            case "DELETE":
                return "WRITE";
            default:
                return null;
        }
    }

    // extraction du nom du service depuis le path
    public String extractServiceNameFromPath(String path) {

        if (path == null || path.isBlank()) {
            return null;
        }

        String[] segments = path.split("/");

        // Ex: /api/gateway/SERVICE/endpoint
        // segments = ["", "api", "gateway", "SERVICE", "endpoint"]

        if (segments.length < 4) {
            return null;
        }

        return segments[2].toUpperCase();
    }


    //gestion des requetes avec token

    public Mono<Void> handleAuthenticatedRequest(String token, String serviceName, 
                                                   String requiredScope,
                                                   ServerWebExchange exchange, 
                                                   WebFilterChain chain) {
        
        ServerHttpResponse response = exchange.getResponse();
        
        try {
            
            //verification de l'expiration du token
            
            if (jwtUtils.isTokenExpired(token)) {
                log.error("TOKEN_EXPIRED");              
                 return sendErrorResponse(response, 401, "TOKEN_EXPIRED", 
                    "Access token has expired. Please refresh your token.");
            }
            
            
            //extraction des permissions depuis le token
            
            Map<String, String> permissions = jwtUtils.extractPermissionsFromToken(token);
            
            if (permissions == null || permissions.isEmpty()) {
                return sendErrorResponse(response, 403, "FORBIDDEN", 
                    "No permissions found in token");
            }
            
            
            //verification que le service est dans les permissions
            
            if (!permissions.containsKey(serviceName)) {
                return sendErrorResponse(response, 403, "FORBIDDEN", 
                    "Access denied: service '" + serviceName + "' not in permissions");
            }
            
            
            //verification du scope
            
            String grantedScope = permissions.get(serviceName);
            
            // Si scope== "ALL", autoriser immédiatement
            if ("ALL".equals(grantedScope)) {
                return chain.filter(exchange);
            }
            
            // Sinon, vérifier la correspondance exacte
            if (!requiredScope.equals(grantedScope)) {
                return sendErrorResponse(response, 403, "FORBIDDEN", 
                    String.format("Insufficient permissions: required '%s', granted '%s'", 
                                  requiredScope, grantedScope));
            }
            
            
            //autorisation accordée fowarding
            
            return chain.filter(exchange);
            
        } catch (Exception e) {
            return sendErrorResponse(response, 401, "UNAUTHORIZED", 
                "Invalid token: " + e.getMessage());
        }
    }

}
