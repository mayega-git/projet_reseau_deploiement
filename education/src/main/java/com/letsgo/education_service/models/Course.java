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
@Table("course")
public class Course extends Education_entity implements InterfaceEntity {

    @Column("trainer_name")
    private String trainerName;

    @Column("duration")
    private String duration;

    @Column("niveau")
    private String level;

}
