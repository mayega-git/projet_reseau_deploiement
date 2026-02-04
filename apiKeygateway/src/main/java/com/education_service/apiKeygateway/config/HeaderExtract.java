package com.education_service.apiKeygateway.config;

import org.springframework.core.convert.ConversionService;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class HeaderExtract {

    private final ConversionService conversionService;

    
   public <T> Mono<T> extractHeader(
        ServerHttpRequest request,
        String headerName,
        Class<T> targetType
        ) {
            return Mono.justOrEmpty(request.getHeaders().getFirst(headerName))
                    .filter(value -> conversionService.canConvert(String.class, targetType))
                    .map(value -> conversionService.convert(value, targetType));
        }

}

