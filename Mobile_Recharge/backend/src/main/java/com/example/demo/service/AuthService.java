package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.config.RateLimiter;
import com.example.demo.dto.AdminLoginRequest;
import com.example.demo.dto.AdminLoginResponse;
import com.example.demo.dto.AdminRegisterRequest;
import com.example.demo.model.Admin;
import com.example.demo.model.Subscriber;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.SubscriberRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private SubscriberRepository subscriberRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private RateLimiter rateLimiter;

    @Autowired
    private ValidationService validationService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    public AdminLoginResponse adminLogin(AdminLoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            throw new RuntimeException("Username and password are required");
        }

        if (!rateLimiter.allowRequest(request.getUsername())) {
            throw new RuntimeException("Too many requests, please try again later");
        }

        Admin admin = adminRepository.findByUsername(request.getUsername());
        if (admin == null || !passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        Key key = Keys.hmacShaKeyFor(keyBytes);

        String token = Jwts.builder()
                .setSubject(admin.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact();

        return new AdminLoginResponse(token);
    }

    public String registerAdmin(AdminRegisterRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            throw new RuntimeException("Username and password are required");
        }

        if (adminRepository.findByUsername(request.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

        Admin admin = new Admin();
        admin.setUsername(request.getUsername());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        adminRepository.save(admin);

        return "Admin registered successfully";
    }

    public Subscriber validateMobile(String mobileNumber) {
        validationService.validateMobileNumber(mobileNumber);
        Subscriber subscriber = subscriberRepository.findByMobileNumber(mobileNumber);
        if (subscriber == null) {
            throw new RuntimeException("Mobile number not found");
        }
        return subscriber;
    }
}