package com.logstream.backend.parser;

import com.logstream.backend.model.LogEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class LogParser {

    private static final Logger log = LoggerFactory.getLogger(LogParser.class);

    // Example expected format: "2024-01-15 10:23:45 ERROR auth-service Failed to authenticate user"
    // Adjust the pattern to match your actual log format.
    private static final Pattern LOG_PATTERN = Pattern.compile(
            "^(\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2})\\s+" +  // timestamp
                    "(\\w+)\\s+" +                                          // level
                    "(\\S+)\\s+" +                                          // service
                    "(.*)$"                                                 // message (rest of line)
    );

    private static final DateTimeFormatter TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static final java.util.Set<String> VALID_LEVELS =
            java.util.Set.of("TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL");

    /**
     * Parses a single log line into a LogEntry.
     * Returns Optional.empty() if the line is malformed, rather than throwing,
     * so callers can skip bad lines without crashing a batch/stream.
     */
    public Optional<LogEntry> parse(String line) {
        if (line == null || line.isBlank()) {
            return Optional.empty();
        }

        Matcher matcher = LOG_PATTERN.matcher(line.trim());
        if (!matcher.matches()) {
            log.warn("Skipping malformed log line (does not match expected format): {}", line);
            return Optional.empty();
        }

        String rawTimestamp = matcher.group(1);
        String level = matcher.group(2).toUpperCase();
        String service = matcher.group(3);
        String message = matcher.group(4);

        LocalDateTime timestamp;
        try {
            timestamp = LocalDateTime.parse(rawTimestamp, TIMESTAMP_FORMAT);
        } catch (DateTimeParseException e) {
            log.warn("Skipping log line with unparseable timestamp '{}': {}", rawTimestamp, line);
            return Optional.empty();
        }

        if (!VALID_LEVELS.contains(level)) {
            log.warn("Log line has unrecognized level '{}', keeping it anyway: {}", level, line);
            // Not returning empty here — an unknown level shouldn't necessarily drop the entry.
            // Change this to `return Optional.empty();` if you want strict validation instead.
        }

        // LogEntry.of(...) is the static factory that accepts raw String/level input
        // and builds the proper LogEntry (Instant timestamp, Level enum, service, message).
        // Using UTC here since LocalDateTime has no zone info of its own — adjust if logs
        // are known to be in a different zone.
        return Optional.of(LogEntry.of(
                timestamp.toInstant(ZoneOffset.UTC),
                level,
                service,
                message
        ));
    }
}