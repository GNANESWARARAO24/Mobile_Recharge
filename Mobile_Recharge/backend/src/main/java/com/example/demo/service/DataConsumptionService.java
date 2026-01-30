package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.model.Subscriber;
import com.example.demo.repository.SubscriberRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class DataConsumptionService {

	@Autowired
	private SubscriberRepository subscriberRepository;

	private Random random = new Random();

	// Run daily at midnight
	@Scheduled(cron = "0 0 0 * * ?")
	public void consumeDailyData() {
		List<Subscriber> subscribers = subscriberRepository.findAll();
		
		for (Subscriber subscriber : subscribers) {
			if (subscriber.getPlanExpiry() != null && subscriber.getPlanExpiry().isAfter(LocalDate.now())) {
				// Parse daily data from plan (e.g., "2GB/day" -> 2.0)
				String dataPerDay = subscriber.getCurrentPlan().getDataPerDay();
				double dailyData = parseDailyData(dataPerDay);
				
				// Consume 70-100% of daily data randomly
				double consumedData = dailyData * (0.7 + (random.nextDouble() * 0.3));
				
				double newDataUsed = subscriber.getDataUsed() + consumedData;
				if (newDataUsed > subscriber.getDataTotal()) {
					newDataUsed = subscriber.getDataTotal();
				}
				
				subscriber.setDataUsed(newDataUsed);
				subscriberRepository.save(subscriber);
			}
		}
	}

	// Manual trigger for testing
	public void consumeDailyDataManually() {
		consumeDailyData();
	}

	private double parseDailyData(String dataPerDay) {
		if (dataPerDay == null || dataPerDay.isEmpty()) {
			return 0.0;
		}
		try {
			return Double.parseDouble(dataPerDay.replaceAll("[^0-9.]", ""));
		} catch (NumberFormatException e) {
			return 0.0;
		}
	}
}
