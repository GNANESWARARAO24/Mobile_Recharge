package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AddSubscriberRequest;
import com.example.demo.model.Plan;
import com.example.demo.model.Recharge;
import com.example.demo.model.Subscriber;
import com.example.demo.repository.PlanRepository;
import com.example.demo.repository.RechargeRepository;
import com.example.demo.repository.SubscriberRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriberService {

    @Autowired
    private SubscriberRepository subscriberRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private RechargeRepository rechargeRepository;

    @Autowired
    private ValidationService validationService;

    public List<Subscriber> getAllSubscribers() {
        return subscriberRepository.findAll();
    }

    public long getSubscribersCount() {
        return subscriberRepository.count();
    }

    public Subscriber addSubscriber(AddSubscriberRequest request) {
        if (subscriberRepository.findByMobileNumber(request.getMobileNumber()) != null) {
            throw new RuntimeException("Mobile number already exists");
        }

        Plan currentPlan = planRepository.findById(request.getCurrentPlanId()).orElse(null);
        if (currentPlan == null) {
            throw new RuntimeException("Invalid plan ID");
        }

        Subscriber subscriber = new Subscriber();
        subscriber.setMobileNumber(request.getMobileNumber());
        subscriber.setName(request.getName());
        subscriber.setEmail(request.getEmail());
        subscriber.setCurrentPlan(currentPlan);
        subscriber.setCreatedAt(LocalDate.now());
        subscriber.setDataUsed(0.0);
        subscriber.setDataTotal(currentPlan.getDataPerDay() != null
                ? Double.parseDouble(currentPlan.getDataPerDay().replace("GB/day", ""))
                : 0.0);

        if (currentPlan.getValidityDays() != null) {
            subscriber.setPlanExpiry(LocalDate.now().plusDays(currentPlan.getValidityDays()));
        }

        return subscriberRepository.save(subscriber);
    }

    public List<Subscriber> getExpiringSubscribers() {
        return subscriberRepository.findExpiringSubscribers();
    }

    public List<Recharge> getRechargeHistory(String mobileNumber, String startDate, String endDate, String sortOrder) {
        validationService.validateMobileNumber(mobileNumber);
        
        List<Recharge> recharges = rechargeRepository.findByMobileNumber(mobileNumber);
        
        if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59);
            recharges = recharges.stream()
                    .filter(r -> r.getRechargeDate().isAfter(start) && r.getRechargeDate().isBefore(end))
                    .toList();
        }
        
        if ("desc".equalsIgnoreCase(sortOrder)) {
            recharges.sort((a, b) -> b.getRechargeDate().compareTo(a.getRechargeDate()));
        } else {
            recharges.sort((a, b) -> a.getRechargeDate().compareTo(b.getRechargeDate()));
        }
        
        return recharges;
    }

    public Subscriber updateDataUsage(String mobileNumber, Double dataUsed) {
        validationService.validateMobileNumber(mobileNumber);

        Subscriber subscriber = subscriberRepository.findByMobileNumber(mobileNumber);
        if (subscriber == null) {
            throw new RuntimeException("Subscriber not found");
        }

        if (dataUsed < 0 || dataUsed > subscriber.getDataTotal()) {
            throw new RuntimeException("Invalid data usage value");
        }

        subscriber.setDataUsed(dataUsed);
        return subscriberRepository.save(subscriber);
    }
}