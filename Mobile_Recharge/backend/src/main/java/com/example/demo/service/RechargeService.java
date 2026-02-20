package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.RechargeRequest;
import com.example.demo.dto.RechargeResponse;
import com.example.demo.model.Plan;
import com.example.demo.model.Recharge;
import com.example.demo.model.Subscriber;
import com.example.demo.repository.PlanRepository;
import com.example.demo.repository.RechargeRepository;
import com.example.demo.repository.SubscriberRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RechargeService {

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private RechargeRepository rechargeRepository;

    @Autowired
    private SubscriberRepository subscriberRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ValidationService validationService;

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public RechargeResponse processRecharge(RechargeRequest request) {
        validationService.validateRechargeRequest(request);

        Subscriber subscriber = subscriberRepository.findByMobileNumber(request.getMobileNumber());
        if (subscriber == null) {
            throw new RuntimeException("Subscriber not found");
        }

        Plan plan = planRepository.findById(request.getPlanId()).orElse(null);
        if (plan == null) {
            throw new RuntimeException("Invalid plan ID");
        }

        Recharge recharge = new Recharge();
        recharge.setMobileNumber(request.getMobileNumber());
        recharge.setPlan(plan);
        recharge.setAmount(plan.getPrice());
        recharge.setPaymentMethod(request.getPaymentMethod());
        recharge.setStatus("Success");
        recharge.setRechargeDate(LocalDateTime.now());
        rechargeRepository.save(recharge);

        subscriber.setCurrentPlan(plan);
        subscriber.setPlanExpiry(LocalDate.now().plusDays(plan.getValidityDays()));
        subscriber.setDataUsed(0.0);
        subscriber.setDataTotal(Double.valueOf(plan.getDataPerDay().replace("GB/day", "")) * plan.getValidityDays());
        subscriberRepository.save(subscriber);

        String transactionId = UUID.randomUUID().toString();
        try {
            emailService.sendConfirmationEmail(subscriber.getEmail(), subscriber.getMobileNumber(), 
                plan.getName(), plan.getPrice(), transactionId);
        } catch (Exception e) {
            System.out.println("Email sending failed: " + e.getMessage());
        }

        return new RechargeResponse(transactionId);
    }

    public List<Recharge> getRechargeHistory(String mobileNumber) {
        return rechargeRepository.findByMobileNumberOrderByRechargeDateDesc(mobileNumber);
    }
}