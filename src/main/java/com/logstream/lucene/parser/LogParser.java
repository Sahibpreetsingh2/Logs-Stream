package com.logstream.lucene.parser;
import com.logstream.lucene.model.LogEntry;
import org.springframework.stereotype.Component;

@Component
public class LogParser {

    public LogEntry parse(String line) {

        String[] parts = line.split(" ", 5);

        String timestamp = parts[0] + " " + parts[1];
        String level = parts[2];
        String service = parts[3];
        String message = parts[4];

        return new LogEntry(
                timestamp,
                level,
                service,
                message
        );
    }
}