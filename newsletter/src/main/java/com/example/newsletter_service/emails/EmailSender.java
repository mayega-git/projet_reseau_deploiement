package com.example.newsletter_service.emails;

import reactor.core.publisher.Mono;

/**
 * Interface d'abstraction pour l'envoi d'emails.
 * Permet de basculer entre différentes implémentations (SMTP, Resend, etc.)
 */
public interface EmailSender {

    /**
     * Envoie un email HTML
     * 
     * @param to          Adresse email du destinataire
     * @param subject     Sujet de l'email
     * @param htmlContent Contenu HTML de l'email
     * @param from        Adresse email de l'expéditeur
     * @return Mono<Void> indiquant la complétion
     */
    Mono<Void> sendHtmlEmail(String to, String subject, String htmlContent, String from);
}
