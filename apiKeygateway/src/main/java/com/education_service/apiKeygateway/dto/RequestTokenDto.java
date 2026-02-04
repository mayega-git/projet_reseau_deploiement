package com.education_service.apiKeygateway.dto;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.annotation.Id;

import com.education_service.apiKeygateway.enums.Module;
import com.education_service.apiKeygateway.enums.Scope;
import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestTokenDto {


 
    @Id
    @JsonIgnore
    private UUID id;
    
    private String clientName;

    @Schema(example = "letsgo@gmail.com")
    private String email;

    private Map<Module, Scope> serviceNames;


   
    
}
