package com.education_service.apiKeygateway.config;

import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.spi.ConnectionFactoryOptions;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@Configuration
public class CentralR2dbcConfig {

    // deleted static fields and setters

    // GATEWAY CONFIGURATION

    @Configuration
    @EnableR2dbcRepositories(basePackages = "com.education_service.apiKeygateway.repository", entityOperationsRef = "gatewayEntityTemplate")
    public static class GatewayRepositoriesConfig {
        @Value("${spring.gateway.r2dbc.url}")
        private String url;
        @Value("${spring.application.datasource.username}")
        private String username;
        @Value("${spring.application.datasource.password}")
        private String password;

        @Bean
        @Primary
        public ConnectionFactory gatewayConnectionFactory() {
            ConnectionFactoryOptions options = ConnectionFactoryOptions.parse(url)
                    .mutate()
                    .option(ConnectionFactoryOptions.USER, username)
                    .option(ConnectionFactoryOptions.PASSWORD, password)
                    .build();
            return ConnectionFactories.get(options);
        }

        @Bean
        @Primary
        @DependsOn("gatewayConnectionFactory")
        public R2dbcEntityTemplate gatewayEntityTemplate(@Qualifier("gatewayConnectionFactory") ConnectionFactory cf) {
            return new R2dbcEntityTemplate(cf);
        }
    }

    // EDUCATION CONFIGURATION

    @Configuration
    @EnableR2dbcRepositories(basePackages = "com.letsgo.education_service.repository", entityOperationsRef = "educationEntityTemplate")
    public static class EducationRepositoriesConfig {
        @Value("${spring.education.datasource.url}")
        private String url;
        @Value("${spring.application.datasource.username}")
        private String username;
        @Value("${spring.application.datasource.password}")
        private String password;

        @Bean
        public ConnectionFactory educationConnectionFactory() {
            ConnectionFactoryOptions options = ConnectionFactoryOptions.parse(url)
                    .mutate()
                    .option(ConnectionFactoryOptions.USER, username)
                    .option(ConnectionFactoryOptions.PASSWORD, password)
                    .build();
            return ConnectionFactories.get(options);
        }

        @Bean
        @DependsOn("educationConnectionFactory")
        public R2dbcEntityTemplate educationEntityTemplate(
                @Qualifier("educationConnectionFactory") ConnectionFactory cf) {
            return new R2dbcEntityTemplate(cf);
        }
    }

    // NEWSLETTER CONFIGURATION

    @Configuration
    @EnableR2dbcRepositories(basePackages = "com.example.newsletter_service.repositories", entityOperationsRef = "newsletterEntityTemplate")
    public static class NewsletterRepositoriesConfig {
        @Value("${spring.newsletter.datasource.url}")
        private String url;
        @Value("${spring.application.datasource.username}")
        private String username;
        @Value("${spring.application.datasource.password}")
        private String password;

        @Bean
        public ConnectionFactory newsletterConnectionFactory() {
            ConnectionFactoryOptions options = ConnectionFactoryOptions.parse(url)
                    .mutate()
                    .option(ConnectionFactoryOptions.USER, username)
                    .option(ConnectionFactoryOptions.PASSWORD, password)
                    .build();
            return ConnectionFactories.get(options);
        }

        @Bean
        @DependsOn("newsletterConnectionFactory")
        public R2dbcEntityTemplate newsletterEntityTemplate(
                @Qualifier("newsletterConnectionFactory") ConnectionFactory cf) {
            return new R2dbcEntityTemplate(cf);
        }
    }

    // 4. RATINGS CONFIGURATION

    @Configuration
    @EnableR2dbcRepositories(basePackages = "com.example.user_interactive_service.repository", entityOperationsRef = "ratingsEntityTemplate")
    public static class RatingsRepositoriesConfig {
        @Value("${spring.ratings.datasource.url}")
        private String url;
        @Value("${spring.application.datasource.username}")
        private String username;
        @Value("${spring.application.datasource.password}")
        private String password;

        @Bean
        public ConnectionFactory ratingsConnectionFactory() {
            ConnectionFactoryOptions options = ConnectionFactoryOptions.parse(url)
                    .mutate()
                    .option(ConnectionFactoryOptions.USER, username)
                    .option(ConnectionFactoryOptions.PASSWORD, password)
                    .build();
            return ConnectionFactories.get(options);
        }

        @Bean
        @DependsOn("ratingsConnectionFactory")
        public R2dbcEntityTemplate ratingsEntityTemplate(@Qualifier("ratingsConnectionFactory") ConnectionFactory cf) {
            return new R2dbcEntityTemplate(cf);
        }
    }

    // 4. FORUM CONFIGURATION
    @Configuration
    @EnableR2dbcRepositories(basePackages = "com.forum", entityOperationsRef = "forumEntityTemplate")
    public static class ForumRepositoriesConfig {
        @Value("${spring.forum.datasource.url}")
        private String url;
        @Value("${spring.application.datasource.username}")
        private String username;
        @Value("${spring.application.datasource.password}")
        private String password;

        @Bean
        public ConnectionFactory forumConnectionFactory() {
            ConnectionFactoryOptions options = ConnectionFactoryOptions.parse(url)
                    .mutate()
                    .option(ConnectionFactoryOptions.USER, username)
                    .option(ConnectionFactoryOptions.PASSWORD, password)
                    .build();
            return ConnectionFactories.get(options);
        }

        @Bean
        @DependsOn("forumConnectionFactory")
        public R2dbcEntityTemplate forumEntityTemplate(@Qualifier("forumConnectionFactory") ConnectionFactory cf) {
            return new R2dbcEntityTemplate(cf);
        }
    }
}
