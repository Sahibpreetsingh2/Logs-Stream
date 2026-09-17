package com.logstream.backend.alert;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AlertRuleService {

    private final Map<String, AlertRule> rules = new ConcurrentHashMap<>();

    public AlertRuleService() {

        // Default rules
        addRule(new AlertRule(
                "high-error-rate",
                3,
                60,
                "payment-service",
                "ERROR",
                "webhook"
        ));

        addRule(new AlertRule(
                "auth-service-warnings",
                2,
                60,
                "auth-service",
                "WARN",
                "webhook"
        ));
    }

    public AlertRule addRule(AlertRule rule) {

        if (rule == null) {
            throw new IllegalArgumentException("Rule cannot be null");
        }

        validateRule(rule);

        if (rules.containsKey(rule.getRuleName())) {
            throw new IllegalArgumentException(
                    "Rule already exists: " + rule.getRuleName()
            );
        }

        rules.put(rule.getRuleName(), rule);

        return rule;
    }

    public List<AlertRule> getAllRules() {
        return new ArrayList<>(rules.values());
    }

    public AlertRule getRule(String ruleName) {

        AlertRule rule = rules.get(ruleName);

        if (rule == null) {
            throw new IllegalArgumentException(
                    "Rule not found: " + ruleName
            );
        }

        return rule;
    }

    public AlertRule deleteRule(String ruleName) {

        AlertRule removed = rules.remove(ruleName);

        if (removed == null) {
            throw new IllegalArgumentException(
                    "Rule not found: " + ruleName
            );
        }

        return removed;
    }

    public AlertRule updateRule(
            String ruleName,
            AlertRule updatedRule
    ) {

        if (updatedRule == null) {
            throw new IllegalArgumentException(
                    "Updated rule cannot be null"
            );
        }

        validateRule(updatedRule);

        if (!rules.containsKey(ruleName)) {
            throw new IllegalArgumentException(
                    "Rule not found: " + ruleName
            );
        }

        AlertRule rule = new AlertRule(
                ruleName,
                updatedRule.getThreshold(),
                updatedRule.getWindowSeconds(),
                updatedRule.getServiceName(),
                updatedRule.getLevel(),
                updatedRule.getNotifyType()
        );

        rules.put(ruleName, rule);

        return rule;
    }

    private void validateRule(AlertRule rule) {

        if (rule.getRuleName() == null ||
                rule.getRuleName().isBlank()) {
            throw new IllegalArgumentException(
                    "Rule name is required"
            );
        }

        if (rule.getThreshold() <= 0) {
            throw new IllegalArgumentException(
                    "Threshold must be greater than 0"
            );
        }

        if (rule.getWindowSeconds() <= 0) {
            throw new IllegalArgumentException(
                    "Window seconds must be greater than 0"
            );
        }

        if (rule.getServiceName() == null ||
                rule.getServiceName().isBlank()) {
            throw new IllegalArgumentException(
                    "Service name is required"
            );
        }

        if (rule.getLevel() == null ||
                rule.getLevel().isBlank()) {
            throw new IllegalArgumentException(
                    "Log level is required"
            );
        }

        if (rule.getNotifyType() == null ||
                rule.getNotifyType().isBlank()) {
            throw new IllegalArgumentException(
                    "Notification type is required"
            );
        }
    }
}