package com.education_service.apiKeygateway.models;


import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import com.education_service.apiKeygateway.enums.Module;
import com.education_service.apiKeygateway.enums.Scope;
import lombok.Data;


@Data
@Table(name="permission")
public class Permission {

    @Id
    private UUID id;

    @Column("service_name")
    private Module serviceName;

    @Column("scope")
    private Scope scope;

    @Column("request_limit")
    private int requestLimit;

    @Column("request_token_id")
    private UUID requestTokenId;

   
    



    
}
