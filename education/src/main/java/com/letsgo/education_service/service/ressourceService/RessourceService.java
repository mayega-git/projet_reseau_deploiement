package com.letsgo.education_service.service.ressourceService;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.letsgo.education_service.dto.apiDto.MediaUploadResponse;
import com.letsgo.education_service.models.Ressource_entity;
import com.letsgo.education_service.repository.RessourceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class RessourceService {

    private final RessourceRepository ressourceRepository;

    public Mono<UUID> saveRessource(MediaUploadResponse cover, MediaUploadResponse audio) {
        log.info(" saveBlogRessource - Cover: {}, Audio: {}", 
            cover.getId(), audio.getId());
        
        Ressource_entity ressource = new Ressource_entity();
        boolean hasMedia = false;
        
        if (cover != null && cover.getId() != null) {
            ressource.setCoverId(UUID.fromString(cover.getId()));
            ressource.setCoverUri(cover.getUri());
            ressource.setMimeType(cover.getMime());
            ressource.setExtensionFile(cover.getExtension());
            ressource.setRealName(cover.getRealName());
            hasMedia = true;
            log.info(" Cover attaché à la ressource: {}", cover.getId());
        }
        
        if (audio != null && audio.getId() != null) {
            ressource.setAudioId(UUID.fromString(audio.getId()));
            ressource.setAudioUri(audio.getUri());
            ressource.setMimeType(audio.getMime());
            ressource.setExtensionFile(audio.getExtension());
            ressource.setRealName(audio.getRealName());
            hasMedia = true;
            log.info("Audio attaché à la ressource: {}", audio.getId());
        }
        
        if (!hasMedia) {
            log.warn(" Aucun média à sauvegarder dans la ressource");
            return Mono.empty();
        }
    
    
        return ressourceRepository.save(ressource)
            .doOnSuccess(saved -> log.info(" Ressource sauvegardée avec ID: {}", saved.getId()))
            .doOnError(e -> log.error(" Erreur sauvegarde ressource: {}", e.getMessage()))
            .map(Ressource_entity::getId);

    }


    public Mono<Ressource_entity> getRessourceById(UUID id) {
        return ressourceRepository.findById(id);
                
    }
}
