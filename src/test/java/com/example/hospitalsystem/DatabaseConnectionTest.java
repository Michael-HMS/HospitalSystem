package com.example.hospitalsystem;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verifies MySQL connectivity using {@code spring.datasource.*} from
 * {@code application.properties} (or an active Spring profile).
 */
@SpringBootTest
class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void connectsUsingConfiguredDataSource() throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            assertTrue(
                    connection.isValid(10),
                    "MySQL connection should be valid within 10 seconds");
        }
    }
}
