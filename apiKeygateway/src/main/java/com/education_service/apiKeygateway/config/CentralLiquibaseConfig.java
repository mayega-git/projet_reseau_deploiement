package com.education_service.apiKeygateway.config;

import liquibase.integration.spring.SpringLiquibase;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
public class CentralLiquibaseConfig {

    @Value("${spring.datasource.url}")
    private String jdbcUrl;
    @Value("${spring.datasource.username}")
    private String username;
    @Value("${spring.datasource.password}")
    private String password;

    private DataSource createDataSource() {
        return DataSourceBuilder.create()
                .url(jdbcUrl)
                .username(username)
                .password(password)
                .build();
    }

    private void createSchemaIfNotExists(DataSource ds, String schemaName) {
        try (Connection conn = ds.getConnection();
                Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE SCHEMA IF NOT EXISTS " + schemaName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create schema: " + schemaName, e);
        }
    }

    @Bean
    public DataSource gatewayLiquibaseDataSource() {
        DataSource ds = createDataSource();
        createSchemaIfNotExists(ds, "gateway");
        return ds;
    }

    @Bean
    @DependsOn("gatewayLiquibaseDataSource")
    public SpringLiquibase gatewayLiquibase(@Qualifier("gatewayLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/gateway/db.changelog-master.yaml");
        liquibase.setDefaultSchema("gateway");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    @Bean
    public DataSource educationLiquibaseDataSource() {
        DataSource ds = createDataSource();
        createSchemaIfNotExists(ds, "education");
        return ds;
    }

    @Bean
    @DependsOn("educationLiquibaseDataSource")
    public SpringLiquibase educationLiquibase(@Qualifier("educationLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/education/db.changelog-master.yaml");
        liquibase.setDefaultSchema("education");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    @Bean
    public DataSource newsletterLiquibaseDataSource() {
        DataSource ds = createDataSource();
        createSchemaIfNotExists(ds, "newsletter");
        return ds;
    }

    @Bean
    @DependsOn("newsletterLiquibaseDataSource")
    public SpringLiquibase newsletterLiquibase(@Qualifier("newsletterLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/newsletter/db.changelog-main3.yaml");
        liquibase.setDefaultSchema("newsletter");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    @Bean
    public DataSource ratingsLiquibaseDataSource() {
        DataSource ds = createDataSource();
        createSchemaIfNotExists(ds, "ratings");
        return ds;
    }

    @Bean
    @DependsOn("ratingsLiquibaseDataSource")
    public SpringLiquibase ratingsLiquibase(@Qualifier("ratingsLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/ratings/db.changelog-master.yaml");
        liquibase.setDefaultSchema("ratings");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    @Bean
    public DataSource forumLiquibaseDataSource() {
        DataSource ds = createDataSource();
        createSchemaIfNotExists(ds, "forum");
        return ds;
    }

    @Bean
    @DependsOn("forumLiquibaseDataSource")
    public SpringLiquibase forumLiquibase(@Qualifier("forumLiquibaseDataSource") DataSource ds) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(ds);
        liquibase.setChangeLog("classpath:db/changelog/forum/db.changelog-master.yaml");
        liquibase.setDefaultSchema("forum");
        liquibase.setShouldRun(true);
        return liquibase;
    }
}
