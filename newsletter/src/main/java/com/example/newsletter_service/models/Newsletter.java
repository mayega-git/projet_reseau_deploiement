package com.example.newsletter_service.models;
import com.example.newsletter_service.enums.StatutNewsletter;

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
@Table("newsletter")
public class Newsletter {
    @Id
    private UUID id;
    
    @Column("titre")
    private String titre;
    
    @Column("contenu")
    private String contenu; // HTML content
    
    @Column("statut")
    private StatutNewsletter statut;
    
    @Column("redacteur_id")
    private UUID redacteurId;
    
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @Column("published_at")
    private LocalDateTime publishedAt;
}