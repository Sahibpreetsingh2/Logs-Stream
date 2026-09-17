package com.logstream.backend.alert;

import com.logstream.backend.model.LogEntry;
import org.springframework.stereotype.Component;
import com.logstream.backend.alert.AlertRuleService;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AlertChecker {

    private final NotificationService notificationService;

    /*
     * Stores recently received real logs.
     */
    private final List<LogEntry> recentLogs = new ArrayList<>();

    /*
     * Prevents the same alert from being triggered repeatedly
     * while the threshold remains exceeded.
     */
    private final Map<String, Boolean> alertTriggered =
            new ConcurrentHashMap<>();

    /*
     * Temporary rules.
     * Later these can come from a database/configuration.
     */
    private final AlertRuleService alertRuleService;

    public AlertChecker(
            NotificationService notificationService,
            AlertRuleService alertRuleService
    ) {
        this.notificationService = notificationService;
        this.alertRuleService = alertRuleService;
    }

    /**
     * Called whenever a REAL log is received.
     */
    public synchronized void checkLog(LogEntry newLog) {

        if (newLog == null) {
            return;
        }

        // Add the newly received real log
        recentLogs.add(newLog);

        // Remove logs older than the largest rule window
        Instant currentTime = newLog.getTimestamp();

        recentLogs.removeIf(log ->
                Duration.between(
                        log.getTimestamp(),
                        currentTime
                ).getSeconds() > getMaxWindowSeconds()
        );

        /*
         * Check every alert rule.
         */
        for (AlertRule rule : alertRuleService.getAllRules()) {

            long matchCount = recentLogs.stream()
                    .filter(log ->
                            Duration.between(
                                    log.getTimestamp(),
                                    currentTime
                            ).getSeconds() >= 0
                    )
                    .filter(log ->
                            Duration.between(
                                    log.getTimestamp(),
                                    currentTime
                            ).getSeconds()
                                    <= rule.getWindowSeconds()
                    )
                    .filter(log ->
                            log.getLevel()
                                    .name()
                                    .equalsIgnoreCase(rule.getLevel())
                    )
                    .filter(log ->
                            log.getService()
                                    .equalsIgnoreCase(rule.getServiceName())
                    )
                    .count();

            System.out.println(
                    "[AlertChecker] Rule '" +
                            rule.getRuleName() +
                            "': checked " +
                            recentLogs.size() +
                            " logs, found " +
                            matchCount +
                            " matches"
            );

            /*
             * Trigger only when threshold is reached
             * for the first time.
             */
            if (matchCount >= rule.getThreshold()) {

                boolean alreadyTriggered =
                        alertTriggered.getOrDefault(
                                rule.getRuleName(),
                                false
                        );

                if (!alreadyTriggered) {

                    triggerAlert(rule, matchCount);

                    alertTriggered.put(
                            rule.getRuleName(),
                            true
                    );
                }

            } else {

                /*
                 * Reset the alert once the count goes below
                 * the threshold.
                 */
                alertTriggered.put(
                        rule.getRuleName(),
                        false
                );
            }
        }
    }

    private void triggerAlert(
            AlertRule rule,
            long matchCount
    ) {

        System.out.println();
        System.out.println("========== ALERT TRIGGERED ==========");
        System.out.println("Rule: " + rule.getRuleName());
        System.out.println("Service: " + rule.getServiceName());
        System.out.println("Level: " + rule.getLevel());
        System.out.println(
                "Matches: " +
                        matchCount +
                        " (threshold: " +
                        rule.getThreshold() +
                        ")"
        );
        System.out.println(
                "Notify via: " +
                        rule.getNotifyType()
        );
        System.out.println("======================================");
        System.out.println();

        notificationService.notify(
                rule,
                matchCount
        );
    }

    private long getMaxWindowSeconds() {

        return alertRuleService.getAllRules()
                .stream()
                .mapToLong(AlertRule::getWindowSeconds)
                .max()
                .orElse(60);
    }
}