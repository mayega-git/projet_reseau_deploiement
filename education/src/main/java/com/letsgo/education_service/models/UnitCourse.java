package com.letsgo.education_service.models;

import java.util.UUID;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class UnitCourse extends Course{

    @Id
    private UUID idUnitCourse;

    private UUID idCours;

    private Integer unit;
    
}
