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

	@Scheduled(cron = "0 0 0 * * ?")
	public void consumeDailyData() {
		List<Subscriber> subscribers = subscriberRepository.findAll();
		
		for (Subscriber subscriber : subscribers) {
			if (subscriber.getPlanExpiry() != null && subscriber.getPlanExpiry().isAfter(LocalDate.now())) {
				String dataPerDay = subscriber.getCurrentPlan().getDataPerDay();
				double dailyData = Double.parseDouble(dataPerDay.replaceAll("[^0-9.]", ""));
				
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

	public void consumeDailyDataManually() {
		consumeDailyData();
	}
}
