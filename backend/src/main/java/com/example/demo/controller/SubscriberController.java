package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.AddSubscriberRequest;
import com.example.demo.model.Plan;
import com.example.demo.model.Recharge;
import com.example.demo.model.Subscriber;
import com.example.demo.repository.PlanRepository;
import com.example.demo.repository.RechargeRepository;
import com.example.demo.repository.SubscriberRepository;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/subscribers")
@CrossOrigin(origins = "http://localhost:4200")
public class SubscriberController {
	@Autowired
	private SubscriberRepository subscriberRepository;

	@Autowired
	private PlanRepository planRepository;

	@Autowired
	private RechargeRepository rechargeRepository;

	@GetMapping("/all")
	public ResponseEntity<List<Subscriber>> getAllSubscribers() {
		List<Subscriber> subscribers = subscriberRepository.findAll();
		return new ResponseEntity<>(subscribers, HttpStatus.OK);
	}

	@GetMapping("/count") // New endpoint to get the count of subscribers
	public ResponseEntity<Long> getSubscribersCount() {
		long count = subscriberRepository.count();
		return ResponseEntity.ok(count);
	}

	@PostMapping
	public ResponseEntity<Subscriber> addSubscriber(@Valid @RequestBody AddSubscriberRequest addSubscriberRequest) {
		if (subscriberRepository.findByMobileNumber(addSubscriberRequest.getMobileNumber()) != null) {
			return new ResponseEntity<>(HttpStatus.CONFLICT); // Mobile number already exists
		}

		Plan currentPlan = planRepository.findById(addSubscriberRequest.getCurrentPlanId()).orElse(null);

		if (currentPlan == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Invalid plan ID
		}

		Subscriber subscriber = new Subscriber();
		subscriber.setMobileNumber(addSubscriberRequest.getMobileNumber());
		subscriber.setName(addSubscriberRequest.getName());
		subscriber.setEmail(addSubscriberRequest.getEmail());
		subscriber.setCurrentPlan(currentPlan); // Set the currentPlan object
		subscriber.setCreatedAt(LocalDate.now()); // Set the creation date

		// Set initial data usage and total data (you might adjust this logic)
		subscriber.setDataUsed(0.0);
		subscriber.setDataTotal(currentPlan.getDataPerDay() != null
				? Double.parseDouble(currentPlan.getDataPerDay().replace("GB/day", ""))
				: 0.0); // Basic parsing

		// Calculate plan expiry based on validity days
		if (currentPlan.getValidityDays() != null) {
			subscriber.setPlanExpiry(LocalDate.now().plusDays(currentPlan.getValidityDays()));
		}

		Subscriber savedSubscriber = subscriberRepository.save(subscriber);
		return new ResponseEntity<>(savedSubscriber, HttpStatus.CREATED);
	}

	@GetMapping("/expiring")
	public ResponseEntity<List<Subscriber>> getExpiringSubscribers() {
		return ResponseEntity.ok(subscriberRepository.findExpiringSubscribers());
	}

	@GetMapping("/{mobileNumber}/history")
	public ResponseEntity<List<Recharge>> getRechargeHistory(@PathVariable String mobileNumber) {
		if (!mobileNumber.matches("^[0-9]{10}$")) {
			return ResponseEntity.badRequest().body(null);
		}
		return ResponseEntity.ok(rechargeRepository.findByMobileNumber(mobileNumber));
	}
}