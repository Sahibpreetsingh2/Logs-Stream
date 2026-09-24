package com.logstream.backend.controller;

import com.logstream.backend.alert.AlertChecker;
import com.logstream.backend.index.LogIndexer;
import com.logstream.backend.model.LogEntry;
import com.logstream.backend.search.LogSearcher;
import com.logstream.backend.service.LogProcessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final LogProcessingService processingService;
    private final LogIndexer logIndexer;
    private final AlertChecker alertChecker;
    private final LogSearcher logSearcher;

    public LogController(
            LogProcessingService processingService,
            LogIndexer logIndexer,
            AlertChecker alertChecker,
            LogSearcher logSearcher
    ) {
        this.processingService = processingService;
        this.logIndexer = logIndexer;
        this.alertChecker = alertChecker;
        this.logSearcher = logSearcher;
    }

    /**
     * POST /api/logs
     *
     * Ingest a new log.
     */
    @PostMapping
    public ResponseEntity<?> ingestLog(
            @RequestBody LogEntry logEntry
    ) {

        try {

            // 1. Process the incoming log
            LogEntry processedLog =
                    processingService.processLog(logEntry);

            // 2. Index the processed log
            logIndexer.indexLog(processedLog);

            // 3. Check alert rules
            alertChecker.checkLog(processedLog);

            /*
             * Return the actual LogEntry because
             * the frontend expects LogEntry from POST /api/logs.
             */
            return ResponseEntity.ok(processedLog);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new LogResponse(
                                    e.getMessage(),
                                    false
                            )
                    );

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            new LogResponse(
                                    "Failed to process log: "
                                            + e.getMessage(),
                                    false
                            )
                    );
        }
    }

    /**
     * GET /api/logs/recent?limit=20
     *
     * Return the latest indexed logs.
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentLogs(
            @RequestParam(defaultValue = "20") int limit
    ) {

        if (limit < 1 || limit > 100) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new LogResponse(
                                    "limit must be between 1 and 100",
                                    false
                            )
                    );
        }

        try {

            return ResponseEntity.ok(
                    logSearcher.getRecentLogs(limit)
            );

        } catch (LogSearcher.LogSearchException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            new LogResponse(
                                    e.getMessage(),
                                    false
                            )
                    );
        }
    }

    /**
     * GET /api/logs/services
     *
     * Return services found in the Lucene index.
     */
    @GetMapping("/services")
    public ResponseEntity<?> getServices() {

        try {

            return ResponseEntity.ok(
                    logSearcher.getServices()
            );

        } catch (LogSearcher.LogSearchException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            new LogResponse(
                                    e.getMessage(),
                                    false
                            )
                    );
        }
    }

    public record LogResponse(
            String message,
            boolean success
    ) {
    }
}