package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AddSubscriberRequest {

	@NotBlank(message = "Mobile number is required")
	private String mobileNumber;

	@NotBlank(message = "Name is required")
	private String name;

	private String email;

	@NotNull(message = "Plan ID is required")
	private Long currentPlanId; // Use currentPlanId to match the entity relationship

	// Getters and Setters
	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getCurrentPlanId() {
		return currentPlanId;
	}

	public void setCurrentPlanId(Long currentPlanId) {
		this.currentPlanId = currentPlanId;
	}
}