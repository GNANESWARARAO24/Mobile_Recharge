package com.example.demo.controller;

import com.example.demo.dto.NewPlanRequest;
import com.example.demo.dto.UpdatePlanRequest;
import com.example.demo.model.Plan;
import com.example.demo.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/plans")
@CrossOrigin(origins = "http://localhost:4200")
public class PlanController {

	@Autowired
	private PlanService planService;

	@GetMapping
	public ResponseEntity<List<Plan>> getAllPlans() {
		return ResponseEntity.ok(planService.getAllPlans());
	}

	@GetMapping("/count")
	public ResponseEntity<Long> getPlanCount() {
		return ResponseEntity.ok(planService.getPlanCount());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Plan> getPlanById(@PathVariable Long id) {
		return planService.getPlanById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Plan> createPlan(@Valid @RequestBody NewPlanRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(planService.createPlan(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updatePlan(@PathVariable Long id, @Valid @RequestBody UpdatePlanRequest request) {
		try {
			return ResponseEntity.ok(planService.updatePlan(id, request));
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
		try {
			planService.deletePlan(id);
			return ResponseEntity.noContent().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}
}