package com.example.demo.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

	public void sendConfirmationEmail(String to, String mobileNumber, String planName, Double amount, String transactionId) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(to);
    message.setSubject("Recharge Confirmation");
    
    String emailBody = String.format(
        "Dear Customer,\n\n" +
        "Your recharge for mobile number %s with plan %s " +
        "amounting to ₹%.2f has been successful.\n\n" +
        "Transaction ID: %s\n\n" +
        "Thank you!",
        mobileNumber, planName, amount, transactionId
    );
    
    message.setText(emailBody);
    mailSender.send(message);
}
}