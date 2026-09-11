package com.sentinelcore.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.dto.AlertDTO;
import com.sentinelcore.service.AlertService;
import com.sentinelcore.service.NotificationService;
import com.sentinelcore.service.WebhookNotificationService;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:5173")
public class AlertController {

    private final AlertService alertService;
    private final NotificationService notificationService;
    private final WebhookNotificationService webhookNotificationService;

    @Value("${spring.mail.username}")
    private String notificationEmail;

    @Value("${sentinelcore.webhook.url:}")
    private String webhookUrl;

    public AlertController(
            AlertService alertService,
            NotificationService notificationService,
            WebhookNotificationService webhookNotificationService) {

        this.alertService = alertService;
        this.notificationService = notificationService;
        this.webhookNotificationService = webhookNotificationService;
    }

    @GetMapping("/open")
    public List<AlertDTO> getOpenAlerts() {
        return alertService.getOpenAlerts();
    }

    @GetMapping("/history")
    public List<AlertDTO> getAlertHistory() {
        return alertService.getAlertHistory();
    }

    @PostMapping
    public AlertDTO createAlert(@RequestBody AlertDTO dto) {

        AlertDTO savedAlert = alertService.createAlert(dto);

        String severity = String.valueOf(dto.getSeverity());

        if ("HIGH".equalsIgnoreCase(severity)
                || "CRITICAL".equalsIgnoreCase(severity)) {

            // Email notification
            notificationService.sendAlertEmail(
                    notificationEmail,
                    "SentinelCore " + severity + " Alert",
                    "A " + severity
                            + " alert has been created in SentinelCore.\n\n"
                            + "Message: " + dto.getMessage()
            );

            // Webhook notification
            webhookNotificationService.sendWebhook(
                    webhookUrl,
                    savedAlert
            );
        }

        return savedAlert;
    }

    @PutMapping("/{id}/resolve")
    public AlertDTO resolveAlert(@PathVariable Long id) {
        return alertService.resolveAlert(id);
    }
}