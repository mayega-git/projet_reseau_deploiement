package com.example.newsletter_service.models;
import com.example.newsletter_service.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Entité Lecteur
 * Représente un utilisateur abonné aux newsletters
 * Hérite de User pour les champs communs (id, email, etc.)
 */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table("lecteur")
public class Lecteur  {
    @Id
    private UUID id;
    

    @Column("nom")
    private String nom;

    @Column("prenom")
    private String prenom;

    @Column("email")
    private String email;
    @Column("preferences")
    private String preferences; // Stocké comme JSON string

   

    @Column("notification_email")
    private Boolean notificationEmail;
    

    @Column("status")
    private UserStatus status;

    @Column("created_at")
    private LocalDateTime createdAt;

    
   
}







