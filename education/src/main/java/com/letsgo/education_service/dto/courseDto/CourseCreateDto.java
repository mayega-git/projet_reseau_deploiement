package com.letsgo.education_service.dto.courseDto;

import com.letsgo.education_service.dto.BlogDTO.BlogCreateDTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseCreateDto extends BlogCreateDTO {

    @NotBlank
    @Schema(description = "formateur ", example = "firstName + LastName")
    private String trainerName;

    @NotBlank
    @Schema(description = "duration ", example = "2 heures")
    private String duration;

    @NotBlank
    @Schema(description = "level ", example = "beginner, intermediate, advanced")
    private String level;

}
