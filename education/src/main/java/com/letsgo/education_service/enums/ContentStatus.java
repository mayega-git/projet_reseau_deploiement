package com.letsgo.education_service.enums;



public enum ContentStatus {
    CREATED("CREATED"),
    PUBLISHED("PUBLISHED"),
    REFUSED("REFUSED"),
    ARCHIVED("ARCHIVED"),
    DRAFT("DRAFT");

    private final String value;

    ContentStatus(String value) {
        this.value = value;
    }

     public String getValue() {
        return value;
    }
    
}
