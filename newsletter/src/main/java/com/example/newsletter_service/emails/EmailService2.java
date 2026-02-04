package com.example.newsletter_service.emails;



import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Slf4j
@Service
@RequiredArgsConstructor
public class  EmailService2 {

    private final JavaMailSender mailSender;

     public Mono<Void> envoyerEmail(String destinataire, String sujet, String contenu) {
        return Mono.fromCallable(() -> {
                    log.info("Tentative d'envoi d'email à : {}", destinataire);
                    
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                    
                    helper.setTo(destinataire);
                    helper.setSubject(sujet);
                    helper.setText(contenu, true);
                    
                    mailSender.send(message);
                    
                    log.info("Email envoyé avec succès à : {}", destinataire);
                    return null;
                })
                .subscribeOn(Schedulers.boundedElastic())
                .then()
                .doOnError(MessagingException.class, e -> 
                    log.error("Erreur lors de l'envoi de l'email à {} : {}", destinataire, e.getMessage(), e)
                )
                .doOnError(e -> !(e instanceof MessagingException), e ->
                    log.error("Erreur inattendue lors de l'envoi de l'email : {}", e.getMessage(), e)
                );
    }
}
