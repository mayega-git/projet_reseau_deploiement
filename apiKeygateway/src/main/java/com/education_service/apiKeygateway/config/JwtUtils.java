package com.education_service.apiKeygateway.config;

import org.springframework.stereotype.Component;

import com.education_service.apiKeygateway.enums.Status;
import com.education_service.apiKeygateway.models.TokenResponse;
import com.education_service.apiKeygateway.repository.ApikeyRepository;
import com.education_service.apiKeygateway.repository.PermissionRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.crypto.spec.SecretKeySpec;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtUtils {

    @Value("${spring.app.secret-key-jwt}")
    private String jwtSecret;

    @Value("${spring.app.expiration-time}")
    private int jwtExpirationMs = 900000;

    private Key key;

    private final ApikeyRepository apikeyRepository;

    private final PermissionRepository permissionRepository;

    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        this.key = new SecretKeySpec(jwtSecret.getBytes(), "HmacSHA256");
    }

    private String extractClientId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    

    public String extractClientIdFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // extraire les permissions du token
    public Map<String, String> extractPermissionsFromToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            
            @SuppressWarnings("unchecked")
            List<Map<String, String>> permissions = 
                (List<Map<String, String>>) claims.get("permissions");
            
            if (permissions == null) {
                return new HashMap<>();
            }
            
            return permissions.stream()
                .collect(Collectors.toMap(
                    p -> p.get("service"),
                    p -> p.get("scope"),
                    (existing, replacement) -> existing
                ));
                
        } catch (Exception e) {
            log.error("❌ Erreur extraction permissions du token: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    // générer un access token
    public String generateAccessToken(UUID clientId, Map<String, String> permissions) {

        Map<String, Object> claims = new HashMap<>();

        // identité technique
        claims.put("client_id", clientId.toString());

        // permissions normalisées
        claims.put(
                "permissions",
                permissions.entrySet().stream()
                        .map(entry -> Map.of(
                                "service", entry.getKey(),
                                "scope", entry.getValue()))
                        .toList());

        return createToken(claims, clientId.toString());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // sujet = client
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60) // 1h
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String subject) {
        

        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 5) // 5h
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

 
    //renouvellement des tokens
    public Mono<TokenResponse> renewTokens(String rawRefreshToken) {

        log.info("🔄 Tentative de renouvellement des tokens");

        try {
            // Vérifier l'expiration du refresh token
            if (isTokenExpired(rawRefreshToken)) {
                log.error("❌ Refresh token expiré");
                return Mono.error(new RuntimeException("Refresh token expiré"));
            }

            //  Extraire le clientId depuis le refresh token
            String clientIdStr = extractClientIdFromToken(rawRefreshToken);
            UUID clientId = UUID.fromString(clientIdStr);

            //  Récupérer l'API key depuis la BDD
            return apikeyRepository.findByClientId(clientId)
                .switchIfEmpty(Mono.error(new RuntimeException("Client ID introuvable")))
                .flatMap(apikey -> {

                    //  Vérifier que le refresh token correspond à celui stocké
                    if (!passwordEncoder.matches(rawRefreshToken, apikey.getRefreshToken())) {
                        log.error("❌ Refresh token invalide pour clientId: {}", clientId);
                        return Mono.error(new RuntimeException("Refresh token invalide"));
                    }

                  

                    //  Charger les permissions
                    return permissionRepository
                        .findAllByRequestTokenId(apikey.getRequestTokenId())
                        .collectList()
                        .flatMap(permissions -> {

                            if (permissions.isEmpty()) {
                                return Mono.error(
                                    new RuntimeException("Aucune permission associée"));
                            }

                            //  Construire les scopes
                            Map<String, String> scopesMap = permissions.stream()
                                .collect(Collectors.toMap(
                                    p -> p.getServiceName().name(),
                                    p -> p.getScope().name(),
                                    (existing, replacement) -> existing));

                            // Générer NOUVEAUX tokens
                            String newAccessToken = generateAccessToken(clientId, scopesMap);
                            String newRefreshToken = generateRefreshToken(clientId.toString());

                            // Sauvegarder le nouveau refresh token en BDD
                            apikey.setRefreshToken(passwordEncoder.encode(newRefreshToken));
                            
                            log.info("✅ Tokens renouvelés avec succès pour clientId: {}", clientId);

                            return apikeyRepository.save(apikey)
                                .thenReturn(TokenResponse.builder()
                                    .accessToken(newAccessToken)
                                    .refreshToken(newRefreshToken)
                                    .build());
                        });
                })
                .doOnError(e -> log.error("Erreur renouvellement tokens: {}", e.getMessage()));

        } catch (Exception e) {
            log.error(" Erreur validation refresh token: {}", e.getMessage());
            return Mono.error(new RuntimeException("Refresh token invalide"));
        }
    }


    public Boolean validateToken(String token, String clientId, String method) {
        final String extractedClientId = extractClientId(token);
        return (extractedClientId.equals(clientId) && !isTokenExpired(token));
    }

  

    public Mono<TokenResponse> generateTokensFirstConnection(String rawApiKey, UUID clientId) {

        log.info(" Génération des tokens pour première connexion - clientId: {}", clientId);

        return apikeyRepository.findByClientId(clientId)
            .switchIfEmpty(Mono.error(new RuntimeException("Client ID introuvable")))
            .flatMap(apikey -> {

                // 1 Vérification API key
                if (!passwordEncoder.matches(rawApiKey, apikey.getApiKey())) {
                    log.error(" API Key invalide pour clientId: {}", clientId);
                    return Mono.error(new RuntimeException("API Key invalide"));
                }

                // 2️Vérification statut
                if (!Status.valueOf("ACTIVE").equals(apikey.getStatus())) {
                    log.error(" API Key inactive pour clientId: {}", clientId);
                    return Mono.error(new RuntimeException("API Key inactive"));
                }

                // Charger les permissions
                return permissionRepository
                    .findAllByRequestTokenId(apikey.getRequestTokenId())
                    .collectList()
                    .flatMap(permissions -> {

                        if (permissions.isEmpty()) {
                            return Mono.error(
                                new RuntimeException("Aucune permission associée à cette API key"));
                        }

                        // 4️Construire les scopes JWT
                        Map<String, String> scopesMap = permissions.stream()
                            .collect(Collectors.toMap(
                                p -> p.getServiceName().name(),
                                p -> p.getScope().name(),
                                (existing, replacement) -> existing));

                        // 5️Génération access token avec scopes
                        String accessToken = generateAccessToken(clientId, scopesMap);

                        // 6️Génération refresh token JWT (avec clientId dans subject)
                        String refreshTokenJwt = generateRefreshToken(clientId.toString());

                        // 7️Sauvegarde du refresh token hashé en BDD
                        apikey.setRefreshToken(DigestUtils.sha256Hex(refreshTokenJwt));
                        
                        
                        log.info(" Tokens générés avec succès pour clientId: {}", clientId);

                        return apikeyRepository.save(apikey)
                            .thenReturn(TokenResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshTokenJwt)
                                .build());
                    });
            })
            .doOnError(e -> log.error(" Erreur génération tokens: {}", e.getMessage()));
    }

    

}