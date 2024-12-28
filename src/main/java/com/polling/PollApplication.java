package com.polling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;

@SpringBootApplication
public class PollApplication {
	private static final Logger logger = LoggerFactory.getLogger(PollApplication.class);

	@Value("${spring.datasource.url}")
	private String dbUrl;

	public static void main(String[] args) {
		SpringApplication.run(PollApplication.class, args);
	}

	@PostConstruct
	public void logApplicationStartup() {
		logger.info("Application started");
		logger.info("Database URL: {}", dbUrl);
	}
}