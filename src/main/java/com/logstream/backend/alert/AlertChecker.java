package com.logstream.backend.alert;

import com.logstream.backend.model.LogEntry;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AlertChecker {

    private final NotificationService notificationService;

    // Spring will automatically inject WebhookNotificationService here
    public AlertChecker(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Mock rule for now — later this can come from a config file, DB, or REST endpoint
    private final AlertRule rule = new AlertRule(
            "high-error-rate",
            3,              // threshold: alert if 3+ matching logs found
            60,             // time window (not yet enforced with real timestamps)
            "payment-service",
            "ERROR",
            "webhook"
    );

    @Scheduled(fixedRate = 10000) // runs every 10 seconds
    public void checkAlerts() {
        List<LogEntry> mockLogs = getMockLogs();

        long matchCount = mockLogs.stream()
                .filter(log -> log.getLevel().equalsIgnoreCase(rule.getLevel()))
                .filter(log -> log.getServiceName().equalsIgnoreCase(rule.getServiceName()))
                .count();

        System.out.println("[AlertChecker] Checked " + mockLogs.size()
                + " logs, found " + matchCount + " matching rule '" + rule.getRuleName() + "'");

        if (matchCount >= rule.getThreshold()) {
            triggerAlert(matchCount);
        }
    }

    private void triggerAlert(long matchCount) {
        System.out.println("========== ALERT TRIGGERED ==========");
        System.out.println("Rule: " + rule.getRuleName());
        System.out.println("Service: " + rule.getServiceName());
        System.out.println("Level: " + rule.getLevel());
        System.out.println("Matches: " + matchCount + " (threshold: " + rule.getThreshold() + ")");
        System.out.println("Notify via: " + rule.getNotifyType());
        System.out.println("======================================");

        notificationService.notify(rule, matchCount);
    }

    // Temporary mock data — replace with real Lucene data once Member 2 confirms the API to use
    private List<LogEntry> getMockLogs() {
        List<LogEntry> logs = new ArrayList<>();

        logs.add(new LogEntry("LOG-001", "2026-08-21T16:40:00", "payment-service", "ERROR",
                "Database connection timeout", 1500));
        logs.add(new LogEntry("LOG-002", "2026-08-21T16:41:00", "payment-service", "ERROR",
                "Payment gateway unreachable", 2200));
        logs.add(new LogEntry("LOG-003", "2026-08-21T16:42:00", "payment-service", "ERROR",
                "Null pointer in checkout flow", 300));
        logs.add(new LogEntry("LOG-004", "2026-08-21T16:43:00", "auth-service", "INFO",
                "User login successful", 120));

        return logs;
    }
}