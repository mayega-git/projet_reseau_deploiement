package com.letsgo.education_service.enums;

public enum LevelEnum {

    BEGINNER("DEBUTANT"),
    INTERMEDIATE("INTERMEDIATIRE"),
    ADVANCED("AVANCE");

    private  final String  value;

    LevelEnum(String value){
        this.value=value;    
    }

    public String getValue(){
        return this.value;
    }
    
}
