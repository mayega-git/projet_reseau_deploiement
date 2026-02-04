package com.letsgo.education_service.service.plateforme;

import org.springframework.stereotype.Service;

import com.letsgo.education_service.dto.plateformeDto.PlateformeDto;
import com.letsgo.education_service.models.Plateforme_entity;
import com.letsgo.education_service.repository.PlateformeRepository;

import reactor.core.publisher.Mono;

@Service
public class PlateformeService {

    private final PlateformeRepository plateformeRepository;

    public PlateformeService(PlateformeRepository plateformeRepository) {
        this.plateformeRepository = plateformeRepository;
    }

    public Mono<Plateforme_entity> registerPlateforme(PlateformeDto plateformeDto) {
        Plateforme_entity plateforme_entity = new Plateforme_entity();
        plateforme_entity.setName(plateformeDto.name());
        plateforme_entity.setDescription(plateformeDto.description());
        plateforme_entity.setClientId(plateformeDto.clientId());
        return  plateformeRepository.save(plateforme_entity);
    }


    
}
