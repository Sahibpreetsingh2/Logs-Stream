package com.logstream.backend.service;

import com.logstream.backend.grpc.LogMessage;
import com.logstream.backend.model.LogEntry;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class LogProcessingService {

    public LogEntry processLog(LogMessage request) {

        return LogEntry.of(
                parseTimestamp(request.getTimestamp()),
                request.getLevel(),
                request.getServiceName(),
                request.getMessage()
        );
    }

    private Instant parseTimestamp(String timestamp) {
        try {
            return Instant.parse(timestamp);
        } catch (Exception e) {
            return Instant.now();
        }
    }
    public LogEntry processLog(LogEntry logEntry) {

        if (logEntry == null) {
            throw new IllegalArgumentException("Log entry cannot be null");
        }

        if (logEntry.getTimestamp() == null) {
            throw new IllegalArgumentException("Timestamp is required");
        }

        if (logEntry.getLevel() == null) {
            throw new IllegalArgumentException("Log level is required");
        }

        if (logEntry.getMessage() == null ||
                logEntry.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }

        if (logEntry.getService() == null ||
                logEntry.getService().isBlank()) {
            throw new IllegalArgumentException("Service is required");
        }

        return logEntry;
    }
}