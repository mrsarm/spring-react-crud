package ar.com.mrdev.app.dao;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "ar.com.mrdev.app",
 	                   repositoryBaseClass = BasePagingAndSortingRepositoryImpl.class)
public class DatabaseConfiguration {
}
