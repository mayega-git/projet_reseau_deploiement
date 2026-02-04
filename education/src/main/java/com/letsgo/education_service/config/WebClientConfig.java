package com.letsgo.education_service.config;

import org.springframework.http.HttpHeaders;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.channel.ChannelOption;
import io.netty.handler.logging.LogLevel;
import io.netty.resolver.DefaultAddressResolverGroup;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.logging.AdvancedByteBufFormat;



@Configuration
public class WebClientConfig {

    private static final Duration TIME_OUT = Duration.ofSeconds(10);

    @Value("${spring.media.api.url}")
    private String mediaApi;


    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(mediaApi) // URL du service de stockage de fichiers
                .clientConnector(new ReactorClientHttpConnector(
                        HttpClient.create().
                        wiretap("reactor.netty.http.client.HttpClient", LogLevel.DEBUG, AdvancedByteBufFormat.TEXTUAL)
                        //.resolver(DefaultAddressResolverGroup.INSTANCE)

                        .responseTimeout(TIME_OUT)
                        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 15000)
                ))
                .codecs(codecConfigurer -> {
                    codecConfigurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024);
                })
        
                .build();
    }
    
}
