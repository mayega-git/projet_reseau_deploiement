package com.letsgo.education_service.dto;

import java.util.List;
import java.util.UUID;

public interface EducationCreateDTO {

    String getTitle();

    String getDescription();

    UUID getAuthorId();

    UUID getOrganisationId();

    String getDomain();

    List<String> getTags();

    List<String> getCategories();

}
