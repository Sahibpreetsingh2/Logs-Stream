package com.logstream.backend.lucene.model;

import java.time.Instant;
import java.util.Objects;

/**
 * Immutable representation of a single parsed log entry.
 */
public final class LogEntry {

    public enum Level {
        TRACE, DEBUG, INFO, WARN, ERROR, FATAL, UNKNOWN
    }

    private final Instant timestamp;
    private final Level level;
    private final String service;
    private final String message;

    public LogEntry(Instant timestamp, Level level, String service, String message) {
        this.timestamp = Objects.requireNonNull(timestamp, "timestamp must not be null");
        this.level = level == null ? Level.UNKNOWN : level;
        this.service = Objects.requireNonNull(service, "service must not be null");
        this.message = message == null ? "" : message;
    }

    /** Convenience constructor that parses a raw level string (e.g. from log text). */
    public static LogEntry of(Instant timestamp, String levelStr, String service, String message) {
        Level level;
        try {
            level = levelStr == null ? Level.UNKNOWN : Level.valueOf(levelStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            level = Level.UNKNOWN;
        }
        return new LogEntry(timestamp, level, service, message);
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public Level getLevel() {
        return level;
    }

    public String getService() {
        return service;
    }

    public String getMessage() {
        return message;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LogEntry)) return false;
        LogEntry other = (LogEntry) o;
        return timestamp.equals(other.timestamp)
                && level == other.level
                && service.equals(other.service)
                && message.equals(other.message);
    }

    @Override
    public int hashCode() {
        return Objects.hash(timestamp, level, service, message);
    }

    @Override
    public String toString() {
        return "LogEntry{" +
                "timestamp=" + timestamp +
                ", level=" + level +
                ", service='" + service + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}