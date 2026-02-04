package com.letsgo.education_service.service.favorite;

import com.letsgo.education_service.enums.ContentType;
import com.letsgo.education_service.models.Favorite;
import com.letsgo.education_service.repository.FavoriteRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class FavoriteService {

    @Autowired
    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    public Mono<Boolean> toggleFavorite(UUID userId, UUID entity_id,String contentType) {
    return favoriteRepository.findByUserIdAndEntityIdAndContentType(userId,entity_id,ContentType.valueOf(contentType))
            .flatMap(favorite -> favoriteRepository.delete(favorite)
                    .thenReturn(false))
            .switchIfEmpty(
                    Mono.fromCallable(() -> {
                        Favorite favorite = new Favorite();
                        favorite.setUserId(userId);
                        favorite.setContentType(ContentType.valueOf(contentType));

                        favorite.setEntityId(entity_id);
                       
                        
                        return favorite;
                    })
                    .flatMap(favorite -> favoriteRepository.save(favorite))
                    .thenReturn(true)
            );
    }


    public Mono<Long> getFavoriteCountBlog(UUID entity_id) {
        return favoriteRepository.countByEntityId(entity_id);
    }
    /*public Mono<Long> getFavoriteCountPodcast(String podcast_id) {
        return favoriteRepository.countByPodcastId(podcast_id);
    }*/



    public Flux<Favorite> getFavoritesByUserId(UUID userId) {
        return favoriteRepository.findByUserId(userId);
    }


    public Flux<Favorite> getAllFavorites() {
        return favoriteRepository.findAll();
    }
}
