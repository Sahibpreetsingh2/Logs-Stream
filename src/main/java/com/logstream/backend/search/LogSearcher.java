package com.logstream.backend.search;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.MatchAllDocsQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class LogSearcher {

    private static final String MESSAGE_FIELD = "message";
    private static final String SERVICE_FIELD = "service";
    private static final String LEVEL_FIELD = "level";
    private static final String TIMESTAMP_FIELD = "timestamp_ms";

    private static final int DEFAULT_MAX_RESULTS = 20;

    private final Directory directory;

    private final StandardAnalyzer analyzer =
            new StandardAnalyzer();

    public LogSearcher(Directory directory) {

        this.directory =
                Objects.requireNonNull(
                        directory,
                        "directory must not be null"
                );
    }

    // =========================================================
    // SEARCH LOGS
    // =========================================================

    public List<LogSearchResult> search(
            String keyword
    ) throws LogSearchException {

        return search(
                keyword,
                DEFAULT_MAX_RESULTS
        );
    }

    public List<LogSearchResult> search(
            String keyword,
            int maxResults
    ) throws LogSearchException {

        if (keyword == null ||
                keyword.isBlank()) {

            return List.of();
        }

        int boundedMaxResults =
                Math.min(
                        Math.max(maxResults, 1),
                        100
                );

        List<LogSearchResult> results =
                new ArrayList<>();

        try (IndexReader reader =
                     DirectoryReader.open(directory)) {

            IndexSearcher searcher =
                    new IndexSearcher(reader);

            String searchText =
                    keyword.trim();

            BooleanQuery.Builder queryBuilder =
                    new BooleanQuery.Builder();

            // -------------------------
            // Message search
            // -------------------------

            Query messageQuery =
                    new QueryParser(
                            MESSAGE_FIELD,
                            analyzer
                    ).parse(
                            QueryParser.escape(
                                    searchText
                            )
                    );

            queryBuilder.add(
                    messageQuery,
                    BooleanClause.Occur.SHOULD
            );

            // -------------------------
            // Service search
            // -------------------------

            queryBuilder.add(
                    new TermQuery(
                            new Term(
                                    SERVICE_FIELD,
                                    searchText.toLowerCase()
                            )
                    ),
                    BooleanClause.Occur.SHOULD
            );

            // -------------------------
            // Level search
            // -------------------------

            queryBuilder.add(
                    new TermQuery(
                            new Term(
                                    LEVEL_FIELD,
                                    searchText.toUpperCase()
                            )
                    ),
                    BooleanClause.Occur.SHOULD
            );

            Query finalQuery =
                    queryBuilder.build();

            TopDocs topDocs =
                    searcher.search(
                            finalQuery,
                            boundedMaxResults
                    );

            var storedFields =
                    searcher.storedFields();

            for (ScoreDoc scoreDoc :
                    topDocs.scoreDocs) {

                Document document =
                        storedFields.document(
                                scoreDoc.doc
                        );

                String message =
                        document.get(
                                MESSAGE_FIELD
                        );

                String service =
                        document.get(
                                SERVICE_FIELD
                        );

                String level =
                        document.get(
                                LEVEL_FIELD
                        );

                results.add(
                        new LogSearchResult(
                                message,
                                service,
                                level,
                                scoreDoc.score
                        )
                );
            }

        } catch (Exception e) {

            throw new LogSearchException(
                    "Search failed: "
                            + e.getMessage(),
                    e
            );
        }

        return results;
    }

    // =========================================================
    // RECENT LOGS
    // =========================================================

    /**
     * GET /api/logs/recent?limit=20
     *
     * Returns newest logs first.
     */
    public List<RecentLog> getRecentLogs(
            int limit
    ) throws LogSearchException {

        int boundedLimit =
                Math.min(
                        Math.max(limit, 1),
                        100
                );

        List<RecentLog> results =
                new ArrayList<>();

        try (IndexReader reader =
                     DirectoryReader.open(directory)) {

            IndexSearcher searcher =
                    new IndexSearcher(reader);

            /*
             * Match every document in the index.
             */
            Query query =
                    new MatchAllDocsQuery();

            /*
             * Newest timestamp first.
             *
             * LogIndexer stores timestamp_ms
             * as NumericDocValuesField.
             */
            Sort sort =
                    new Sort(
                            new SortField(
                                    TIMESTAMP_FIELD,
                                    SortField.Type.LONG,
                                    true
                            )
                    );

            TopDocs topDocs =
                    searcher.search(
                            query,
                            boundedLimit,
                            sort
                    );

            var storedFields =
                    searcher.storedFields();

            for (ScoreDoc scoreDoc :
                    topDocs.scoreDocs) {

                Document document =
                        storedFields.document(
                                scoreDoc.doc
                        );

                String message =
                        document.get(
                                MESSAGE_FIELD
                        );

                String service =
                        document.get(
                                SERVICE_FIELD
                        );

                String level =
                        document.get(
                                LEVEL_FIELD
                        );

                /*
                 * IMPORTANT:
                 *
                 * timestamp_ms was stored as a numeric
                 * StoredField, so document.get()
                 * is NOT the correct way to read it.
                 */
                var timestampField =
                        document.getField(
                                TIMESTAMP_FIELD
                        );

                String timestamp = null;

                if (timestampField != null &&
                        timestampField.numericValue() != null) {

                    long epochMillis =
                            timestampField
                                    .numericValue()
                                    .longValue();

                    timestamp =
                            Instant
                                    .ofEpochMilli(
                                            epochMillis
                                    )
                                    .toString();
                }

                results.add(
                        new RecentLog(
                                timestamp,
                                service,
                                level,
                                message
                        )
                );
            }

        } catch (Exception e) {

            throw new LogSearchException(
                    "Failed to get recent logs: "
                            + e.getMessage(),
                    e
            );
        }

        return results;
    }

    // =========================================================
    // SERVICES
    // =========================================================

    /**
     * GET /api/logs/services
     *
     * Returns services found in the Lucene index.
     */
    public List<ServiceSummary> getServices()
            throws LogSearchException {

        Map<String, ServiceData> services =
                new LinkedHashMap<>();

        try (IndexReader reader =
                     DirectoryReader.open(directory)) {

            var storedFields =
                    reader.storedFields();

            for (int docId = 0;
                 docId < reader.maxDoc();
                 docId++) {

                Document document =
                        storedFields.document(
                                docId
                        );

                String service =
                        document.get(
                                SERVICE_FIELD
                        );

                String level =
                        document.get(
                                LEVEL_FIELD
                        );

                if (service == null ||
                        service.isBlank()) {

                    continue;
                }

                ServiceData data =
                        services.computeIfAbsent(
                                service,
                                key -> new ServiceData()
                        );

                data.logCount++;

                if ("ERROR".equalsIgnoreCase(
                        level
                )) {

                    data.errorCount++;
                }
            }

        } catch (Exception e) {

            throw new LogSearchException(
                    "Failed to get services: "
                            + e.getMessage(),
                    e
            );
        }

        List<ServiceSummary> result =
                new ArrayList<>();

        services.forEach(
                (name, data) ->
                        result.add(
                                new ServiceSummary(
                                        name,
                                        data.logCount,
                                        data.errorCount
                                )
                        )
        );

        return result;
    }

    // =========================================================
    // INTERNAL DATA
    // =========================================================

    private static class ServiceData {

        long logCount;

        long errorCount;
    }

    // =========================================================
    // RESPONSE RECORDS
    // =========================================================

    public record LogSearchResult(
            String message,
            String service,
            String level,
            float score
    ) {
    }

    public record RecentLog(
            String timestamp,
            String service,
            String level,
            String message
    ) {
    }

    public record ServiceSummary(
            String name,
            long logCount,
            long errorCount
    ) {
    }

    // =========================================================
    // EXCEPTION
    // =========================================================

    public static class LogSearchException
            extends Exception {

        public LogSearchException(
                String message,
                Throwable cause
        ) {
            super(message, cause);
        }
    }
}