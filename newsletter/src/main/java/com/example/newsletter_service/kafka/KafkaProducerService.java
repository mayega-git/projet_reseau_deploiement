package com.example.newsletter_service.kafka;

import com.example.newsletter_service.dto.NewsletterPublishedEvent;
import com.example.newsletter_service.models.Categorie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Service
@Slf4j
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaProducerService {

        private final KafkaTemplate<String, NewsletterPublishedEvent> kafkaTemplate;
        private static final String NEWSLETTER_TOPIC = "newsletter.updates";

        /**
         * Publie une newsletter dans le topic unique 'newsletter.updates'.
         * Le filtrage des destinataires se fera à la consommation.
         */
        public Mono<Void> publishNewsletterToCategories(
                        NewsletterPublishedEvent event,
                        List<Categorie> categories) {

                log.info("📤 Publication de la newsletter {} dans le topic global ({} catégories concernées)",
                                event.getNewsletterId(),
                                categories.size());

                return Mono.fromFuture(() -> {
                        CompletableFuture<SendResult<String, NewsletterPublishedEvent>> future = kafkaTemplate.send(
                                        NEWSLETTER_TOPIC,
                                        event.getNewsletterId().toString(),
                                        event);

                        return future.thenApply(result -> {
                                log.info("✅ Newsletter {} publiée sur {} [Part: {}, Off: {}]",
                                                event.getNewsletterId(),
                                                NEWSLETTER_TOPIC,
                                                result.getRecordMetadata().partition(),
                                                result.getRecordMetadata().offset());
                                return null;
                        });
                }).then();
        }
}
