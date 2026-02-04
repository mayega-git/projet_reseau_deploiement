package com.example.newsletter_service.emails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

/**
 * Service d'envoi d'emails
 * Utilise EmailSender pour l'envoi d'emails de manière réactive
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService1 {

    private final EmailSender emailSender;
    private final EmailProperties emailProperties;

    /**
     * Envoyer un email d'approbation
     */
    public Mono<Void> sendApprovalEmail(String email, String nom, String prenom) {
        log.info("📧 Envoi email d'approbation à: {}", email);

        String subject = "Votre inscription a été approuvée ! 🎉";
        String htmlContent = buildApprovalEmailHtml(nom, prenom, email);

        return emailSender.sendHtmlEmail(email, subject, htmlContent, emailProperties.getDefaultFrom())
                .doOnSuccess(v -> log.info("✅ Email d'approbation envoyé avec succès à: {}", email))
                .doOnError(e -> log.error("❌ Erreur lors de l'envoi de l'email d'approbation à {}: {}",
                        email, e.getMessage()));
    }

    /**
     * Envoyer un email de rejet
     */
    public Mono<Void> sendRejectionEmail(String email, String nom, String prenom, String reason) {
        log.info("📧 Envoi email de rejet à: {}", email);

        String subject = "Votre demande d'inscription";
        String htmlContent = buildRejectionEmailHtml(nom, prenom, reason);

        return emailSender.sendHtmlEmail(email, subject, htmlContent, emailProperties.getDefaultFrom())
                .doOnSuccess(v -> log.info("✅ Email de rejet envoyé avec succès à: {}", email))
                .doOnError(e -> log.error("❌ Erreur lors de l'envoi de l'email de rejet à {}: {}",
                        email, e.getMessage()));
    }

    /**
     * Construire le corps HTML de l'email d'approbation
     */
    private String buildApprovalEmailHtml(String nom, String prenom, String email) {
        return String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Bonjour %s %s,</h2>
                <p>Nous avons le plaisir de vous informer que votre demande d'inscription
                en tant que rédacteur a été <strong>approuvée</strong> ! 🎉</p>
                <p>Vous pouvez maintenant vous connecter à votre compte avec l'email: <strong>%s</strong></p>
                <p>Bienvenue dans notre équipe de rédaction !</p>
                <br>
                <p>Cordialement,<br>L'équipe Newsletter</p>
                </body>
                </html>
                """, prenom, nom, email);
    }

    /**
     * Construire le corps HTML de l'email de rejet
     */
    private String buildRejectionEmailHtml(String nom, String prenom, String reason) {
        StringBuilder body = new StringBuilder();
        body.append("<html><body style=\"font-family: Arial, sans-serif; line-height: 1.6;\">");
        body.append(String.format("<h2>Bonjour %s %s,</h2>", prenom, nom));
        body.append("<p>Nous vous remercions de l'intérêt que vous portez à notre plateforme.</p>");
        body.append("<p>Malheureusement, nous ne pouvons pas donner suite à votre demande ");
        body.append("d'inscription pour le moment.</p>");

        if (reason != null && !reason.trim().isEmpty()) {
            body.append("<p><strong>Raison:</strong> ").append(reason).append("</p>");
        }

        body.append("<p>N'hésitez pas à nous contacter si vous avez des questions.</p>");
        body.append("<br><p>Cordialement,<br>L'équipe Newsletter</p>");
        body.append("</body></html>");

        return body.toString();
    }
}