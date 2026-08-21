package com.logstream.lucene.index;

import com.logstream.lucene.model.LogEntry;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.document.StoredField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.apache.lucene.analysis.standard.StandardAnalyzer;

import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class LogIndexer {

    private final Directory directory;

    public LogIndexer(Directory directory) {
        this.directory = directory;
    }

    public void indexLog(LogEntry log) throws IOException {

        StandardAnalyzer analyzer = new StandardAnalyzer();

        IndexWriterConfig config =
                new IndexWriterConfig(analyzer);

        try (IndexWriter writer =
                     new IndexWriter(directory, config)) {

            Document document = new Document();

            document.add(
                    new StringField(
                            "level",
                            log.getLevel(),
                            Field.Store.YES
                    )
            );

            document.add(
                    new StringField(
                            "service",
                            log.getService(),
                            Field.Store.YES
                    )
            );

            document.add(
                    new TextField(
                            "message",
                            log.getMessage(),
                            Field.Store.YES
                    )
            );

            document.add(
                    new StoredField(
                            "timestamp",
                            log.getTimestamp()
                    )
            );

            writer.addDocument(document);

            writer.commit();
        }
    }
}