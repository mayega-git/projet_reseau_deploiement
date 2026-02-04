package com.letsgo.education_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.oauth2.client.*;
import org.springframework.security.oauth2.client.registration.*;
import org.springframework.security.oauth2.client.web.DefaultReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.reactive.function.client.*;
import org.springframework.security.oauth2.client.web.server.*;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.web.reactive.function.client.WebClient;
//A comprendre
@Configuration
public class OAuth2ClientConfig {

   /* @Value("${media.storage.oauth2.client-id}")
    private String clientId;

    @Value("${media.storage.oauth2.client-secret}")
    private String clientSecret;

    @Value("${media.storage.oauth2.token-url}")
    private String tokenUri;

    @Value("${media.storage.oauth2.scope}")
    private String scope;

    
     //ClientRegistration personnalisé basé sur les propriétés YAML

    @Bean
    public ReactiveClientRegistrationRepository clientRegistrationRepository() {
        ClientRegistration registration = ClientRegistration.withRegistrationId("media-client")
            .tokenUri(tokenUri)
            .clientId(clientId)
            .clientSecret(clientSecret)
            .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
            .scope(scope.split(","))
            .build();
        return new InMemoryReactiveClientRegistrationRepository(registration);
    }

    
     //Service de gestion des tokens OAuth2
     
    @Bean
    public ReactiveOAuth2AuthorizedClientService authorizedClientService(
            ReactiveClientRegistrationRepository clientRegistrationRepository) {
        return new InMemoryReactiveOAuth2AuthorizedClientService(clientRegistrationRepository);
    }

    
     //Repository qui permet de retrouver l'utilisateur courant 
     
    @Bean
    public ServerOAuth2AuthorizedClientRepository authorizedClientRepository(
            ReactiveOAuth2AuthorizedClientService clientService) {
        return new AuthenticatedPrincipalServerOAuth2AuthorizedClientRepository(clientService);
    }

    
     // Manager réactif des clients OAuth2
    
    @Bean
    public ReactiveOAuth2AuthorizedClientManager authorizedClientManager(
            ReactiveClientRegistrationRepository clientRegistrationRepository,
            ServerOAuth2AuthorizedClientRepository authorizedClientRepository) {

        ReactiveOAuth2AuthorizedClientProvider provider =
                ReactiveOAuth2AuthorizedClientProviderBuilder.builder()
                        .clientCredentials()
                        .build();

        DefaultReactiveOAuth2AuthorizedClientManager manager =
                new DefaultReactiveOAuth2AuthorizedClientManager(
                        clientRegistrationRepository,
                        authorizedClientRepository);
        manager.setAuthorizedClientProvider(provider);

        return manager;
    }

    
    //WebClient avec authentification OAuth2 automatique
     
    @Bean
    public WebClient webClient(ReactiveOAuth2AuthorizedClientManager authorizedClientManager) {
        ServerOAuth2AuthorizedClientExchangeFilterFunction oauth2 =
                new ServerOAuth2AuthorizedClientExchangeFilterFunction(authorizedClientManager);
        oauth2.setDefaultClientRegistrationId("media-client");

        return WebClient.builder()
            .filter(oauth2)
            .filter((request, next) -> next.exchange(request)
                    .doOnNext(response -> {
                        if (!response.headers().contentType().toString().contains("application/json")) {
                            response.bodyToMono(String.class)
                                    .subscribe(body -> System.err.println("Unexpected response: " + body));
                        }
                    }))
            .build();
    }*/
}
