package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.RechargeRequest;
import com.example.demo.model.Plan;
import com.example.demo.model.Recharge;
import com.example.demo.service.RechargeService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class RechargeController {
	@Autowired
	private RechargeService rechargeService;

	@GetMapping("/plans")
	public ResponseEntity<List<Plan>> getPlans() {
		return ResponseEntity.ok(rechargeService.getAllPlans());
	}

	@PostMapping("/recharge")
	public ResponseEntity<?> recharge(@RequestBody RechargeRequest request) {
		try {
			return ResponseEntity.ok(rechargeService.processRecharge(request));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/recharge-history/{mobileNumber}")
	public ResponseEntity<List<Recharge>> getUserRechargeHistory(@PathVariable String mobileNumber) {
		return ResponseEntity.ok(rechargeService.getRechargeHistory(mobileNumber));
	}
}