package com.logstream.lucene.search;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class LogSearcher {

    private static final Logger log = LoggerFactory.getLogger(LogSearcher.class);

    private static final String MESSAGE_FIELD = "message";
    private static final int DEFAULT_MAX_RESULTS = 20;

    private final Directory directory;
    private final StandardAnalyzer analyzer = new StandardAnalyzer();

    public LogSearcher(Directory directory) {
        this.directory = Objects.requireNonNull(directory, "directory must not be null");
    }

    public List<LogSearchResult> search(String keyword) throws LogSearchException {
        return search(keyword, DEFAULT_MAX_RESULTS);
    }

    public List<LogSearchResult> search(String keyword, int maxResults) throws LogSearchException {
        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }

        List<LogSearchResult> results = new ArrayList<>();

        try (IndexReader reader = DirectoryReader.open(directory)) {

            QueryParser parser = new QueryParser(MESSAGE_FIELD, analyzer);
            // Prevents users from injecting field: or wildcard/range syntax that
            // could target fields other than "message". Remove if you intentionally
            // want to expose full Lucene query syntax to callers.
            parser.setAllowLeadingWildcard(false);
            Query query = parser.parse(QueryParser.escape(keyword));

            IndexSearcher searcher = new IndexSearcher(reader);
            TopDocs topDocs = searcher.search(query, maxResults);

            var storedFields = searcher.storedFields();
            for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                Document document = storedFields.document(scoreDoc.doc);
                String message = document.get(MESSAGE_FIELD);
                results.add(new LogSearchResult(message, scoreDoc.score));
            }

        } catch (ParseException e) {
            log.warn("Failed to parse search query '{}': {}", keyword, e.getMessage());
            throw new LogSearchException("Invalid search query: " + keyword, e);
        } catch (IOException e) {
            log.error("I/O error while searching logs for query '{}'", keyword, e);
            throw new LogSearchException("Search failed due to an I/O error", e);
        }

        return results;
    }

    /** Result of a log search: the matched message and its relevance score. */
    public record LogSearchResult(String message, float score) {
    }

    /** Thrown when a log search cannot be completed. */
    public static class LogSearchException extends Exception {
        public LogSearchException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}