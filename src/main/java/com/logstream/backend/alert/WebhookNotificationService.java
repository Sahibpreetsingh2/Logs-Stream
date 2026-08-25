package com.logstream.backend.alert;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebhookNotificationService implements NotificationService {

    // Put a real webhook URL in application.properties as: alert.webhook.url=https://...
    // Get a free test URL from https://webhook.site to try this out.
    @Value("${alert.webhook.url:}")
    private String webhookUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void notify(AlertRule rule, long matchCount) {
        if (webhookUrl == null || webhookUrl.isBlank()) {
            System.out.println("[WebhookNotificationService] No webhook URL configured "
                    + "(set alert.webhook.url in application.properties) — skipping send.");
            return;
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("ruleName", rule.getRuleName());
        payload.put("serviceName", rule.getServiceName());
        payload.put("level", rule.getLevel());
        payload.put("threshold", rule.getThreshold());
        payload.put("matchCount", matchCount);
        payload.put("triggeredAt", Instant.now().toString());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(webhookUrl, request, String.class);
            System.out.println("[WebhookNotificationService] Sent alert for rule '"
                    + rule.getRuleName() + "' to " + webhookUrl);
        } catch (Exception e) {
            System.out.println("[WebhookNotificationService] Failed to send webhook: " + e.getMessage());
        }
    }
}