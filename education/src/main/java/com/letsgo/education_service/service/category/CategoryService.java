package com.letsgo.education_service.service.category;

import com.letsgo.education_service.dto.CategoryDTO.CategoryCreateDTO;
import com.letsgo.education_service.enums.Domain;
import com.letsgo.education_service.models.Category_entity;
import com.letsgo.education_service.repository.CategoryRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;


@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Mono<Category_entity> createCategory(CategoryCreateDTO categoryDTO) {
        Category_entity category = new Category_entity();
        category.setDomain(Domain.valueOf(categoryDTO.getDomain()));
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        return categoryRepository.save(category);
    }

    public Mono<Category_entity> updateCategory(String categoryId, CategoryCreateDTO categoryDTO) {

    return categoryRepository.findById(UUID.fromString(categoryId))

        //Gérer le cas où la catégorie n'est pas trouvée (équivalent réactif du 'if') 
        .switchIfEmpty(Mono.error(new RuntimeException("Catégorie non trouvée")))

        //Modifier l'entité trouvée (Opération map : transformation non-bloquante du contenu du Mono)
        .map(existingCategory -> {
            // Mise à jour des propriétés (Category_entity est le contenu du Mono)
            existingCategory.setName(categoryDTO.getName());
            existingCategory.setDescription(categoryDTO.getDescription());
            existingCategory.setUpdatedAt(Instant.now());
            
            // Retourner l'entité modifiée pour l'étape suivante (save)
            return existingCategory;
        })
        .flatMap(categoryRepository::save);
}

    public Mono<Category_entity> getCategoryById(String categoryId) {
        return categoryRepository.findById(UUID.fromString(categoryId))
                .switchIfEmpty(Mono.error(new RuntimeException("Catégorie non trouvée")));
    }


    public Mono<Void> deleteCategory(String categoryId) {
        return categoryRepository.deleteById(UUID.fromString(categoryId))
        .doOnSuccess(droped -> 
            System.out.println("suppresion reussie ")
        )
        .onErrorMap(e -> new RuntimeException("Erreur lors de la suppression"));
    }

    public Flux<Category_entity> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Flux<UUID> getIdListCategory(List<String> categories){

            return getAllCategories()
                .filter(category -> categories.contains(category.getName()))
                .map(Category_entity::getId);

       }  

    
    }



