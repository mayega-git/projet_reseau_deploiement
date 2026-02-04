package com.letsgo.education_service.enums;

public enum Domain {
    TAXI("TAXI"),
    AGRICULTURE("AGRICULTURE"),
    TRAFFIC_RESEAU("TRAFFIC_RESEAU"),
    EDUCATION("EDUCATION"),
    TECHNOLOGY("TECHNOLOGY"),
    SCIENCE("SCIENCE"),
    ASTRONOMY("ASTRONOMY"),
    INFORMATIQUE("INFORMATIQUE"),
    LITTERATURE("LITTERATURE");

    private  final String  value;

    Domain(String value){
        this.value=value;    
    }

    public String getValue(){
        return this.value;
    }
}
