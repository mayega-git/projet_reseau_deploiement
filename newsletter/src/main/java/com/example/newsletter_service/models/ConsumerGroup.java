package com.example.newsletter_service.models;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Métadonnées d'un consumer group Kafka
 *
 * Cette classe permet de persister et tracer les consumer groups créés dynamiquement.
 * Un consumer group représente un ensemble unique de catégories souscrites.
 *
 * Exemple:
 * - Lecteurs abonnés à [sport] → consumer group "cg_sport"
 * - Lecteurs abonnés à [sport, politique] → consumer group "cg_politique_sport"
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("consumer_groups")
public class ConsumerGroup{

    /**
     * ID unique du consumer group (UUID)
     */
    @Id
    private UUID id;

    /**
     * ID unique du consumer group dans Kafka (ex: "cg_sport_politique")
     * Format: cg_{cat1}_{cat2}_... (trié alphabétiquement)
     */
    @Column("group_id")
    private String groupId;

    /**
     * Signature des catégories (slugs séparés par virgule)
     * Exemple: "politique,sport"
     * Les slugs sont triés alphabétiquement
     */
    @Column("category_signature")
    private String categorySignature;

    /**
     * Topics Kafka écoutés par ce consumer group (séparés par virgule)
     * Exemple: "news.politique,news.sport"
     */
    @Column("topics_subscribed")
    private String topicsSubscribed;

    /**
     * Nombre de lecteurs dans ce consumer group
     */
    @Column("reader_count")
    @Builder.Default
    private Integer readerCount = 0;

    /**
     * Statut du consumer group
     * Valeurs possibles: ACTIVE, PAUSED, STOPPED
     */
    @Column("status")
    @Builder.Default
    private String status = "ACTIVE";

    /**
     * Date de création du consumer group
     */
    @Column("created_at")
    private LocalDateTime createdAt;

    /**
     * Date de dernière mise à jour
     */
    @Column("updated_at")
    private LocalDateTime updatedAt;

    /**
     * Date du dernier message consommé par ce consumer group
     */
    @Column("last_consumed_at")
    private LocalDateTime lastConsumedAt;

    // ========== Méthodes utilitaires ==========

    /**
     * Parse les topics en Set pour faciliter la manipulation
     *
     * @return Set de noms de topics (ex: ["news.sport", "news.politique"])
     */
    public Set<String> getTopicsAsSet() {
        if (topicsSubscribed == null || topicsSubscribed.trim().isEmpty()) {
            return Collections.emptySet();
        }

        return Arrays.stream(topicsSubscribed.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    /**
     * Parse la signature des catégories en Set
     *
     * @return Set de slugs de catégories (ex: ["sport", "politique"])
     */
    public Set<String> getCategorySignatureAsSet() {
        if (categorySignature == null || categorySignature.trim().isEmpty()) {
            return Collections.emptySet();
        }

        return Arrays.stream(categorySignature.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    /**
     * Définit les topics à partir d'un Set
     *
     * @param topics Set de noms de topics
     */
    public void setTopicsFromSet(Set<String> topics) {
        if (topics == null || topics.isEmpty()) {
            this.topicsSubscribed = "";
        } else {
            this.topicsSubscribed = String.join(",", topics);
        }
    }

    /**
     * Définit la signature des catégories à partir d'un Set
     *
     * @param categorySlugs Set de slugs de catégories
     */
    public void setCategorySignatureFromSet(Set<String> categorySlugs) {
        if (categorySlugs == null || categorySlugs.isEmpty()) {
            this.categorySignature = "";
        } else {
            // Trier alphabétiquement pour garantir l'unicité de la signature
            this.categorySignature = categorySlugs.stream()
                    .sorted()
                    .collect(Collectors.joining(","));
        }
    }

    /**
     * Incrémente le nombre de lecteurs
     */
    public void incrementReaderCount() {
        if (this.readerCount == null) {
            this.readerCount = 1;
        } else {
            this.readerCount++;
        }
    }

    /**
     * Décrémente le nombre de lecteurs
     */
    public void decrementReaderCount() {
        if (this.readerCount == null || this.readerCount <= 0) {
            this.readerCount = 0;
        } else {
            this.readerCount--;
        }
    }

    /**
     * Vérifie si le consumer group est actif
     *
     * @return true si le statut est ACTIVE
     */
    public boolean isActive() {
        return "ACTIVE".equalsIgnoreCase(this.status);
    }

    /**
     * Vérifie si le consumer group est en pause
     *
     * @return true si le statut est PAUSED
     */
    public boolean isPaused() {
        return "PAUSED".equalsIgnoreCase(this.status);
    }

    /**
     * Vérifie si le consumer group est arrêté
     *
     * @return true si le statut est STOPPED
     */
    public boolean isStopped() {
        return "STOPPED".equalsIgnoreCase(this.status);
    }

    /**
     * Met le consumer group en pause
     */
    public void pause() {
        this.status = "PAUSED";
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Active le consumer group
     */
    public void activate() {
        this.status = "ACTIVE";
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Arrête le consumer group
     */
    public void stop() {
        this.status = "STOPPED";
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Met à jour la date de dernière consommation
     */
    public void updateLastConsumed() {
        this.lastConsumedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Retourne une représentation textuelle du consumer group
     */
    @Override
    public String toString() {
        return String.format(
                "ConsumerGroup[id=%s, groupId=%s, categories=%s, topics=%s, readers=%d, status=%s]",
                id, groupId, categorySignature, topicsSubscribed, readerCount, status
        );
    }
}
