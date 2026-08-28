package com.logstream.backend.alert;

import com.logstream.backend.model.LogEntry;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AlertChecker {

    private final NotificationService notificationService;

    public AlertChecker(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Multiple mock rules for now — later these can come from a config file, DB, or REST endpoint
    private final List<AlertRule> rules = List.of(
            new AlertRule(
                    "high-error-rate",
                    3,
                    60,
                    "payment-service",
                    "ERROR",
                    "webhook"
            ),
            new AlertRule(
                    "auth-service-warnings",
                    2,
                    60,
                    "auth-service",
                    "WARN",
                    "webhook"
            )
    );

    @Scheduled(fixedRate = 10000) // runs every 10 seconds
    public void checkAlerts() {
        List<LogEntry> mockLogs = getMockLogs();

        for (AlertRule rule : rules) {
            long matchCount = mockLogs.stream()
                    .filter(log -> log.getLevel().equalsIgnoreCase(rule.getLevel()))
                    .filter(log -> log.getServiceName().equalsIgnoreCase(rule.getServiceName()))
                    .count();

            System.out.println("[AlertChecker] Rule '" + rule.getRuleName() + "': checked "
                    + mockLogs.size() + " logs, found " + matchCount + " matches");

            if (matchCount >= rule.getThreshold()) {
                triggerAlert(rule, matchCount);
            }
        }
    }

    private void triggerAlert(AlertRule rule, long matchCount) {
        System.out.println("========== ALERT TRIGGERED ==========");
        System.out.println("Rule: " + rule.getRuleName());
        System.out.println("Service: " + rule.getServiceName());
        System.out.println("Level: " + rule.getLevel());
        System.out.println("Matches: " + matchCount + " (threshold: " + rule.getThreshold() + ")");
        System.out.println("Notify via: " + rule.getNotifyType());
        System.out.println("======================================");

        notificationService.notify(rule, matchCount);
    }

    // Temporary mock data — replace with real Lucene data once Member 2 confirms the API to use.
    // Includes a couple of WARN-level auth-service logs so the second rule can also fire.
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
        logs.add(new LogEntry("LOG-005", "2026-08-21T16:44:00", "auth-service", "WARN",
                "Repeated failed login attempt", 90));
        logs.add(new LogEntry("LOG-006", "2026-08-21T16:45:00", "auth-service", "WARN",
                "Token near expiry", 40));

        return logs;
    }
}