package com.education_service.apiKeygateway.config;

import liquibase.integration.spring.SpringLiquibase;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseDataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class CentralLiquibaseConfig {

    @Value("${spring.application.datasource.username}")
    private String username;
    @Value("${spring.application.datasource.password}")
    private String password;

    // --- GATEWAY ---
    @Value("${spring.gateway.liquibase.url}")
    private String gatewayUrl;

    @Bean
    public DataSource gatewayLiquibaseDataSource() {
        System.out.println("DEBUG: Gateway Liquibase URL = " + gatewayUrl);
        return DataSourceBuilder.create()
                .url(gatewayUrl)
                .username(username)
                .password(password)
                .build();
    }

    @Bean
    @DependsOn("gatewayLiquibaseDataSource")
    public SpringLiquibase gatewayLiquibase(@Qualifier("gatewayLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/gateway/db.changelog-master.yaml");
        liquibase.setDefaultSchema("public");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    // --- EDUCATION ---
    @Value("${spring.education.liquibase.url}")
    private String educationUrl;

    @Bean
    public DataSource educationLiquibaseDataSource() {
        System.out.println("DEBUG: Education Liquibase URL = " + educationUrl);
        return DataSourceBuilder.create()
                .url(educationUrl)
                .username(username)
                .password(password)
                .build();
    }

    @Bean
    @DependsOn("educationLiquibaseDataSource")
    public SpringLiquibase educationLiquibase(@Qualifier("educationLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/education/db.changelog-master.yaml");
        liquibase.setDefaultSchema("public");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    // --- NEWSLETTER ---
    @Value("${spring.newsletter.liquibase.url}")
    private String newsletterUrl;
    @Value("${spring.newsletter.liquibase.change-log}")
    private String newsletterChangelog;

    @Bean
    public DataSource newsletterLiquibaseDataSource() {
        System.out.println("DEBUG: Newsletter Liquibase URL = " + newsletterUrl);
        return DataSourceBuilder.create()
                .url(newsletterUrl)
                .username(username)
                .password(password)
                .build();
    }

    @Bean
    @DependsOn("newsletterLiquibaseDataSource")
    public SpringLiquibase newsletterLiquibase(@Qualifier("newsletterLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog(newsletterChangelog);
        liquibase.setDefaultSchema("public");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    // --- RATINGS ---
    @Value("${spring.ratings.liquibase.url}")
    private String ratingsUrl;

    @Bean
    public DataSource ratingsLiquibaseDataSource() {
        System.out.println("DEBUG: Ratings Liquibase URL = " + ratingsUrl);
        return DataSourceBuilder.create()
                .url(ratingsUrl)
                .username(username)
                .password(password)
                .build();
    }

    @Bean
    @DependsOn("ratingsLiquibaseDataSource")
    public SpringLiquibase ratingsLiquibase(@Qualifier("ratingsLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/ratings/db.changelog-main.yaml");
        liquibase.setDefaultSchema("public");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    // ======FORUM===========//
    @Value("${spring.forum.liquibase.url}")
    private String forumUrl;

    @Bean
    public DataSource forumLiquibaseDataSource() {
        System.out.println("DEBUG: Forum Liquibase URL = " + forumUrl);
        return DataSourceBuilder.create()
                .url(forumUrl)
                .username(username)
                .password(password)
                .build();
    }

    @Bean
    @DependsOn("forumLiquibaseDataSource")
    public SpringLiquibase forumLiquibase(@Qualifier("forumLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/forum/db.changelog-master.yaml");
        liquibase.setDefaultSchema("public");
        liquibase.setShouldRun(true);
        return liquibase;
    }
}
