package com.logstream.backend.alert;

import com.logstream.backend.model.LogEntry;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
public class AlertChecker {

    private final NotificationService notificationService;

    public AlertChecker(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Temporary rules
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

    @Scheduled(fixedRate = 10000)
    public void checkAlerts() {

        List<LogEntry> mockLogs = getMockLogs();

        for (AlertRule rule : rules) {

            long matchCount = mockLogs.stream()
                    .filter(log ->
                            log.getLevel().name()
                                    .equalsIgnoreCase(rule.getLevel())
                    )
                    .filter(log ->
                            log.getService()
                                    .equalsIgnoreCase(rule.getServiceName())
                    )
                    .count();

            System.out.println(
                    "[AlertChecker] Rule '" + rule.getRuleName()
                            + "': checked " + mockLogs.size()
                            + " logs, found " + matchCount
                            + " matches"
            );

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
        System.out.println(
                "Matches: " + matchCount
                        + " (threshold: " + rule.getThreshold() + ")"
        );
        System.out.println("Notify via: " + rule.getNotifyType());
        System.out.println("======================================");

        notificationService.notify(rule, matchCount);
    }

    // Temporary mock data
    private List<LogEntry> getMockLogs() {

        List<LogEntry> logs = new ArrayList<>();

        logs.add(LogEntry.of(
                Instant.parse("2026-08-21T16:40:00Z"),
                "ERROR",
                "payment-service",
                "Database connection timeout"
        ));

        logs.add(LogEntry.of(
                Instant.parse("2026-08-21T16:41:00Z"),
                "ERROR",
                "payment-service",
                "Payment gateway unreachable"
        ));

        logs.add(LogEntry.of(
                Instant.parse("2026-08-21T16:42:00Z"),
                "ERROR",
                "payment-service",
                "Null pointer in checkout flow"
        ));

        logs.add(LogEntry.of(
                Instant.parse("2026-08-21T16:43:00Z"),
                "INFO",
                "auth-service",
                "User login successful"
        ));

        logs.add(LogEntry.of(
                Instant.parse("2026-08-21T16:44:00Z"),
                "WARN",
                "auth-service",
                "Repeated failed login attempt"
        ));

        logs.add(LogEntry.of(
                Instant.parse("2026-08-21T16:45:00Z"),
                "WARN",
                "auth-service",
                "Token near expiry"
        ));

        return logs;
    }
}