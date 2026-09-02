package com.logstream.backend.model;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * In-memory store holding the most recent LogEntry objects received via gRPC.
 * Acts as the shared data source for AlertChecker and LiveTailWebSocketHandler
 * until a proper query layer (Lucene search) is available.
 */
@Component
public class LogEntryStore {

    // Keep only the most recent N entries to avoid unbounded memory growth
    private static final int MAX_ENTRIES = 500;

    private final ConcurrentLinkedDeque<LogEntry> recentEntries = new ConcurrentLinkedDeque<>();

    public void add(LogEntry entry) {
        recentEntries.addLast(entry);
        while (recentEntries.size() > MAX_ENTRIES) {
            recentEntries.pollFirst();
        }
    }

    public List<LogEntry> getRecent() {
        return Collections.unmodifiableList(List.copyOf(recentEntries));
    }
}