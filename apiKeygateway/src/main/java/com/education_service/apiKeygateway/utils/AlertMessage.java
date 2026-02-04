package com.education_service.apiKeygateway.utils;

import lombok.Data;

@Data
public class AlertMessage {

    private String type; // "success", "error", "warning", "info"
    private String content;
    
    public AlertMessage(String type, String content) {
        this.type = type;
        this.content = content;
    }
    
   
    
}
