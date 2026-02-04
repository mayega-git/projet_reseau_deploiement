package com.letsgo.education_service.service.educationCategoryService;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.letsgo.education_service.models.Education_Category;
import com.letsgo.education_service.repository.EducationCategoriesRepository;
import com.letsgo.education_service.service.category.CategoryService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service

public class EducationCategoryService {

    private final CategoryService categoriesService;

    private final EducationCategoriesRepository educationCategoriesRepository;

    public EducationCategoryService(CategoryService categoryService,EducationCategoriesRepository educationCategoriesRepository){
        this.educationCategoriesRepository = educationCategoriesRepository;
        this.categoriesService = categoryService;
    }


    public Mono<Void> saveEducationCategory(UUID Id,List<String> categories){

        Flux<Education_Category> categoriesIdList = categoriesService.getIdListCategory(categories)
                                .switchIfEmpty(
                                    Flux.defer(() -> {
                                    System.out.println("⚠️ Aucune Categorie trouvé dans la base. Arrêt du flux.");
                                    return Flux.empty();
                                    })
                                )
                                .flatMap(categoryId ->{
                                    Education_Category education_Category = new Education_Category();
                                    education_Category.setIdBlog(Id);  
                                    education_Category.setIdCategory(categoryId);
                                    return educationCategoriesRepository.save(education_Category);
                                })
                            
                                .doOnNext(  savedAssociation -> System.out.println("=========listIdCategories===== "+savedAssociation)).log();
                return categoriesIdList.then();

    }

    public Flux<String> getCategoriesByEducation(String id){
        return educationCategoriesRepository.getCategoriesByEducation(UUID.fromString(id));
    }
    
}
