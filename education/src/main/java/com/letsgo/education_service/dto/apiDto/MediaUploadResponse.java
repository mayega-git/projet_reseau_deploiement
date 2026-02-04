package com.letsgo.education_service.dto.apiDto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MediaUploadResponse {

   
    @JsonProperty("created_at")
    private String createdAt;
    
    @JsonProperty("updated_at")
    private String updatedAt;
    
    @JsonProperty("created_by")
    private String createdBy;
    
    @JsonProperty("updated_by")
    private String updatedBy;
    
    private String id;
    private String service;
    private String name;
    
    @JsonProperty("real_name")
    private String realName;

    private Integer size; // Stocké comme String après conversion
    private String mime;
    private String extension;
    private String path;

    private String uri;

}
