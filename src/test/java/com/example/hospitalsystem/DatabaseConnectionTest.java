package com.example.hospitalsystem;

import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verifies JDBC connectivity using the same variables as {@code application-local.properties}.
 * Provide {@code DB_SERVICE_URI} (and optional {@code DB_USERNAME}, {@code DB_PASSWORD}) via
 * OS environment or Maven: {@code mvn test "-DDB_SERVICE_URI=jdbc:mysql://..."}.
 * Skips when {@code DB_SERVICE_URI} is unset.
 */
class DatabaseConnectionTest {

    private static String propOrEnv(String key) {
        String p = System.getProperty(key);
        if (p != null && !p.isBlank()) {
            return p;
        }
        String e = System.getenv(key);
        return e == null ? "" : e;
    }

    @Test
    void connectsToHospitalManagementSystemDatabase() throws Exception {
        String url = propOrEnv("DB_SERVICE_URI");
        Assumptions.assumeTrue(
                !url.isBlank(),
                "Set DB_SERVICE_URI (env or -D), must start with jdbc:mysql:// and include .../HospitalManagementSystem?...");

        Assumptions.assumeTrue(
                url.contains("/HospitalManagementSystem"),
                "DB_SERVICE_URI must use database HospitalManagementSystem in the path");

        String user = propOrEnv("DB_USERNAME");
        if (user.isBlank()) {
            user = "root";
        }
        String password = propOrEnv("DB_PASSWORD");

        try (Connection connection = DriverManager.getConnection(url, user, password)) {
            assertTrue(connection.isValid(10), "MySQL connection should be valid within 10 seconds");
        }
    }
}
