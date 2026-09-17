package com.logstream.backend.alert;

public class AlertRule {

    private final String ruleName;
    private final long threshold;
    private final long windowSeconds;
    private final String serviceName;
    private final String level;
    private final String notifyType;

    public AlertRule(
            String ruleName,
            long threshold,
            long windowSeconds,
            String serviceName,
            String level,
            String notifyType
    ) {
        this.ruleName = ruleName;
        this.threshold = threshold;
        this.windowSeconds = windowSeconds;
        this.serviceName = serviceName;
        this.level = level;
        this.notifyType = notifyType;
    }

    public String getRuleName() {
        return ruleName;
    }

    public long getThreshold() {
        return threshold;
    }

    public long getWindowSeconds() {
        return windowSeconds;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getLevel() {
        return level;
    }

    public String getNotifyType() {
        return notifyType;
    }
}
