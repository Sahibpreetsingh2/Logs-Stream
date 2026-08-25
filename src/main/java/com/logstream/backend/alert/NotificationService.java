package com.logstream.backend.alert;

/**
 * Sends a notification when an alert rule is triggered.
 * Implementations decide how (webhook, email, etc.).
 */
public interface NotificationService {

    void notify(AlertRule rule, long matchCount);
}