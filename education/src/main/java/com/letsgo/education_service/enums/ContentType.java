package com.letsgo.education_service.enums;

public enum ContentType {
    BLOG("BLOG"),
    PODCAST("PODCAST"),
    COMMENT("COMMENT");

    private  final String  value;
    
    ContentType(String value){
        this.value=value;    
    }

    public String getValue(){
        return this.value;
    }
    
}
