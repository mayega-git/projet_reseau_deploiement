package com.example.newsletter_service.services;

import com.example.newsletter_service.models.Categorie;
import com.example.newsletter_service.repositories.LecteurCategorieAbonnementRepository;
import com.example.newsletter_service.repositories.CategorieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConsumerGroupManager {

    private final LecteurCategorieAbonnementRepository abonnementRepository;
    private final CategorieRepository categorieRepository;

    /**
     * Crée ou récupère le consumer group Kafka pour un lecteur
     * 
     * @param lecteurId UUID du lecteur
     * @return Mono<String> nom du consumer group
     */
    public Mono<String> getOrCreateConsumerGroupForLecteur(UUID lecteurId) {
        return abonnementRepository.findByLecteurId(lecteurId)
                .map(abonnement -> abonnement.getCategorieId())
                .collectList()
                .flatMap(categorieIds -> {
                    if (categorieIds.isEmpty()) {
                        log.warn("⚠️ Lecteur {} n'a aucun abonnement", lecteurId);
                        return Mono.empty();
                    }

                    return categorieRepository.findByIdIn(categorieIds)
                            .map(Categorie::getNom)
                            .collectList()
                            .map(categorieNames -> {
                                // Tri alphabétique pour cohérence
                                Collections.sort(categorieNames);

                                // Construction du nom du consumer group
                                String groupId = "group_" + String.join("_", categorieNames)
                                        .toLowerCase()
                                        .replaceAll("[^a-z0-9_]", "");

                                log.info("👥 Consumer group déterminé pour lecteur {}: {}", lecteurId, groupId);
                                return groupId;
                            });
                });
    }

    /**
     * Récupère la liste des topics Kafka pour un lecteur
     */
    public Mono<List<String>> getTopicsForLecteur(UUID lecteurId) {
        return abonnementRepository.findByLecteurId(lecteurId)
                .map(abonnement -> abonnement.getCategorieId())
                .collectList()
                .flatMapMany(categorieIds -> categorieRepository.findByIdIn(categorieIds))
                .map(Categorie::getKafkaTopic)
                .collectList()
                .doOnNext(topics -> log.info("📋 Topics pour lecteur {}: {}", lecteurId, topics));
    }

    /**
     * Trouve tous les lecteurs appartenant au même consumer group
     * (= ayant exactement la même combinaison de catégories)
     */
    public Flux<UUID> findLecteursInSameConsumerGroup(String groupId) {
        // Cette méthode nécessiterait une requête SQL complexe
        return Flux.empty(); // Placeholder
    }

    /**
     * Initialise tous les consumer groups au démarrage de l'application.
     * Récupère tous les groupes de catégories uniques et crée les listeners
     * correspondants.
     * 
     * @return Flux de tuples (groupId, topics)
     */
    public Flux<reactor.util.function.Tuple2<String, List<String>>> initializeAllConsumerGroups() {
        log.info("🔍 Recherche de tous les consumer groups à initialiser...");

        // Récupérer toutes les catégories avec des abonnements et créer les consumer
        // groups
        return categorieRepository.findAll()
                .filter(categorie -> categorie.getKafkaTopic() != null)
                .collectList()
                .flatMapMany(categories -> {
                    if (categories.isEmpty()) {
                        log.warn("⚠️ Aucune catégorie avec topic Kafka trouvée");
                        return Flux.empty();
                    }

                    // Créer un consumer group global pour toutes les catégories
                    List<String> allTopics = categories.stream()
                            .map(Categorie::getKafkaTopic)
                            .toList();

                    List<String> allNames = categories.stream()
                            .map(Categorie::getNom)
                            .sorted()
                            .map(name -> name.toLowerCase().replaceAll("[^a-z0-9]", ""))
                            .toList();

                    String globalGroupId = "group_" + String.join("_", allNames);

                    log.info("📢 Consumer group global créé: {} avec {} topics",
                            globalGroupId, allTopics.size());

                    return Flux.just(reactor.util.function.Tuples.of(globalGroupId, allTopics));
                });
    }
}