package com.logstream.backend.lucene.search;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Predicate;

/**
 * Represents a set of filter criteria applied to log search results.
 * Can be combined with a Lucene Query or applied as a post-filter Predicate.
 */
public class LogFilter {

    private final Set<String> levels;
    private final Set<String> sources;
    private final Instant startTime;
    private final Instant endTime;
    private final String keyword;
    private final boolean caseSensitive;

    private LogFilter(Builder builder) {
        this.levels = builder.levels;
        this.sources = builder.sources;
        this.startTime = builder.startTime;
        this.endTime = builder.endTime;
        this.keyword = builder.keyword;
        this.caseSensitive = builder.caseSensitive;
    }

    public boolean matches(LogEntry entry) {
        if (entry == null) {
            return false;
        }

        if (!levels.isEmpty() && !levels.contains(normalize(entry.getLevel()))) {
            return false;
        }

        if (!sources.isEmpty() && !sources.contains(entry.getSource())) {
            return false;
        }

        if (startTime != null && entry.getTimestamp().isBefore(startTime)) {
            return false;
        }

        if (endTime != null && entry.getTimestamp().isAfter(endTime)) {
            return false;
        }

        if (keyword != null && !keyword.isEmpty()) {
            String message = entry.getMessage();
            if (message == null) {
                return false;
            }
            if (caseSensitive) {
                if (!message.contains(keyword)) {
                    return false;
                }
            } else {
                if (!message.toLowerCase().contains(keyword.toLowerCase())) {
                    return false;
                }
            }
        }

        return true;
    }

    /** Returns this filter as a reusable Predicate<LogEntry>. */
    public Predicate<LogEntry> asPredicate() {
        return this::matches;
    }

    private String normalize(String level) {
        return level == null ? null : level.toUpperCase();
    }

    public Set<String> getLevels() {
        return levels;
    }

    public Set<String> getSources() {
        return sources;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public String getKeyword() {
        return keyword;
    }

    public boolean isCaseSensitive() {
        return caseSensitive;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Set<String> levels = new HashSet<>();
        private final Set<String> sources = new HashSet<>();
        private Instant startTime;
        private Instant endTime;
        private String keyword;
        private boolean caseSensitive = false;

        public Builder level(String level) {
            if (level != null) {
                this.levels.add(level.toUpperCase());
            }
            return this;
        }

        public Builder levels(Set<String> levels) {
            if (levels != null) {
                levels.forEach(this::level);
            }
            return this;
        }

        public Builder source(String source) {
            if (source != null) {
                this.sources.add(source);
            }
            return this;
        }

        public Builder timeRange(Instant start, Instant end) {
            this.startTime = start;
            this.endTime = end;
            return this;
        }

        public Builder keyword(String keyword) {
            this.keyword = keyword;
            return this;
        }

        public Builder caseSensitive(boolean caseSensitive) {
            this.caseSensitive = caseSensitive;
            return this;
        }

        public LogFilter build() {
            return new LogFilter(this);
        }
    }

    /**
     * Minimal log entry shape expected by this filter.
     * Replace with your actual domain model if one already exists.
     */
    public interface LogEntry {
        String getLevel();
        String getSource();
        Instant getTimestamp();
        String getMessage();
    }
}