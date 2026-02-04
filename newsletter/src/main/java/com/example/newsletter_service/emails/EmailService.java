package com.example.newsletter_service.emails;

import com.example.newsletter_service.models.Lecteur;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final EmailSender emailSender;
    private final EmailProperties emailProperties;

    /**
     * Envoie un email HTML contenant une newsletter à un lecteur
     * 
     * @param lecteur     Le destinataire
     * @param titre       Titre de la newsletter
     * @param contenuHtml Contenu HTML de la newsletter
     * @return Mono<Void> indiquant la complétion
     */
    public Mono<Void> sendNewsletterEmail(Lecteur lecteur, String titre, String contenuHtml) {
        String emailContent = buildEmailContent(lecteur, titre, contenuHtml);
        return emailSender.sendHtmlEmail(
                lecteur.getEmail().toString(),
                titre,
                emailContent,
                emailProperties.getDefaultFrom())
                .doOnSuccess(v -> log.info("📧 Email envoyé avec succès à {}", lecteur.getPrenom()))
                .doOnError(e -> log.error("❌ Erreur lors de l'envoi de l'email à {}: {}",
                        lecteur.getPrenom(), e.getMessage()));
    }

    /**
     * Construit le contenu HTML complet de l'email
     */
    private String buildEmailContent(Lecteur lecteur, String titre, String contenuHtml) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; }
                        .footer { background: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>%s</h1>
                    </div>
                    <div class="content">
                        <p>Bonjour %s,</p>
                        %s
                    </div>
                    <div class="footer">
                        <p>Vous recevez cet email car vous êtes abonné à nos newsletters.</p>
                        <p><a href="#">Se désabonner</a></p>
                    </div>
                </body>
                </html>
                """.formatted(titre, lecteur.getPrenom(), contenuHtml);
    }

    /**
     * Envoie un email de bienvenue lors de l'inscription
     */
    public Mono<Void> sendWelcomeEmail(String email, String prenom) {
        String content = buildWelcomeContent(prenom);
        return emailSender.sendHtmlEmail(
                email,
                "Bienvenue sur notre plateforme de newsletters",
                content,
                emailProperties.getDefaultFrom()).doOnSuccess(v -> log.info("📧 Email de bienvenue envoyé à {}", email))
                .doOnError(e -> log.error("❌ Erreur lors de l'envoi de l'email de bienvenue: {}", e.getMessage()));
    }

    private String buildWelcomeContent(String prenom) {
        return """
                <h2>Bienvenue %s !</h2>
                <p>Merci de vous être inscrit à notre service de newsletters.</p>
                <p>Vous recevrez désormais les newsletters des catégories que vous avez sélectionnées.</p>
                """.formatted(prenom);
    }
}