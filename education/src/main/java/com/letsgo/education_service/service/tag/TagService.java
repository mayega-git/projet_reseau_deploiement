package com.letsgo.education_service.service.tag;

import com.letsgo.education_service.dto.TagDTO.TagCreateDTO;
import com.letsgo.education_service.enums.Domain;
import com.letsgo.education_service.models.Tag_entity;
import com.letsgo.education_service.repository.TagRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public Mono<Tag_entity> createTag(TagCreateDTO tagCreateDTO) {
             
            
            try {
                Tag_entity tag = new Tag_entity();
                
                tag.setName(tagCreateDTO.getName());
                
                
                tag.setDescription(tagCreateDTO.getDescription());
                
                // Conversion du domain 
                Domain domainEnum = Domain.valueOf(tagCreateDTO.getDomain());
                tag.setDomain(domainEnum);
                
                System.out.println("Tag prêt à être sauvegardé: " + tag);
                
                return tagRepository.save(tag)
                    .doOnSuccess(savedTag -> System.out.println("Tag sauvegardé avec succès: " + savedTag))
                    .doOnError(error -> {
                        System.err.println("ERREUR lors de la sauvegarde:");
                        System.err.println("Type: " + error.getClass().getName());
                        System.err.println("Message: " + error.getMessage());
                        error.printStackTrace();
                    });
                    
            } catch (Exception e) {
                System.err.println("ERREUR lors de la création du tag (avant save):");
                System.err.println("Type: " + e.getClass().getName());
                System.err.println("Message: " + e.getMessage());
                e.printStackTrace();
                return Mono.error(e);
            }
    }

    public Mono<Tag_entity> getTagById(String tagId) {
        return tagRepository.findById(UUID.fromString(tagId));
    }

    public Mono<Tag_entity> updateTag(String tagId, TagCreateDTO tagCreateDTO) {
        return tagRepository.findById(UUID.fromString(tagId))
                .switchIfEmpty(Mono.error(new RuntimeException("Tag non trouvé")))
                .flatMap(tag -> {
                    tag.setName(tagCreateDTO.getName());
                    tag.setDescription(tagCreateDTO.getDescription());
                    return tagRepository.save(tag);
                });
    }

    public Mono<Void> deleteTag(String tagId) {
        UUID tagID  = UUID.fromString(tagId);
    return tagRepository.findById(tagID)
            .switchIfEmpty(Mono.error(new RuntimeException("Tag non trouvé")))
            .flatMap(tag -> tagRepository.deleteById(tagID));
    }

    public Flux<Tag_entity> getAllTags() {
        return tagRepository.findAll();
    }

    public Flux<UUID> getIdListTag(List<String> tags){
        return getAllTags()
            .filter(tag -> tags.contains(tag.getName()))
            .map(Tag_entity::getId);
    }


}
