package com.logstream.backend.alert;

public class AlertRule {
	
	    private String ruleName;
	    private int threshold;
	    private int timeWindowSeconds;
	    private String serviceName;
	    private String level;
	    private String notifyType; // "webhook" or "email"

	    public AlertRule() {
	    }

	    public AlertRule(String ruleName, int threshold, int timeWindowSeconds,
	                      String serviceName, String level, String notifyType) {
	        this.ruleName = ruleName;
	        this.threshold = threshold;
	        this.timeWindowSeconds = timeWindowSeconds;
	        this.serviceName = serviceName;
	        this.level = level;
	        this.notifyType = notifyType;
	    }

	    public String getRuleName() {
	        return ruleName;
	    }

	    public void setRuleName(String ruleName) {
	        this.ruleName = ruleName;
	    }

	    public int getThreshold() {
	        return threshold;
	    }

	    public void setThreshold(int threshold) {
	        this.threshold = threshold;
	    }

	    public int getTimeWindowSeconds() {
	        return timeWindowSeconds;
	    }

	    public void setTimeWindowSeconds(int timeWindowSeconds) {
	        this.timeWindowSeconds = timeWindowSeconds;
	    }

	    public String getServiceName() {
	        return serviceName;
	    }

	    public void setServiceName(String serviceName) {
	        this.serviceName = serviceName;
	    }

	    public String getLevel() {
	        return level;
	    }

	    public void setLevel(String level) {
	        this.level = level;
	    }

	    public String getNotifyType() {
	        return notifyType;
	    }

	    public void setNotifyType(String notifyType) {
	        this.notifyType = notifyType;
	    }
	}


