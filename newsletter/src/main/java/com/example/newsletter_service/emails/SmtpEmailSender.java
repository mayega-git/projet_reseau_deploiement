package com.example.newsletter_service.emails;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

/**
 * Implémentation SMTP classique pour l'envoi d'emails.
 * Utilisé en développement local où SMTP est accessible.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.email.provider", havingValue = "smtp", matchIfMissing = false)
public class SmtpEmailSender implements EmailSender {

    private final JavaMailSender mailSender;
    private final EmailProperties emailProperties;

    @Override
    public Mono<Void> sendHtmlEmail(String to, String subject, String htmlContent, String from) {
        return Mono.fromCallable(() -> {
            log.info("📧 [SMTP] Envoi d'email à : {}", to);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(from != null ? from : emailProperties.getDefaultFrom());

            mailSender.send(message);

            log.info("✅ [SMTP] Email envoyé avec succès à {}", to);
            return null;
        })
                .subscribeOn(Schedulers.boundedElastic())
                .then()
                .doOnError(MessagingException.class,
                        e -> log.error("❌ [SMTP] Erreur d'envoi à {} : {}", to, e.getMessage(), e))
                .doOnError(e -> !(e instanceof MessagingException),
                        e -> log.error("❌ [SMTP] Erreur inattendue : {}", e.getMessage(), e));
    }
}
