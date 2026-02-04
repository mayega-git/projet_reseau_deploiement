package com.example.newsletter_service.models;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("newsletter_categorie")
public class NewsletterCategorie {
    @Id
    private UUID id;
    
    @Column("newsletter_id")
    private UUID newsletterId;
    
    @Column("categorie_id")
    private UUID categorieId;
}