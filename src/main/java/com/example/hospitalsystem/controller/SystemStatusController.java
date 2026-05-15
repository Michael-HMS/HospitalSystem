package com.example.hospitalsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller responsible for testing system integrations, like the Database.
 * Emulates the logic from DatabaseConnectionTest.java but exposes it as a web
 * route!
 */
@RestController
@RequestMapping("/api/system")
public class SystemStatusController {

    @Autowired
    private DataSource dataSource;

    /**
     * Replicates the goal of DatabaseConnectionTest.java.
     * Route: GET /api/system/db-test
     */
    @GetMapping("/db-test")
    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();

        try (Connection connection = dataSource.getConnection()) {
            // Equivalent to connection.isValid(10) in JUnit tests
            boolean isValid = connection.isValid(10);

            response.put("status", isValid ? "Connected" : "Disconnected");
            response.put("message",
                    isValid ? "Database connection is active and valid." : "Database connection is invalid.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "Error");
            response.put("message", "Failed to connect: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
