package com.education_service.apiKeygateway.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import com.education_service.apiKeygateway.enums.Status;

import lombok.Data;

@Data
@Table(value = "request_token")
public class RequestToken {

    @Id
    private UUID id;

    @Column("client_name")
    private String clientName;

  

    @Column("email")
    private String email;

    @Column("status_request_token")
    private Status statusRequestToken;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("accepted_at")
    private LocalDateTime acceptedAt;

    @Column("expired_at")
    private LocalDateTime expiredAt;


    

    
    
}
