package com.education_service.apiKeygateway.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;
import org.apache.commons.codec.digest.DigestUtils;
import com.education_service.apiKeygateway.dto.EmailDto;
import com.education_service.apiKeygateway.enums.Status;
import com.education_service.apiKeygateway.models.Apikey;
import com.education_service.apiKeygateway.models.RequestToken;
import com.education_service.apiKeygateway.repository.ApikeyRepository;
import com.example.newsletter_service.emails.EmailService2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@Slf4j
@RequiredArgsConstructor
public class ApiKeygatewayService {

    private final ApikeyRepository apikeyRepository;

    private final PasswordEncoder passwordEncoder;


    private final EmailService2 emailService;

    Mono<Apikey> createApiKey(RequestToken requestToken) {

    //Evitez le cle > 72 bytes
    String rawApiKey = DigestUtils.sha256Hex(generateSecureKey());
    log.info(" createApiKey appelée pour {}", requestToken.getEmail());

    return Mono.fromCallable(() -> {
                log.info(" Construction Apikey");
                return buildApikey(requestToken, rawApiKey);
            })
            .doOnSubscribe(s -> log.info(" Subscription déclenchée"))
            .flatMap(apikeyRepository::save)
            .doOnNext(a -> log.info(" Apikey sauvegardée en base, apikey={}", a))
            .flatMap(savedApikey -> {
                log.info(" Envoi email vers {}", requestToken.getEmail());
                System.out.println("CLIENT ID :"+savedApikey.getClientId());
                return emailService
                        .envoyerEmail(
                                requestToken.getEmail(),
                                "API Key créée ! Bienvenu sur education service",
                                new String("Voici votre API Key  : " + rawApiKey + "\n" + "votre Client id est : " + savedApikey.getClientId().toString())
                        )
                        .doOnSubscribe(s -> log.info(" Appel HTTP email déclenché"))
                        .doOnSuccess(v -> log.info("Email envoyé avec succès"))
                        .doOnError(e -> log.error(" Erreur envoi email", e))
                        .thenReturn(savedApikey);
            })
            .doOnSuccess(a ->
                    log.info(" Pipeline terminé avec succès pour {}", requestToken.getClientName())
            )
            .doOnError(e ->
                    log.error(" Erreur globale createApiKey", e)
            );
}

    public String generateSecureKey() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] keyBytes = new byte[32]; // 256 bits
        secureRandom.nextBytes(keyBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(keyBytes);
    }

    public String hash(String rawKey) {
        return passwordEncoder.encode(rawKey);
    }

    private Apikey buildApikey(RequestToken requestToken, String rawApiKey) {
        String hashedApiKey = hash(rawApiKey);

        Apikey apikey = new Apikey();
        apikey.setApiKey(hashedApiKey);
        apikey.setStatus(Status.ACTIVE);
        apikey.setValidityPeriod(30);
        apikey.setRequestTokenId(requestToken.getId());
        apikey.setClientId(UUID.randomUUID());

        return apikey;
    }

    public Mono<Void> fowardToNewsLetterService() {
        return Mono.empty();
    }

    public Mono<Apikey> validateApiKey(String rawApiKey, UUID clientId) {
        return apikeyRepository.findByClientId(clientId)
                .filter(apiKey -> passwordEncoder.matches(rawApiKey, apiKey.getApiKey()))
                .switchIfEmpty(Mono.error(new IllegalArgumentException("API key invalide")));
    }

    public Flux<Apikey> findAllApiKey() {
        return apikeyRepository.findAll();
    }

    public Mono<Void> deleteApiKey() {
        return apikeyRepository.deleteAll()
                .doOnSuccess(ok -> System.out.println(" DELETE confirmé en base"))
                .doOnError(err -> System.err.println(" Échec DELETE : " + err.getMessage()));
    }

}
