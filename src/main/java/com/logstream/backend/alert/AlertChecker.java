package com.logstream.backend.alert;

import com.logstream.backend.model.LogEntry;
import org.springframework.stereotype.Component;

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
     * Recently received real logs.
     */
    private final List<LogEntry> recentLogs =
            new ArrayList<>();

    /*
     * Currently active alerts.
     *
     * Key   = rule name
     * Value = active alert information
     */
    private final Map<String, ActiveAlert> activeAlerts =
            new ConcurrentHashMap<>();

    /*
     * Alert rules.
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

        /*
         * Add newly received log.
         */
        recentLogs.add(newLog);

        /*
         * Current time according to the log.
         */
        Instant currentTime =
                newLog.getTimestamp();

        /*
         * Remove logs older than the largest
         * configured alert window.
         */
        recentLogs.removeIf(log ->
                Duration.between(
                        log.getTimestamp(),
                        currentTime
                ).getSeconds()
                        > getMaxWindowSeconds()
        );

        /*
         * Check every alert rule.
         */
        for (AlertRule rule :
                alertRuleService.getAllRules()) {

            long matchCount =
                    recentLogs.stream()

                            /*
                             * Don't process future logs.
                             */
                            .filter(log ->
                                    Duration.between(
                                            log.getTimestamp(),
                                            currentTime
                                    ).getSeconds() >= 0
                            )

                            /*
                             * Check rule time window.
                             */
                            .filter(log ->
                                    Duration.between(
                                            log.getTimestamp(),
                                            currentTime
                                    ).getSeconds()
                                            <= rule.getWindowSeconds()
                            )

                            /*
                             * Check log level.
                             */
                            .filter(log ->
                                    log.getLevel()
                                            .name()
                                            .equalsIgnoreCase(
                                                    rule.getLevel()
                                            )
                            )

                            /*
                             * Check service.
                             */
                            .filter(log ->
                                    log.getService()
                                            .equalsIgnoreCase(
                                                    rule.getServiceName()
                                            )
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
             * Threshold reached.
             */
            if (matchCount >= rule.getThreshold()) {

                /*
                 * Check whether this rule is already active.
                 */
                boolean alreadyTriggered =
                        activeAlerts.containsKey(
                                rule.getRuleName()
                        );

                /*
                 * Trigger only once while threshold
                 * remains exceeded.
                 */
                if (!alreadyTriggered) {

                    triggerAlert(
                            rule,
                            matchCount
                    );

                    activeAlerts.put(
                            rule.getRuleName(),
                            new ActiveAlert(
                                    rule.getRuleName(),
                                    rule.getServiceName(),
                                    rule.getLevel(),
                                    matchCount,
                                    rule.getThreshold(),
                                    currentTime.toString(),
                                    rule.getNotifyType()
                            )
                    );
                }

            } else {

                /*
                 * Threshold is no longer exceeded,
                 * therefore deactivate the alert.
                 */
                activeAlerts.remove(
                        rule.getRuleName()
                );
            }
        }
    }

    /**
     * Return currently active alerts.
     */
    public synchronized List<ActiveAlert> getActiveAlerts() {

        return new ArrayList<>(
                activeAlerts.values()
        );
    }

    /**
     * Trigger notification.
     */
    private void triggerAlert(
            AlertRule rule,
            long matchCount
    ) {

        System.out.println();
        System.out.println(
                "========== ALERT TRIGGERED =========="
        );

        System.out.println(
                "Rule: " +
                        rule.getRuleName()
        );

        System.out.println(
                "Service: " +
                        rule.getServiceName()
        );

        System.out.println(
                "Level: " +
                        rule.getLevel()
        );

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

        System.out.println(
                "======================================"
        );

        System.out.println();

        notificationService.notify(
                rule,
                matchCount
        );
    }

    /**
     * Find largest configured alert window.
     */
    private long getMaxWindowSeconds() {

        return alertRuleService
                .getAllRules()
                .stream()
                .mapToLong(
                        AlertRule::getWindowSeconds
                )
                .max()
                .orElse(60);
    }

    /**
     * Data returned to frontend for an active alert.
     */
    public record ActiveAlert(
            String ruleName,
            String serviceName,
            String level,
            long matchCount,
            long threshold,
            String triggeredAt,
            String notifyType
    ) {
    }
}