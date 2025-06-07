package com.example.demo.dto;

import com.example.demo.model.Plan;
import com.example.demo.model.Plan.Category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class UpdatePlanRequest {

	@NotNull(message = "Plan ID is required")
	private Long id;

	@NotBlank(message = "Name is required")
	private String name;

	private Plan.Category category;

	@NotNull(message = "Price is required")
	@Positive(message = "Price must be positive")
	private Double price;

	private String dataPerDay;
	private String calls;
	private String sms;

	@NotNull(message = "Validity days is required")
	@Positive(message = "Validity days must be positive")
	private Integer validityDays;

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getDataPerDay() {
		return dataPerDay;
	}

	public void setDataPerDay(String dataPerDay) {
		this.dataPerDay = dataPerDay;
	}

	public String getCalls() {
		return calls;
	}

	public void setCalls(String calls) {
		this.calls = calls;
	}

	public String getSms() {
		return sms;
	}

	public void setSms(String sms) {
		this.sms = sms;
	}

	public Integer getValidityDays() {
		return validityDays;
	}

	public void setValidityDays(Integer validityDays) {
		this.validityDays = validityDays;
	}
}