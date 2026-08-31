package com.logstream.backend.index;

import com.logstream.backend.model.LogEntry;

import jakarta.annotation.PreDestroy;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.*;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class LogIndexer {

    private static final Logger log = LoggerFactory.getLogger(LogIndexer.class);

    private final IndexWriter writer;

    public LogIndexer(Directory directory) throws IOException {
        StandardAnalyzer analyzer = new StandardAnalyzer();
        IndexWriterConfig config = new IndexWriterConfig(analyzer);
        // Long-lived writer; IndexWriter is thread-safe for concurrent addDocument calls.
        this.writer = new IndexWriter(directory, config);
    }

    /** Indexes a single log entry. For bulk ingestion, prefer {@link #indexLogs(List)}. */
    public void indexLog(LogEntry entry) throws IOException {
        writer.addDocument(toDocument(entry));
        writer.commit();
    }

    /** Indexes a batch of log entries with a single commit — much cheaper than per-entry commits. */
    public void indexLogs(List<LogEntry> entries) throws IOException {
        if (entries == null || entries.isEmpty()) {
            return;
        }
        for (LogEntry entry : entries) {
            writer.addDocument(toDocument(entry));
        }
        writer.commit();
    }

    private Document toDocument(LogEntry entry) {
        Document document = new Document();

        document.add(new StringField(
                "level",
                entry.getLevel().name(),
                Field.Store.YES
        ));

        document.add(new StringField(
                "service",
                entry.getService(),
                Field.Store.YES
        ));

        document.add(new TextField(
                "message",
                entry.getMessage(),
                Field.Store.YES
        ));

        long epochMillis = entry.getTimestamp().toEpochMilli();

        // Indexed + range-queryable (e.g. LongPoint.newRangeQuery("timestamp_ms", from, to))
        document.add(new LongPoint("timestamp_ms", epochMillis));
        // Enables sorting search results by timestamp
        document.add(new NumericDocValuesField("timestamp_ms", epochMillis));
        // Stored so the original value can be retrieved and reconstructed via Instant.ofEpochMilli(...)
        document.add(new StoredField("timestamp_ms", epochMillis));

        return document;
    }

    @PreDestroy
    public void close() {
        try {
            writer.close();
        } catch (IOException e) {
            log.error("Failed to close IndexWriter cleanly", e);
        }
    }
}