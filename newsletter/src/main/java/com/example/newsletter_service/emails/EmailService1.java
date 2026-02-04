package com.example.newsletter_service.emails;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

/**
 * Service d'envoi d'emails
 * Utilise JavaMailSender pour l'envoi d'emails de manière réactive
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService1 {
    
    private final JavaMailSender mailSender;

private static final String FROM_EMAIL = "noreply@newsletter.com";
    
    /**
     * Envoyer un email d'approbation
     */
    public Mono<Void> sendApprovalEmail(String email, String nom, String prenom) {
        log.info("📧 Envoi email d'approbation à: {}", email);
        
        return Mono.fromRunnable(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(FROM_EMAIL);
                message.setTo(email);
                message.setSubject("Votre inscription a été approuvée ! 🎉");
                message.setText(buildApprovalEmailBody(nom, prenom, email));
                
                mailSender.send(message);
                
                log.info("✅ Email d'approbation envoyé avec succès à: {}", email);
            } catch (Exception e) {
                log.error("❌ Erreur lors de l'envoi de l'email d'approbation à {}: {}", 
                    email, e.getMessage());
                throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
            }
        })
        .subscribeOn(Schedulers.boundedElastic())
        .then();
    }
    
    /**
     * Envoyer un email de rejet
     */
    public Mono<Void> sendRejectionEmail(String email, String nom, String prenom, String reason) {
        log.info("📧 Envoi email de rejet à: {}", email);
        
        return Mono.fromRunnable(() -> {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(FROM_EMAIL);
                message.setTo(email);
                message.setSubject("Votre demande d'inscription");
                message.setText(buildRejectionEmailBody(nom, prenom, reason));
                
                mailSender.send(message);
                
                log.info("✅ Email de rejet envoyé avec succès à: {}", email);
            } catch (Exception e) {
                log.error("❌ Erreur lors de l'envoi de l'email de rejet à {}: {}", 
                    email, e.getMessage());
                throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
            }
        })
        .subscribeOn(Schedulers.boundedElastic())
        .then();
    }
    
    /**
     * Construire le corps de l'email d'approbation
     */
    private String buildApprovalEmailBody(String nom, String prenom, String email) {
        return String.format(
            "Bonjour %s %s,\n\n" +
            "Nous avons le plaisir de vous informer que votre demande d'inscription " +
            "en tant que rédacteur a été approuvée !\n\n" +
            "Vous pouvez maintenant vous connecter à votre compte avec l'email: %s\n\n" +
            "Bienvenue dans notre équipe de rédaction !\n\n" +
            "Cordialement,\n" +
            "L'équipe Newsletter",
            prenom,
            nom,
            email
        );
    }
    
    /**
     * Construire le corps de l'email de rejet
     */
    private String buildRejectionEmailBody(String nom, String prenom, String reason) {
        StringBuilder body = new StringBuilder();
        body.append(String.format("Bonjour %s %s,\n\n", prenom, nom));
        body.append("Nous vous remercions de l'intérêt que vous portez à notre plateforme.\n\n");
        body.append("Malheureusement, nous ne pouvons pas donner suite à votre demande ");
        body.append("d'inscription pour le moment.\n\n");
        
        if (reason != null && !reason.trim().isEmpty()) {
            body.append("Raison: ").append(reason).append("\n\n");
        }
        
        body.append("N'hésitez pas à nous contacter si vous avez des questions.\n\n");
        body.append("Cordialement,\n");
        body.append("L'équipe Newsletter");
        
        return body.toString();
    }
 }