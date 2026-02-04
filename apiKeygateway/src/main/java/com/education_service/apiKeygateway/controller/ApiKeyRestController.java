package com.education_service.apiKeygateway.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.education_service.apiKeygateway.config.HeaderExtract;
import com.education_service.apiKeygateway.config.JwtUtils;
import com.education_service.apiKeygateway.dto.RefreshTokenRequest;
import com.education_service.apiKeygateway.dto.RequestTokenDto;
import com.education_service.apiKeygateway.enums.Status;
import com.education_service.apiKeygateway.models.Apikey;
import com.education_service.apiKeygateway.models.RequestToken;
import com.education_service.apiKeygateway.models.TokenResponse;
import com.education_service.apiKeygateway.service.ApiKeygatewayService;
import com.education_service.apiKeygateway.service.PermissionService;
import com.education_service.apiKeygateway.service.RequestTokenService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/education-service/apikeygateway")
@RequiredArgsConstructor
@Slf4j
public class ApiKeyRestController {

    private final RequestTokenService requestTokenService;

    private final ApiKeygatewayService apiKeyGatewayService;

    private final PermissionService permissionService;

    private final HeaderExtract headerExtract;

    private final JwtUtils jwtUtils;

    @GetMapping("/request/token/{status}")
    public Flux<RequestToken> adminPage(@PathVariable("status") String status) {
        return requestTokenService.findByStatus(status);
    }

    @GetMapping("/request/token")
    public Flux<RequestToken> getAllRequestToken(){
        return requestTokenService.findAllRequestToken();
    }

    @GetMapping
    public Flux<Apikey> getAllApiKey(){
        return apiKeyGatewayService.findAllApiKey();
    }
    

    @GetMapping("/request/token/submitted")
    public Flux<RequestToken> adminPage() {
        return requestTokenService.findAll();
    }

    @PatchMapping("/request/token/change/status/{id}/{status}")
    public Mono<Boolean> updateRequestStatus(@PathVariable("id") UUID id, @PathVariable("status") String status) {
        return requestTokenService.updateRequestStatus(id, status)
                .doOnSuccess(ok -> System.out.println("✅ UPDATE confirmé en base pour l'id " + id))
                .doOnError(err -> System.err.println("❌ Échec UPDATE : " + err.getMessage()));
    }

     @PatchMapping("/request/token/validate/{id}")
     @Operation(summary = "Valider une requete de cle API")
      public Mono<Boolean> validateRequestToken(@PathVariable("id") UUID id) {
        return requestTokenService.updateRequestStatusValidate(id, Status.VALIDATE)
                .doOnSuccess(ok -> System.out.println("✅ UPDATE confirmé en base pour l'id " + id))
                .doOnError(err -> System.err.println("❌ Échec UPDATE : " + err.getMessage()));
    }

    @PatchMapping("/request/token/reject/{id}")
     @Operation(summary = "Rejeter une requete de cle API")
      public Mono<Boolean> rejectRequestToken(@PathVariable("id") UUID id) {
        return requestTokenService.updateRequestStatusReject(id, Status.REJECT)
                .doOnSuccess(ok -> System.out.println("✅ UPDATE confirmé en base pour l'id " + id))
                .doOnError(err -> System.err.println("❌ Échec UPDATE : " + err.getMessage()));
    }


    @Schema(description = "Requete pour obtenir une apiKey")
    @Operation(summary = "Faire une requete de cle API")
    @PostMapping("/request/token")
    public Mono<Boolean> requestApiKey(@RequestBody RequestTokenDto requestToken) {

        return requestTokenService.saveRequestToken(requestToken)

                .doOnSuccess(savedRequestToken -> {
                    System.out.println(
                            "✅ Requête enregistrée avec succès ! clientName: " + savedRequestToken.getClientName());
                })
                .doOnError(error -> {
                    System.out.println("❌ Erreur lors de l'enregistrement de la requête : " + error.getMessage());
                })
                .thenReturn(true)
                .onErrorReturn(false);
    }

    

    @PostMapping("/generateFirstConnection/token")
    public Mono<ResponseEntity<TokenResponse>> generateAccessTokenFirstConnectionEndpoint(ServerHttpRequest request) {
        Mono<String> apiKeyMono =
            headerExtract.extractHeader(request, "X-Api-Key-Gateway", String.class);
        Mono<UUID> clientIdMono =
            headerExtract.extractHeader(request, "X-Api-Key-Gateway-Client", UUID.class);
        
        return apiKeyMono
            .zipWith(clientIdMono)
            .flatMap(tuple ->
                jwtUtils.generateTokensFirstConnection(
                    tuple.getT1(), // apiKey
                    tuple.getT2()  // clientId
                )
            )
            .map(tokenResponse -> ResponseEntity.ok(tokenResponse))
            .onErrorResume(e -> {
                log.error("❌ Erreur génération tokens: {}", e.getMessage());
                return Mono.just(ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(null)); // ou créer un TokenResponse vide
            });
    }

    @PostMapping("/refresh")
    public Mono<ResponseEntity<Object>> refreshToken(@RequestBody RefreshTokenRequest request) {
        log.info("🔄 Réception requête de renouvellement de token");
        
        if (request.getRefreshToken() == null || request.getRefreshToken().isEmpty()) {
            return Mono.just(ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body((Object) Map.of(
                    "status", 400,
                    "error", "BAD_REQUEST",
                    "message", "Refresh token manquant"
                )));
        }
        
        return jwtUtils.renewTokens(request.getRefreshToken())
            .map(tokenResponse -> ResponseEntity.ok((Object) tokenResponse))
            .onErrorResume(e -> {
                log.error("❌ Erreur renouvellement token: {}", e.getMessage());
                return Mono.just(ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body((Object) Map.of(
                        "status", 401,
                        "error", "UNAUTHORIZED",
                        "message", e.getMessage()
                    )));
            });
    }

    @DeleteMapping("/request/apikey")
    public Mono<Void> deleteApikey() {
        return apiKeyGatewayService.deleteApiKey()
                .doOnSuccess(ok -> System.out.println("DELETE confirmé en base"))
                .doOnError(err -> System.err.println(" Échec DELETE : " + err.getMessage()));
    }

    @DeleteMapping("/request/token")
    public Mono<Void> deleteRequestToken() {
        return requestTokenService.deleteRequestToken()
                .doOnSuccess(ok -> System.out.println("DELETE confirmé en base"))
                .doOnError(err -> System.err.println(" Échec DELETE : " + err.getMessage()));
    }
    


    @PostMapping("/authenticate/token")
        public Mono<?> authorizeAccessToken(@RequestBody RequestTokenDto requestToken) {
            return Mono.just(new String());
        }
}
