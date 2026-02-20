package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.DataConsumptionService;
import com.example.demo.service.SubscriberService;

@RestController
@RequestMapping("/api/admin/data-usage")
@CrossOrigin(origins = "http://localhost:4200")
public class DataUsageController {

	@Autowired
	private SubscriberService subscriberService;

	@Autowired
	private DataConsumptionService dataConsumptionService;

	@PutMapping("/{mobileNumber}")
	public ResponseEntity<?> updateDataUsage(@PathVariable String mobileNumber, @RequestParam Double dataUsed) {
		try {
			return ResponseEntity.ok(subscriberService.updateDataUsage(mobileNumber, dataUsed));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/simulate-daily")
	public ResponseEntity<?> simulateDailyConsumption() {
		dataConsumptionService.consumeDailyDataManually();
		return ResponseEntity.ok("Daily data consumption simulated for all subscribers");
	}
}
