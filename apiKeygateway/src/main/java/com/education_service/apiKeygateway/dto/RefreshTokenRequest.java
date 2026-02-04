package com.education_service.apiKeygateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenRequest {
    
   
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;

}