package com.tiendaya.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "API TiendaYA funcionando correctamente";
    }

    @GetMapping("/db-test")
    public String dbTest() {
        return "Spring Boot está corriendo. Falta probar conexión con PostgreSQL.";
    }
}