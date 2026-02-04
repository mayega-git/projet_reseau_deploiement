package com.example.newsletter_service.dto;
import lombok.AllArgsConstructor;
import com.example.newsletter_service.enums.RedacteurStatus;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

 @Data
@Builder
public class RedacteurRequestResponse {
    
    private UUID id;
    private String email;
    private String nom;
    private String prenom;
    private RedacteurStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
    private String rejectionReason;
}



