package com.letsgo.education_service.models;

import java.util.UUID;

import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import com.letsgo.education_service.service.educationService.InterfaceEntity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Table("cours")
public class Course extends Education_entity implements InterfaceEntity {

    @Column("formateur")
    private String trainerName;

    @Column("nombre_heures")
    private String duration;

    @Column("niveau")
    private String level;

}
