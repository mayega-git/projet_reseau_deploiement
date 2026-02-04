package com.example.newsletter_service.kafka;
import com.example.newsletter_service.dto.NewsletterPublishedEvent;

import com.example.newsletter_service.models.Categorie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaProducerService {
    
    private final KafkaTemplate<String, NewsletterPublishedEvent> kafkaTemplate;
    
    /**
     * Publie une newsletter dans TOUS les topics Kafka correspondant aux catégories
     * auxquelles elle appartient.
     * 
     * Exemple : Newsletter [Sport, Finance] → publiée dans "newsletter.sport" ET "newsletter.finance"
     * 
     * @param event Événement contenant les données de la newsletter
     * @param categories Liste des catégories (avec leurs kafkaTopics)
     * @return Mono<Void> indiquant la complétion
     */
    public Mono<Void> publishNewsletterToCategories(
            NewsletterPublishedEvent event,
            List<Categorie> categories) {
        
        log.info("📤 Publication de la newsletter {} dans {} topics", 
                 event.getNewsletterId(), 
                 categories.size());
        
        return Flux.fromIterable(categories)
            .flatMap(categorie -> publishToTopic(categorie.getKafkaTopic(), event))
            .then()
            .doOnSuccess(v -> log.info("✅ Newsletter {} publiée avec succès dans tous les topics", 
                                       event.getNewsletterId()))
            .doOnError(e -> log.error("❌ Erreur lors de la publication de la newsletter {}: {}", 
                                      event.getNewsletterId(), 
                                      e.getMessage()));
    }
    
    /**
     * Publie un événement dans un topic Kafka spécifique
     */
    private Mono<Void> publishToTopic(String topic, NewsletterPublishedEvent event) {
        return Mono.fromFuture(() -> {
            log.debug("→ Envoi dans le topic: {}", topic);
            
            CompletableFuture<SendResult<String, NewsletterPublishedEvent>> future = 
                kafkaTemplate.send(topic, event.getNewsletterId().toString(), event);
            
            return future.thenApply(result -> {
                log.debug("✓ Message envoyé dans {} - Partition: {}, Offset: {}",
                         topic,
                         result.getRecordMetadata().partition(),
                         result.getRecordMetadata().offset());
                return null;
            });
        }).then();
    }
}
