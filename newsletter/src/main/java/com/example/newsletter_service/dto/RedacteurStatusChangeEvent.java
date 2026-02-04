package com.example.newsletter_service.dto;
import com.example.newsletter_service.enums.RedacteurStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class RedacteurStatusChangeEvent {
    
    private UUID requestId;
    private String email;
    private String nom;
    private String prenom;
    private RedacteurStatus status;
    private String rejectionReason;
    private LocalDateTime processedAt;
}