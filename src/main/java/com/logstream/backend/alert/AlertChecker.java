package com.logstream.backend.alert;

import com.logstream.backend.model.LogEntry;
import com.logstream.backend.model.LogEntryStore;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AlertChecker {

    private final NotificationService notificationService;
    private final LogEntryStore logEntryStore;

    public AlertChecker(NotificationService notificationService, LogEntryStore logEntryStore) {
        this.notificationService = notificationService;
        this.logEntryStore = logEntryStore;
    }

    // Multiple rules for now — later these can come from a config file, DB, or REST endpoint
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
        List<LogEntry> recentLogs = logEntryStore.getRecent();

        if (recentLogs.isEmpty()) {
            System.out.println("[AlertChecker] No logs received yet — skipping check.");
            return;
        }

        for (AlertRule rule : rules) {
            long matchCount = recentLogs.stream()
                    .filter(log -> log.getLevel().name().equalsIgnoreCase(rule.getLevel()))
                    .filter(log -> log.getService().equalsIgnoreCase(rule.getServiceName()))
                    .count();

            System.out.println("[AlertChecker] Rule '" + rule.getRuleName() + "': checked "
                    + recentLogs.size() + " logs, found " + matchCount + " matches");

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
}