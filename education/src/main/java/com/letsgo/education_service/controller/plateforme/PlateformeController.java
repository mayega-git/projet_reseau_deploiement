package com.letsgo.education_service.controller.plateforme;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.letsgo.education_service.dto.plateformeDto.PlateformeDto;
import com.letsgo.education_service.models.Plateforme_entity;
import com.letsgo.education_service.service.plateforme.PlateformeService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/education-service/education/plateforme")
@RequiredArgsConstructor
public class PlateformeController {

    private final PlateformeService plateformeService;



    @PostMapping
    public Mono<Plateforme_entity> registerPlateforme(@RequestBody PlateformeDto plateformeDto) {

        return plateformeService.registerPlateforme(plateformeDto);

    }
        
    
}
