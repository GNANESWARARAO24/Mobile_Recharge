package com.example.demo.controller;

import com.example.demo.dto.AdminLoginRequest;
import com.example.demo.dto.MobileValidationRequest;
import com.example.demo.dto.AdminRegisterRequest;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
	@Autowired
	private AuthService authService;

	@PostMapping("/admin/login")
	public ResponseEntity<?> adminLogin(@RequestBody AdminLoginRequest request) {
		try {
			return ResponseEntity.ok(authService.adminLogin(request));
		} catch (RuntimeException e) {
			if (e.getMessage().contains("Too many requests")) {
				return ResponseEntity.status(429).body(e.getMessage());
			}
			if (e.getMessage().contains("Invalid credentials")) {
				return ResponseEntity.status(401).body(e.getMessage());
			}
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/admin/register")
	public ResponseEntity<?> registerAdmin(@RequestBody AdminRegisterRequest request) {
		try {
			return ResponseEntity.ok(authService.registerAdmin(request));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/validate-mobile")
	public ResponseEntity<?> validateMobile(@RequestBody MobileValidationRequest request) {
		try {
			return ResponseEntity.ok(authService.validateMobile(request.getMobileNumber()));
		} catch (RuntimeException e) {
			if (e.getMessage().contains("not found")) {
				return ResponseEntity.status(404).body(e.getMessage());
			}
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}