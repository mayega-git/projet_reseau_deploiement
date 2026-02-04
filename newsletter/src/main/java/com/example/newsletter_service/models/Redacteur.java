package com.example.newsletter_service.models;

import com.example.newsletter_service.enums.RedacteurStatus;
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
@Table("redacteur")
public class Redacteur {
    
    @Id
    private UUID id;
    
    @Column("nom")
    private String nom;
    
    @Column("prenom")
    private String prenom;
    
    @Column("email")
    private String email;
    
    @Column("password")
    private String password;
    
    @Column("status")
    @Builder.Default
    private RedacteurStatus status = RedacteurStatus.PENDING;
    
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @Column("processed_at")
    private LocalDateTime processedAt;
    
   
    @Column("rejection_reason")
    private String rejectionReason;
}