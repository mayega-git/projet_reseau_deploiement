package com.letsgo.education_service.dto.CategoryDTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CategoryCreateDTO {


    @Schema(description = "Name of the category", example = "Technology")
    private String name;

    @Schema(description = "Description of the category", example = "This category includes all topics related to technology.")
    private String description;

    @Schema(description = "Domain of the category", example = "SCIENCE")
    private String domain;

}
