package com.example.hospitalsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller responsible for routing standard web pages in the application.
 * This is the 'C' (Controller) in the MVC architecture, managing the views
 * ('V').
 */
@Controller
public class WebController {

    /**
     * Connects the homepage routes to the static index.html file.
     * Accessible via /, /homepage, or /home.
     */
    @GetMapping({ "/", "/homepage", "/home" })
    public String homepage() {
        /*
         * Forwards the request to the index.html file located in
         * src/main/resources/static/
         */
        return "forward:/index.html";
    }

    // You can add more page routes here later!
    // Example:
    // @GetMapping("/dashboard")
    // public String dashboard() {
    // return "forward:/dashboard.html";
    // }
}
