package com.education_service.apiKeygateway.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.education_service.apiKeygateway.enums.Scope;
import com.education_service.apiKeygateway.models.Permission;
import com.education_service.apiKeygateway.repository.PermissionRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    

    public Mono<Permission> savePermission(Permission permission) {
        return permissionRepository.save(permission)
                .doOnSuccess(savedPermission -> {
                    System.out.println("✅ Permission enregistrée avec succès ! ID: " + savedPermission.getId());
                })
                .doOnError(error -> {
                    System.out.println("❌ Erreur lors de l'enregistrement de la permission : " + error.getMessage());
                });
    }

    public Mono<List<Scope>> getAllPermissionByRequest(UUID requestTokenId) {
        
        return permissionRepository.findAllByRequestTokenId(requestTokenId)
                .map(Permission::getScope)
                .collectList()
                .doOnSuccess(list -> {
                    System.out.println("✅ Permissions récupérées avec succès ! Liste : " + list);
                })
                .doOnError(error -> {
                    System.out.println("❌ Erreur lors de la récupération des permissions : " + error.getMessage());
                });
    }
 

}
