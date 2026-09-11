package com.sentinelcore.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.sentinelcore.dto.AlertDTO;

@Service
public class WebhookNotificationService {

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendWebhook(String webhookUrl, AlertDTO alert) {

        if (webhookUrl == null || webhookUrl.isBlank()) {
            return;
        }

        restTemplate.postForObject(
                webhookUrl,
                alert,
                String.class
        );
    }
}