package com.example.newsletter_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("lecteur_categorie_abonnement")
public class LecteurCategorieAbonnement {
    @Id
    private UUID id;
    
    @Column("lecteur_id")
    private UUID lecteurId;
    
    @Column("categorie_id")
    private UUID categorieId;
    
    @Column("subscribed_at")
    private LocalDateTime subscribedAt;
}