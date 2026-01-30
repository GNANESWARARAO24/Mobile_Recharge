package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Subscriber;
import com.example.demo.repository.SubscriberRepository;
import com.example.demo.service.DataConsumptionService;

@RestController
@RequestMapping("/api/admin/data-usage")
@CrossOrigin(origins = "http://localhost:4200")
public class DataUsageController {

	@Autowired
	private SubscriberRepository subscriberRepository;

	@Autowired
	private DataConsumptionService dataConsumptionService;

	@PutMapping("/{mobileNumber}")
	public ResponseEntity<?> updateDataUsage(@PathVariable String mobileNumber, @RequestParam Double dataUsed) {
		if (!mobileNumber.matches("^[0-9]{10}$")) {
			return ResponseEntity.badRequest().body("Invalid mobile number");
		}

		Subscriber subscriber = subscriberRepository.findByMobileNumber(mobileNumber);
		if (subscriber == null) {
			return ResponseEntity.status(404).body("Subscriber not found");
		}

		if (dataUsed < 0 || dataUsed > subscriber.getDataTotal()) {
			return ResponseEntity.badRequest().body("Invalid data usage value");
		}

		subscriber.setDataUsed(dataUsed);
		subscriberRepository.save(subscriber);

		return ResponseEntity.ok(subscriber);
	}

	@PostMapping("/simulate-daily")
	public ResponseEntity<?> simulateDailyConsumption() {
		dataConsumptionService.consumeDailyDataManually();
		return ResponseEntity.ok("Daily data consumption simulated for all subscribers");
	}
}
