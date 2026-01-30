package com.example.demo.controller;

import com.example.demo.dto.NewPlanRequest;
import com.example.demo.dto.UpdatePlanRequest;
import com.example.demo.model.Plan;
import com.example.demo.repository.PlanRepository;
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
	private PlanRepository planRepository;

	@GetMapping
	public ResponseEntity<List<Plan>> getAllPlans() {
		return ResponseEntity.ok(planRepository.findAll());
	}

	@GetMapping("/count") // New endpoint to get the count of plans
	public ResponseEntity<Long> getPlanCount() {
		long count = planRepository.count();
		return ResponseEntity.ok(count);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Plan> getPlanById(@PathVariable Long id) {
		return planRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Plan> createPlan(@Valid @RequestBody NewPlanRequest newPlanRequest) {
		Plan plan = new Plan();
		plan.setName(newPlanRequest.getName());
		plan.setCategory(Plan.Category.valueOf(newPlanRequest.getCategory())); // Assuming you want to use the enum
		plan.setPrice(newPlanRequest.getPrice());
		plan.setDataPerDay(newPlanRequest.getDataPerDay());
		plan.setCalls(newPlanRequest.getCalls());
		plan.setSms(newPlanRequest.getSms());
		plan.setValidityDays(newPlanRequest.getValidityDays());

		Plan savedPlan = planRepository.save(plan);
		return new ResponseEntity<>(savedPlan, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Plan> updatePlan(@PathVariable Long id,
			@Valid @RequestBody UpdatePlanRequest updatePlanRequest) {
		return planRepository.findById(id).map(plan -> {
			plan.setName(updatePlanRequest.getName());
			plan.setCategory(updatePlanRequest.getCategory());
			plan.setPrice(updatePlanRequest.getPrice());
			plan.setDataPerDay(updatePlanRequest.getDataPerDay());
			plan.setCalls(updatePlanRequest.getCalls());
			plan.setSms(updatePlanRequest.getSms());
			plan.setValidityDays(updatePlanRequest.getValidityDays());

			Plan updatedPlan = planRepository.save(plan);
			return ResponseEntity.ok(updatedPlan);
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
		return planRepository.findById(id).map(plan -> {
			planRepository.deleteById(id);
			return ResponseEntity.noContent().<Void>build();
		}).orElse(ResponseEntity.notFound().build());
	}
}