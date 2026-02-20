package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.AddSubscriberRequest;
import com.example.demo.model.Recharge;
import com.example.demo.model.Subscriber;
import com.example.demo.service.SubscriberService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subscribers")
@CrossOrigin(origins = "http://localhost:4200")
public class SubscriberController {
	@Autowired
	private SubscriberService subscriberService;

	@GetMapping("/all")
	public ResponseEntity<List<Subscriber>> getAllSubscribers() {
		return ResponseEntity.ok(subscriberService.getAllSubscribers());
	}

	@GetMapping("/count")
	public ResponseEntity<Long> getSubscribersCount() {
		return ResponseEntity.ok(subscriberService.getSubscribersCount());
	}

	@PostMapping
	public ResponseEntity<?> addSubscriber(@Valid @RequestBody AddSubscriberRequest request) {
		try {
			return ResponseEntity.status(HttpStatus.CREATED).body(subscriberService.addSubscriber(request));
		} catch (RuntimeException e) {
			if (e.getMessage().contains("already exists")) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
			}
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/expiring")
	public ResponseEntity<List<Subscriber>> getExpiringSubscribers() {
		return ResponseEntity.ok(subscriberService.getExpiringSubscribers());
	}

	@GetMapping("/{mobileNumber}/history")
	public ResponseEntity<?> getRechargeHistory(
			@PathVariable String mobileNumber,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate,
			@RequestParam(defaultValue = "rechargeDate") String sortBy,
			@RequestParam(defaultValue = "desc") String sortOrder) {
		try {
			return ResponseEntity.ok(subscriberService.getRechargeHistory(mobileNumber, startDate, endDate, sortOrder));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}