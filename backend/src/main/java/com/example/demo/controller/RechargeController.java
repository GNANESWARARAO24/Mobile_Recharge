package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.RechargeRequest;
import com.example.demo.dto.RechargeResponse;
import com.example.demo.model.Plan;
import com.example.demo.model.Recharge;
import com.example.demo.model.Subscriber;
import com.example.demo.repository.PlanRepository;
import com.example.demo.repository.RechargeRepository;
import com.example.demo.repository.SubscriberRepository;
import com.example.demo.service.EmailService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://frontend-production-4f97.up.railway.app")
public class RechargeController {
	@Autowired
	private PlanRepository planRepository;

	@Autowired
	private RechargeRepository rechargeRepository;

	@Autowired
	private SubscriberRepository subscriberRepository;

	@Autowired
	private EmailService emailService;

	@GetMapping("/plans")
	public ResponseEntity<List<Plan>> getPlans() {
		return ResponseEntity.ok(planRepository.findAll());
	}

	@PostMapping("/recharge")
	public ResponseEntity<?> recharge(@RequestBody RechargeRequest request) {
		if (request.getMobileNumber() == null || !request.getMobileNumber().matches("^[0-9]{10}$")) {
			return ResponseEntity.badRequest().body("Invalid mobile number");
		}
		if (request.getPlanId() == null) {
			return ResponseEntity.badRequest().body("Plan ID is required");
		}
		if (request.getPaymentMethod() == null) {
			return ResponseEntity.badRequest().body("Payment method is required");
		}
		if (request.getPaymentMethod().equals("UPI") && (request.getPaymentDetails() == null
				|| !request.getPaymentDetails().matches("^[a-zA-Z0-9]+@[a-zA-Z]+$"))) {
			return ResponseEntity.badRequest().body("Invalid UPI ID");
		}

		Subscriber subscriber = subscriberRepository.findByMobileNumber(request.getMobileNumber());
		if (subscriber == null) {
			return ResponseEntity.status(404).body("Subscriber not found");
		}

		Plan plan = planRepository.findById(request.getPlanId()).orElse(null);
		if (plan == null) {
			return ResponseEntity.badRequest().body("Invalid plan ID");
		}

		Recharge recharge = new Recharge();
		recharge.setMobileNumber(request.getMobileNumber());
		recharge.setPlan(plan);
		recharge.setAmount(plan.getPrice());
		recharge.setPaymentMethod(request.getPaymentMethod());
		recharge.setStatus("Success");
		recharge.setRechargeDate(LocalDateTime.now());
		rechargeRepository.save(recharge);

		// Update subscriber
		subscriber.setCurrentPlan(plan);
		subscriber.setPlanExpiry(LocalDate.now().plusDays(plan.getValidityDays()));
		subscriber.setDataUsed(0.0);
		subscriber.setDataTotal(Double.valueOf(plan.getDataPerDay().replace("GB/day", "")) * plan.getValidityDays());
		subscriberRepository.save(subscriber);

		// Send confirmation email
		String transactionId = UUID.randomUUID().toString();
		emailService.sendConfirmationEmail(subscriber.getEmail(), subscriber.getMobileNumber(), plan.getName(),
				plan.getPrice(), transactionId);

		return ResponseEntity.ok(new RechargeResponse(transactionId));
	}
}