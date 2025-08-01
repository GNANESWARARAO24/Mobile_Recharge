package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/")
    public String home() {
        return "Backend is running ✅";
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
