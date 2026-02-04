package com.education_service.apiKeygateway.service;

import com.letsgo.education_service.dto.plateformeDto.PlateformeDto;
import com.letsgo.education_service.models.Plateforme_entity;
import com.letsgo.education_service.repository.PlateformeRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Data
@RequiredArgsConstructor
public class RegisterPlateformeService {

    private final PlateformeRepository plateformeRepository;

    public Mono<Plateforme_entity> registerPlateformeEntity(Plateforme_entity plt){

        return  plateformeRepository.save(plt);
    }

    
}
