package com.letsgo.education_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;




//les classes de demarrage des modules ne doivent plus etre des points d'entrée

public class EducationServiceApplication {
	public static void main(String[] args) {

		SpringApplication.run(EducationServiceApplication.class, args);

		System.out.println("✅ Application Spring Boot démarrée avec succès !");

		
		

	}
}
