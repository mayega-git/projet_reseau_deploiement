package com.letsgo.education_service.models;


import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@AllArgsConstructor
@NoArgsConstructor
@Table("education_category")
public class Education_Category {
    
    @Id
    private UUID id;

    private  UUID idBlog;

    private UUID idCategory;

   

    
}
