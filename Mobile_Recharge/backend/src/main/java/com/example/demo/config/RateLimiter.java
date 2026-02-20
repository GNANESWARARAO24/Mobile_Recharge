package com.example.demo.config;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimiter {
	private final Map<String, RequestCount> requestCounts = new ConcurrentHashMap<>();
	private static final int MAX_REQUESTS = 5;
	private static final long WINDOW_SECONDS = 60;

	private static class RequestCount {
		AtomicInteger count;
		Instant windowStart;

		RequestCount() {
			this.count = new AtomicInteger(0);
			this.windowStart = Instant.now();
		}
	}

	public boolean allowRequest(String key) {
		RequestCount requestCount = requestCounts.computeIfAbsent(key, k -> new RequestCount());

		synchronized (requestCount) {
			Instant now = Instant.now();
			if (now.isAfter(requestCount.windowStart.plusSeconds(WINDOW_SECONDS))) {
				requestCount.count.set(0);
				requestCount.windowStart = now;
			}

			if (requestCount.count.get() >= MAX_REQUESTS) {
				return false;
			}

			requestCount.count.incrementAndGet();
			return true;
		}
	}
}