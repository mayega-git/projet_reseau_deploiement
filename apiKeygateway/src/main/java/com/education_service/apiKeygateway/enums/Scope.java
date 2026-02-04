package com.education_service.apiKeygateway.enums;

public enum Scope {

    READ("READ"),
    WRITE("WRITE"),
    ALL("ALL");

    private  final String  value;

    Scope(String value){
        this.value=value;    
    }

    public String getValue(){
        return this.value;
    }
}
