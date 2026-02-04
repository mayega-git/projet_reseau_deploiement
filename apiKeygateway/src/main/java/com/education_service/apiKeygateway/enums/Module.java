package com.education_service.apiKeygateway.enums;

public enum Module {

    EDUCATION("EDUCATION"),
    RATINGS("RATINGS"),
    NEWSLETTER("NEWSLETTER"),
    FORUM("FORUM");

    private  final String  value;

    Module(String value){
        this.value=value;    
    }

    public String getValue(){
        return this.value;
    }
    
}
