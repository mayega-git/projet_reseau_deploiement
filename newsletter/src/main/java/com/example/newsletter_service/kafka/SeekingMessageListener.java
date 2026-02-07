package com.example.newsletter_service.kafka;

import com.example.newsletter_service.dto.NewsletterPublishedEvent;
import com.example.newsletter_service.services.KafkaConsumerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.TopicPartition;
import org.springframework.kafka.listener.AcknowledgingMessageListener;
import org.springframework.kafka.listener.ConsumerSeekAware;
import org.springframework.kafka.support.Acknowledgment;

import java.util.Map;

/**
 * Custom MessageListener that implements ConsumerSeekAware to allow seeking.
 * Specifically used to ignore old messages by seeking to the end on partition
 * assignment.
 */
@Slf4j
@RequiredArgsConstructor
public class SeekingMessageListener
        implements AcknowledgingMessageListener<String, NewsletterPublishedEvent>, ConsumerSeekAware {

    private final KafkaConsumerService kafkaConsumerService;
    private final java.util.List<String> listenedTopics;

    @Override
    public void onMessage(@org.springframework.lang.NonNull ConsumerRecord<String, NewsletterPublishedEvent> data,
            @org.springframework.lang.Nullable Acknowledgment acknowledgment) {
        if (acknowledgment != null) {
            kafkaConsumerService.consumeNewsletterEvent(data, acknowledgment, listenedTopics);
        }
    }

    @Override
    public void onPartitionsAssigned(@org.springframework.lang.NonNull Map<TopicPartition, Long> assignments,
            @org.springframework.lang.NonNull ConsumerSeekCallback callback) {
        if (assignments != null && !assignments.isEmpty()) {
            log.info("Seeking to end for partitions: {}", assignments.keySet());
            callback.seekToEnd(assignments.keySet());
        }
    }

    @Override
    public void registerSeekCallback(ConsumerSeekCallback callback) {
        // No-op
    }

    @Override
    public void onIdleContainer(Map<TopicPartition, Long> assignments, ConsumerSeekCallback callback) {
        // No-op
    }
}
