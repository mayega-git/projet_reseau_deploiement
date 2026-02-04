package com.example.newsletter_service.services;

import com.example.newsletter_service.models.Categorie;
import com.example.newsletter_service.dto.CategorieRequest;
import com.example.newsletter_service.dto.CategorieResponse;
import com.example.newsletter_service.repositories.CategorieRepository;
import com.example.newsletter_service.dto.CategorieResponse;
import com.example.newsletter_service.exception.DuplicateResourceException;
import com.example.newsletter_service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaAdmin;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategorieService {
    
    private final CategorieRepository categorieRepository;
     private final KafkaAdmin kafkaAdmin;
    
    
    @Transactional
    public Mono<CategorieResponse> createCategorie(CategorieRequest request) {
        log.info("📂 Création d'une nouvelle catégorie: {}", request.getNom());
        
        String kafkaTopic = "newsletter." + request.getNom().toLowerCase()
            .replaceAll("[^a-z0-9]", "");
        
        // Vérifier si la catégorie existe déjà
        return categorieRepository.findByNom(request.getNom())
            .flatMap(existing -> Mono.<CategorieResponse>error(
                new DuplicateResourceException("La catégorie '" + request.getNom() + "' existe déjà")))
            .switchIfEmpty(
                categorieRepository.findByKafkaTopic(kafkaTopic)
                    .flatMap(existing -> Mono.<CategorieResponse>error(
                        new DuplicateResourceException("Le topic Kafka '" + kafkaTopic + "' existe déjà")))
                    .switchIfEmpty(createCategorieWithTopic(request, kafkaTopic))
            )
            .cast(CategorieResponse.class);
    }
    
    
    private Mono<CategorieResponse> createCategorieWithTopic(
            CategorieRequest request, 
            String kafkaTopic) {
        
        Categorie categorie = Categorie.builder()
            .nom(request.getNom())
            .description(request.getDescription())
            .kafkaTopic(kafkaTopic)
            .createdAt(LocalDateTime.now())
            .build();
        
        return categorieRepository.save(categorie)
            .flatMap(savedCategorie -> 
                createKafkaTopic(kafkaTopic)
                    .thenReturn(savedCategorie)
            )
            .map(this::mapToResponse)
            .doOnSuccess(response -> 
                log.info("✅ Catégorie {} créée avec le topic Kafka: {}", 
                        response.getNom(), 
                        kafkaTopic));
    }
    
    /**
     * Crée physiquement le topic Kafka
     */
    private Mono<Void> createKafkaTopic(String topicName) {
        return Mono.fromRunnable(() -> {
            try (AdminClient adminClient = AdminClient.create(kafkaAdmin.getConfigurationProperties())) {
                NewTopic newTopic = new NewTopic(topicName, 3, (short) 1); // 3 partitions, RF=1
                adminClient.createTopics(Collections.singleton(newTopic));
                log.info("🎯 Topic Kafka créé: {}", topicName);
            } catch (Exception e) {
                log.error("❌ Erreur lors de la création du topic Kafka {}: {}", 
                         topicName, 
                         e.getMessage());
                throw new RuntimeException("Échec de la création du topic Kafka", e);
            }
        });
    }
    
    /**
     * Récupère toutes les catégories disponibles
     */
    public Flux<CategorieResponse> getAllCategories() {
        return categorieRepository.findAll()
            .map(this::mapToResponse)
            .doOnComplete(() -> log.debug("📋 Liste des catégories récupérée"));
    }
    
    /**
     * Récupère une catégorie par son ID
     */
    public Mono<CategorieResponse> getCategorieById(UUID id) {
        return categorieRepository.findById(id)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException(id)))
            .map(this::mapToResponse);
    }
    
    /**
     * Récupère une catégorie par son nom
     */
    public Mono<CategorieResponse> getCategorieByNom(String nom) {
        return categorieRepository.findByNom(nom)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException("Catégorie '" + nom + "' introuvable")))
            .map(this::mapToResponse);
    }
    
    /**
     * Met à jour une catégorie (description uniquement, pas le nom ni le topic)
     */
    @Transactional
    public Mono<CategorieResponse> updateCategorie(UUID id, String newDescription) {
        return categorieRepository.findById(id)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException(id)))
            .flatMap(categorie -> {
                categorie.setDescription(newDescription);
                return categorieRepository.save(categorie);
            })
            .map(this::mapToResponse)
            .doOnSuccess(response -> 
                log.info("🔄 Catégorie {} mise à jour", response.getNom()));
    }
    
    /**
     * Supprime une catégorie (ATTENTION: cascade sur abonnements et newsletters)
     */
    @Transactional
    public Mono<Void> deleteCategorie(UUID id) {
        return categorieRepository.findById(id)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException(id)))
            .flatMap(categorie -> 
                categorieRepository.delete(categorie)
                    .doOnSuccess(v -> 
                        log.warn("🗑️ Catégorie {} supprimée (cascade appliqué)", categorie.getNom()))
            );
    }
    
    private CategorieResponse mapToResponse(Categorie categorie) {
        return CategorieResponse.builder()
            .id(categorie.getId())
            .nom(categorie.getNom())
            .description(categorie.getDescription())
            .build();
    }
}
