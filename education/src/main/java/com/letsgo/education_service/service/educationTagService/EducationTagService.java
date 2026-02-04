package com.letsgo.education_service.service.educationTagService;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.letsgo.education_service.models.Education_Tag;

import com.letsgo.education_service.repository.EducationTagRepository;
import com.letsgo.education_service.service.tag.TagService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class EducationTagService {

    private final TagService tagService;

    
    private final EducationTagRepository educationTagRepository;

    public EducationTagService(TagService tagService,EducationTagRepository educationTagRepository){
        this.educationTagRepository = educationTagRepository;
        this.tagService = tagService;
    }

    public Mono<Void> saveEducationTag(UUID blogId,List<String> tagList){
        
        System.out.println("=========ON ENTRE DANS LA FONCTION TAGLIST========== \n"+"===========liste_tag======= "+tagList+" ======blogId====== \n"+blogId);
        Flux<Education_Tag> tagIdList = tagService.getIdListTag(tagList)
        .switchIfEmpty(
            Flux.defer(() -> {
            System.out.println("⚠️ Aucun tag trouvé dans la base. Arrêt du flux.");
            return Flux.empty();
            })
        )
        .flatMap(tagId ->{
                Education_Tag education_Tag = new Education_Tag();
                education_Tag.setIdBlog(blogId);
                education_Tag.setIdTag(tagId);
                System.out.println("========blog_tag=========== "+education_Tag);
                return educationTagRepository.save(education_Tag)
                        .doOnNext(saved -> System.out.println(" Association sauvegardée: " + saved.getIdTag()));

        })
        .doOnNext(  savedAssociation -> System.out.println("=========listIdTag===== "+savedAssociation)).log()
        .doOnError(e -> System.out.println("========= ERREUR save: " + e.getMessage()));
        return tagIdList.then();

    }

    
    public Flux<String> getTagsByEducation(UUID id) {
        return educationTagRepository.getTagsByEducation(id);
    }
    
}
