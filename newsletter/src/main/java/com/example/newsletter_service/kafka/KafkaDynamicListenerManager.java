package com.example.newsletter_service.kafka;


import com.example.newsletter_service.dto.NewsletterPublishedEvent;
import com.example.newsletter_service.services.KafkaConsumerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Gestionnaire de listeners Kafka dynamiques
 * Crée et gère des consumer groups à la volée basés sur les combinaisons de catégories
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class KafkaDynamicListenerManager {
    
    private final ConcurrentKafkaListenerContainerFactory<String, NewsletterPublishedEvent> 
            kafkaListenerContainerFactory;
    private final KafkaConsumerService kafkaConsumerService;
    
    // Cache des containers actifs : groupId -> Container
    private final Map<String, ConcurrentMessageListenerContainer<String, NewsletterPublishedEvent>> 
            activeContainers = new ConcurrentHashMap<>();
    
    /**
     * Crée ou récupère un listener pour un consumer group donné
     * @param groupId Identifiant du consumer group (ex: "group_tech_sports")
     * @param topics Liste des topics à écouter (ex: ["newsletter-tech", "newsletter-sports"])
     */
    public synchronized void createOrGetListener(String groupId, String[] topics) {
        
        // Vérifier si le container existe déjà
        if (activeContainers.containsKey(groupId)) {
            log.info("Consumer group '{}' existe déjà", groupId);
            return;
        }
        
        log.info(" Création d'un nouveau consumer group: {}", groupId);
        log.info(" Topics à écouter: {}", String.join(", ", topics));
        
        // Créer le container
        ConcurrentMessageListenerContainer<String, NewsletterPublishedEvent> container = 
                kafkaListenerContainerFactory.createContainer(topics);
        
        // Définir le group ID
        container.getContainerProperties().setGroupId(groupId);
        
        // Définir le message listener
        container.setupMessageListener((MessageListener<String, NewsletterPublishedEvent>) record -> {
            // Wrapper pour ajouter l'acknowledgment
            Acknowledgment ack = () -> {
                // Acknowledgment géré par le container
            };
            
            kafkaConsumerService.consumeNewsletterEvent(record, ack);
        });
        
        // Démarrer le container
        container.start();
        
        // Sauvegarder dans le cache
        activeContainers.put(groupId, container);
        
        log.info(" Consumer group '{}' créé et démarré avec succès", groupId);
    }
    
    /**
     * Arrête un consumer group spécifique
     */
    public synchronized void stopListener(String groupId) {
        ConcurrentMessageListenerContainer<String, NewsletterPublishedEvent> container = 
                activeContainers.remove(groupId);
        
        if (container != null) {
            container.stop();
            log.info(" Consumer group '{}' arrêté", groupId);
        }
    }
    
    /**
     * Arrête tous les listeners (appelé au shutdown de l'application)
     */
    public void stopAllListeners() {
        log.info(" Arrêt de tous les consumer groups...");
        activeContainers.forEach((groupId, container) -> {
            container.stop();
            log.info("  - Consumer group '{}' arrêté", groupId);
        });
        activeContainers.clear();
    }
    
    /**
     * Retourne la liste des consumer groups actifs
     */
    public Map<String, ConcurrentMessageListenerContainer<String, NewsletterPublishedEvent>> 
            getActiveContainers() {
        return activeContainers;
    }
}
