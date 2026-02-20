package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.dto.RechargeRequest;

@Service
public class ValidationService {

    public void validateMobileNumber(String mobileNumber) {
        if (mobileNumber == null || !mobileNumber.matches("^[0-9]{10}$")) {
            throw new RuntimeException("Invalid mobile number");
        }
    }

    public void validateRechargeRequest(RechargeRequest request) {
        validateMobileNumber(request.getMobileNumber());
        
        if (request.getPlanId() == null) {
            throw new RuntimeException("Plan ID is required");
        }
        
        if (request.getPaymentMethod() == null) {
            throw new RuntimeException("Payment method is required");
        }
        
        if (request.getPaymentMethod().equals("UPI") && 
            (request.getPaymentDetails() == null || !request.getPaymentDetails().matches("^[a-zA-Z0-9]+@[a-zA-Z]+$"))) {
            throw new RuntimeException("Invalid UPI ID");
        }
    }
}