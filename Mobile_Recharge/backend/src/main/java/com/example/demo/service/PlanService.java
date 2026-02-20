package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.NewPlanRequest;
import com.example.demo.dto.UpdatePlanRequest;
import com.example.demo.model.Plan;
import com.example.demo.repository.PlanRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public long getPlanCount() {
        return planRepository.count();
    }

    public Optional<Plan> getPlanById(Long id) {
        return planRepository.findById(id);
    }

    public Plan createPlan(NewPlanRequest request) {
        Plan plan = new Plan();
        plan.setName(request.getName());
        plan.setCategory(Plan.Category.valueOf(request.getCategory()));
        plan.setPrice(request.getPrice());
        plan.setDataPerDay(request.getDataPerDay());
        plan.setCalls(request.getCalls());
        plan.setSms(request.getSms());
        plan.setValidityDays(request.getValidityDays());
        return planRepository.save(plan);
    }

    public Plan updatePlan(Long id, UpdatePlanRequest request) {
        Plan plan = planRepository.findById(id).orElseThrow(() -> new RuntimeException("Plan not found"));
        plan.setName(request.getName());
        plan.setCategory(request.getCategory());
        plan.setPrice(request.getPrice());
        plan.setDataPerDay(request.getDataPerDay());
        plan.setCalls(request.getCalls());
        plan.setSms(request.getSms());
        plan.setValidityDays(request.getValidityDays());
        return planRepository.save(plan);
    }

    public void deletePlan(Long id) {
        if (!planRepository.existsById(id)) {
            throw new RuntimeException("Plan not found");
        }
        planRepository.deleteById(id);
    }
}