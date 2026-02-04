package com.example.user_interactive_service.service;

import com.example.user_interactive_service.enums.EntityType;
import com.example.user_interactive_service.models.EntityStats;
import com.example.user_interactive_service.models.Ratings;
import com.example.user_interactive_service.repository.EntityStatsRepository;
import com.example.user_interactive_service.repository.RatingRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;



import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class RatingService {

    private final EntityStatsRepository entityStatsRepository;
    private final RatingRepository ratingRepository;

    public RatingService(EntityStatsRepository entityStatsRepository, RatingRepository ratingRepository) {
        this.entityStatsRepository = entityStatsRepository;
        this.ratingRepository = ratingRepository;
    }

    //@AllowFiltering
    public Mono<Void> likeOrDislike(UUID userId, UUID entityId, EntityType entityType, boolean isLike) {
        
        return entityStatsRepository.findById(entityId)
            
            // Si findById vide,nouvel objet EntityStats.
            .switchIfEmpty(Mono.defer(() -> {
                // Mono.defer garantit que new EntityStats() n'a lieu que si findById echoue.
                EntityStats newStats = new EntityStats();
                newStats.setEntityId(entityId);
                newStats.setEntityType(entityType);
                newStats.markNew(); // flag for insert despite non-null id
                newStats.setTotalLikes(0);
                newStats.setTotalDislikes(0);
                // initialisation des listes pour éviter les NullPointerExceptions
                newStats.setLikedUsers(new ArrayList<>()); 
                newStats.setDislikedUsers(new ArrayList<>());
                return Mono.just(newStats); 
            }))
            
            // si findNyId non vide mise a jour de l'objet existant.
            // map() exécute la  mise à jour de manière synchrone sur l'objet stats parce manipuler
            //le Mono est complique.
            .map(stats -> {
                updateStatsLogic(stats, userId, isLike);
                return stats; 
            })
            
            // enregistrer l'objet .
            // flatMap() lance l'opération save() apres  mise à jour et attend son Mono<EntityStats>.
            .flatMap(entityStatsRepository::save)
            
            // transformer le Mono<EntityStats> résultant du save en Mono<Void> 
            // pour indiquer que l'opération est complète.
            .then(); 
    }
    
    /**
     * Logique synchrone de mise à jour des statistiques .
     */
    private void updateStatsLogic(EntityStats entityStats, UUID userId, boolean isLike) {
        
        // assurer que les collections sont initialisées, même si elles devraient l'être 
        // lors de l'initialisation ou du chargement depuis la BD.
        Set<UUID> likedUsers = entityStats.getLikedUsers() != null
                ? new HashSet<>(entityStats.getLikedUsers())
                : new HashSet<>();
        Set<UUID> dislikedUsers = entityStats.getDislikedUsers() != null
                ? new HashSet<>(entityStats.getDislikedUsers())
                : new HashSet<>();

        if (isLike) {
            if (likedUsers.contains(userId)) {
                // clic pour DÉ-LIKER
                likedUsers.remove(userId);
                entityStats.setTotalLikes(entityStats.getTotalLikes() - 1);
            } else {
                // clic pour LIKER
                likedUsers.add(userId);
                entityStats.setTotalLikes(entityStats.getTotalLikes() + 1);
                
                // Retirer le dislike s'il existe
                if (dislikedUsers.contains(userId)){ 
                    dislikedUsers.remove(userId);
                    entityStats.setTotalDislikes(entityStats.getTotalDislikes() - 1);
                }
            }
        } else { // isDislike
            if (dislikedUsers.contains(userId)) {
                // Clic pour DÉ-DISLIKER
                dislikedUsers.remove(userId);
                entityStats.setTotalDislikes(entityStats.getTotalDislikes() - 1);
            } else {
                // Clic pour DISLIKER
                dislikedUsers.add(userId);
                entityStats.setTotalDislikes(entityStats.getTotalDislikes() + 1);
                
                // Retirer le like s'il existe
                if (likedUsers.contains(userId)) {
                    likedUsers.remove(userId);
                    entityStats.setTotalLikes(entityStats.getTotalLikes() - 1);
                }
            }
        }
        entityStats.setLikedUsers(new ArrayList<>(likedUsers));
        entityStats.setDislikedUsers(new ArrayList<>(dislikedUsers));
        
        // Sécurité : Assurer que les totaux ne sont jamais négatifs (même si la logique empêche normalement cela)
        entityStats.setTotalLikes(Math.max(0, entityStats.getTotalLikes()));
        entityStats.setTotalDislikes(Math.max(0, entityStats.getTotalDislikes()));
    }


    
    public Mono<Integer> getTotalLikes(UUID entityId) {
         
            return    entityStatsRepository.findById(entityId)
                        .map(EntityStats::getTotalLikes)
                        .defaultIfEmpty(0);
        
    }
    public Mono<Integer> getTotalDislikes(UUID entityId) {
        
            
                return entityStatsRepository.findById(entityId)
                        .map(EntityStats::getTotalDislikes)
                        .defaultIfEmpty(0);
            
        
    }
    public Mono<Boolean> hasUserLiked(UUID userId, UUID entityId) {
        
            return  entityStatsRepository.findById(entityId)
                        .map(stats -> stats.getLikedUsers().contains(userId))
                        .defaultIfEmpty(false);
        
    }
    public Mono<Boolean> hasUserDisliked(UUID userId, UUID entityId) {
         
            return   entityStatsRepository.findById(entityId)
                        .map(stats -> stats.getDislikedUsers().contains(userId))
                        .defaultIfEmpty(false);
        
    }


    public Flux<Ratings> getAllRatings() {

        return ratingRepository.findAll();
    }


    public Mono<Void> rateApplication(UUID userId, UUID entityId, EntityType entityType, int score, String feedback) {
        return ratingRepository.findByUserId(userId)
                .switchIfEmpty(Mono.defer(() -> {
                    Ratings newRating = new Ratings();
                    newRating.setUserId(userId);
                    newRating.setEntityId(entityId);
                    newRating.setEntityType(entityType);
                    return Mono.just(newRating);
                }))
                .map(rating -> {
                    rating.setScore(score);
                    rating.setFeedback(feedback);
                    rating.setEvaluationDate(LocalDateTime.now());
                    rating.setUserId(userId);
                    rating.setEntityId(entityId);
                    rating.setEntityType(entityType);
                    return rating;
                })
                .flatMap(ratingRepository::save)
                .then();
    }
}
















