package com.forum.service;

import com.forum.model.Categorie;
import com.forum.repository.ForumCategorieRepository;
import com.forum.repository.DiscussionGroupRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class ForumCategorieService {
    
    private final ForumCategorieRepository categorieRepository;
    private final DiscussionGroupRepository discussionGroupRepository;

    public ForumCategorieService(ForumCategorieRepository categorieRepository, DiscussionGroupRepository discussionGroupRepository) {
        this.categorieRepository = categorieRepository;
        this.discussionGroupRepository = discussionGroupRepository;
    }

    // 🔹 Ajouter une catégorie
    public Mono<Categorie> createCategorie(UUID groupeId, Categorie categorie) {
        if (categorie.getCategorieName() == null) {
            return Mono.error(new IllegalArgumentException("Le nom de la catégorie ne peut pas être nul"));
        }
        categorie.setCategorieId(UUID.randomUUID());
        categorie.setGroupeId(groupeId);
        categorie.markNew();
        return categorieRepository.findByCategorieName(categorie.getCategorieName())
                .flatMap(existing -> Mono.<Categorie>error(new IllegalStateException("Cette catégorie existe déjà")))
                .switchIfEmpty(
                        discussionGroupRepository.findByGroupId(groupeId)
                                .switchIfEmpty(Mono.error(new IllegalCallerException("Le groupe n'existe pas")))
                                .then(categorieRepository.save(categorie))
                );
    }

    // 🔹 Récupérer toutes les catégories
    public Flux<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    // 🔹 Récupérer une catégorie par son ID
    public Mono<Categorie> getCategorieById(UUID categorieId) {
        return categorieRepository.findById(categorieId);
    }

    // 🔹 Récupérer les catégories d'un groupe
    public Flux<Categorie> getCategoriesByGroupeId(UUID groupeId) {
        return categorieRepository.findByGroupeId(groupeId);
    }

    // 🔹 Mettre à jour une catégorie
    public Mono<Categorie> updateCategorie(UUID categorieId, Categorie newCategorie) {
        return categorieRepository.findById(categorieId)
                .flatMap(existingCategorie -> {
                    existingCategorie.setCategorieName(newCategorie.getCategorieName());
                    existingCategorie.setPostsIds(newCategorie.getPostsIds());
                    return categorieRepository.save(existingCategorie);
                });
    }

    // Ajouter un post à une catégorie
    public Mono<Categorie> addPostToCategorie(UUID categorieId, UUID postId) {
        return categorieRepository.findById(categorieId)
                .flatMap(categorie -> {
                    if (categorie.getPostsIds() == null) {
                        categorie.setPostsIds(new ArrayList<>());
                    }
                    categorie.getPostsIds().add(postId);
                    return categorieRepository.save(categorie);
                });
    }

    // 🔹 Supprimer une catégorie
    public Mono<Boolean> deleteCategorie(UUID categorieId) {
        return categorieRepository.findById(categorieId)
                .flatMap(categorie -> {
                    categorie.setDateSuppression(Instant.now());
                    return categorieRepository.save(categorie).thenReturn(true);
                })
                .defaultIfEmpty(false);
    }
}
