package com.logstream.lucene.model;

public class LogEntry {

    private String timestamp;
    private String level;
    private String service;
    private String message;

    public LogEntry() {
    }

    public LogEntry(String timestamp, String level,
                    String service, String message) {
        this.timestamp = timestamp;
        this.level = level;
        this.service = service;
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public String getLevel() {
        return level;
    }

    public String getService() {
        return service;
    }

    public String getMessage() {
        return message;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public void setService(String service) {
        this.service = service;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}