package com.logstream.backend.model;


public class LogEntry {

    private String id;
    private String timestamp;
    private String serviceName;
    private String level;
    private String message;
    private long responseTime;

    public LogEntry() {
    }

    public LogEntry(
            String id,
            String timestamp,
            String serviceName,
            String level,
            String message,
            long responseTime) {

        this.id = id;
        this.timestamp = timestamp;
        this.serviceName = serviceName;
        this.level = level;
        this.message = message;
        this.responseTime = responseTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(long responseTime) {
        this.responseTime = responseTime;
    }
}