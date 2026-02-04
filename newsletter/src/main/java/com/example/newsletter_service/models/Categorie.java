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
@Table("categorie")
public class Categorie {
    
  @Id
    private UUID id;
    
    @Column("nom")
    private String nom;
    
    @Column("description")
    private String description;
    
    @Column("kafka_topic")
    private String kafkaTopic; // Ex: "newsletter.sport"
    
    @Column("created_at")
     private LocalDateTime createdAt;
}
