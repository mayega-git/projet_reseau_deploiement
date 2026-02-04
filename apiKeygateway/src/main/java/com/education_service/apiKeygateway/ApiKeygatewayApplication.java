package com.education_service.apiKeygateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = {
		"com.education_service.apiKeygateway",
		"com.example.newsletter_service",
		"com.letsgo.education_service",
		"com.example.user_interactive_service",
		"com.forum"
},

		exclude = {
				org.springframework.boot.autoconfigure.liquibase.LiquibaseAutoConfiguration.class,
				org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration.class

		})

@EnableKafka
@EnableAsync
@EnableScheduling
public class ApiKeygatewayApplication {

	public static void main(String[] args) {
		System.setProperty("liquibase.duplicateFileMode", "WARN");
		SpringApplication.run(ApiKeygatewayApplication.class, args);
		System.out.println("✅ Monolithe Education Service démarré avec succès !");
	}
}
